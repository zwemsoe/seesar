import { useColorScheme } from "~/hooks/useColorScheme";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { useTranslation } from "react-i18next";
import { cn, getAudioFileName } from "~/lib/utils";
import { Trash } from "~/lib/icons";
import { Colors, QueryKeys } from "~/lib/constants";
import * as FileSystem from "expo-file-system";
import { useDatabase } from "~/db/provider";
import { LinkContent, linkContentTable } from "~/db/schema";
import { useQueryClient } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { useRouter } from "expo-router";
import { useCurrentReaderStore } from "~/state/store";
import TrackPlayer from "react-native-track-player";
import { getTrackId } from "~/lib/track-player";

export const DeleteFileButton = ({ url }: { url: string }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { db } = useDatabase();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const { colorScheme } = useColorScheme();
  const activeTrack = useCurrentReaderStore((state) => state.activeTrack);
  const setActiveTrack = useCurrentReaderStore((state) => state.setActiveTrack);

  const handleDeleteFile = async () => {
    if (
      activeTrack?.id === getTrackId(url, "en") ||
      activeTrack?.id === getTrackId(url, "mm")
    ) {
      await TrackPlayer.reset();
      setActiveTrack(undefined);
    }

    try {
      const enFileUri = await getAudioFileName(url, "en");
      const mmFileUri = await getAudioFileName(url, "mm");
      const enFileExists = await FileSystem.getInfoAsync(enFileUri);
      const mmFileExists = await FileSystem.getInfoAsync(mmFileUri);
      if (enFileExists.exists) {
        await FileSystem.deleteAsync(enFileUri);
      }
      if (mmFileExists.exists) {
        await FileSystem.deleteAsync(mmFileUri);
      }
      await db
        ?.delete(linkContentTable)
        .where(eq(linkContentTable.url, url))
        .returning();
      queryClient.setQueryData(
        QueryKeys.yourLinks,
        (oldData: LinkContent[]) => {
          return oldData?.filter((item: LinkContent) => item.url !== url);
        }
      );

      router.navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='ghost' className='pt-4'>
          <Trash color={Colors[colorScheme ?? "light"].icon} size={18} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='w-4/5'>
        <AlertDialogHeader>
          <AlertDialogTitle
            className={cn("leading-loose", {
              "py-4": currentLanguage === "mm",
            })}
          >
            {t("confirmDelete")}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Text>Cancel</Text>
          </AlertDialogCancel>
          <AlertDialogAction onPress={handleDeleteFile}>
            <Text>OK</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
