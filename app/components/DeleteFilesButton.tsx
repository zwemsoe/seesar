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
import { cn } from "~/lib/utils";
import { Trash } from "~/lib/icons";
import { AUDIO_FILE_PREFIX, Colors } from "~/lib/constants";
import * as FileSystem from "expo-file-system";
import { useDatabase } from "~/db/provider";
import { linkContentTable } from "~/db/schema";
import { useQueryClient } from "@tanstack/react-query";

export const DeleteFilesButton = () => {
  const queryClient = useQueryClient();
  const { db } = useDatabase();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const { colorScheme } = useColorScheme();

  const handleDeleteFiles = async () => {
    const cacheDir = FileSystem.cacheDirectory ?? "";
    const files = await FileSystem.readDirectoryAsync(cacheDir);

    for (const file of files) {
      if (file.startsWith(AUDIO_FILE_PREFIX)) {
        await FileSystem.deleteAsync(`${cacheDir}/${file}`);
      }
    }

    await db?.delete(linkContentTable);
    queryClient.invalidateQueries();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className='w-11/12 flex-row justify-between items-center'
          variant='secondary'
        >
          <Text
            className={cn("leading-loose", {
              "py-2": currentLanguage === "mm",
            })}
          >
            {t("deleteFiles")}
          </Text>
          <Trash color={Colors[colorScheme ?? "light"].icon} size={18} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle
            className={cn("leading-loose", {
              "py-4": currentLanguage === "mm",
            })}
          >
            {t("deleteFilesConfirmation")}
          </AlertDialogTitle>
          <AlertDialogDescription
            className={cn("leading-loose", {
              "py-2": currentLanguage === "mm",
            })}
          >
            {t("deleteFilesConfirmationDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Text>Cancel</Text>
          </AlertDialogCancel>
          <AlertDialogAction onPress={handleDeleteFiles}>
            <Text>OK</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
