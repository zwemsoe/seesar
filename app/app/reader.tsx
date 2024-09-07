import { useRouter } from "expo-router";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { ExternalLink } from "~/components/ExternalLink";
import { Badge } from "~/components/ui/badge";
import { useColorScheme } from "~/hooks/useColorScheme";
import { Colors, QueryKeys } from "~/lib/constants";
import { ChevronLeftIcon, ExternalLink as ExternalLinkIcon } from "~/lib/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "~/components/ui/skeleton";
import AudioPlayer from "~/components/audio-player";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { useCurrentReaderStore } from "~/state/store";
import { LinkContent } from "~/db/schema";
import { useDatabase } from "~/db/provider";
import { processUrl } from "~/lib/process-url";
import { useTranslation } from "react-i18next";
import { DeleteFileButton } from "~/components/DeleteFileButton";

export default function AudioReaderPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { db } = useDatabase();
  const router = useRouter();
  const url = useCurrentReaderStore((state) => state.url);
  const language = useCurrentReaderStore((state) => state.language);
  const { colorScheme } = useColorScheme();

  let { data, isLoading, error } = useQuery<LinkContent>({
    queryKey: QueryKeys.linkContent(url),
    queryFn: () => processUrl(url, db, queryClient),
    enabled: !!url,
  });

  const urlHostname =
    data?.url && data.url.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0];

  return (
    <View className='container py-16 px-4 h-full'>
      <View className='flex-row items-center justify-between'>
        <TouchableOpacity onPress={() => router.navigate("/")}>
          <ChevronLeftIcon color={Colors[colorScheme ?? "light"].icon} />
        </TouchableOpacity>
        <DeleteFileButton url={url} />
      </View>
      {error ? (
        <View className='flex-1 items-center justify-center h-full'>
          <Text className='text-lg font-semibold leading-loose text-center text-red-500'>
            {t("serverError")}
          </Text>
        </View>
      ) : (
        <>
          <ScrollView className='flex-1 mt-3.5'>
            <View className='flex-col pb-4'>
              {isLoading ? (
                <>
                  <Skeleton className='h-5 w-28 mt' />
                  <Skeleton className='h-6 w-full mt-3' />
                  <Skeleton className='h-6 w-80 mt-2' />
                  <Skeleton className='h-5 w-40 mt-2' />
                  <Skeleton className='h-5 w-40 mt-2' />
                </>
              ) : (
                <>
                  <View className='flex-row'>
                    <Badge variant='secondary'>
                      <ExternalLink href={url}>
                        <Text className='text-sm color-primary'>
                          {urlHostname}
                          {"  "}
                          <ExternalLinkIcon
                            color={Colors[colorScheme ?? "light"].icon}
                            size={12}
                          />
                        </Text>
                      </ExternalLink>
                    </Badge>
                  </View>
                  <Text className='text-xl font-bold mt-3 color-primary'>
                    {data?.title}
                  </Text>
                  <Text className='text-md font-semibold text-gray-500 mt-2'>
                    {data?.author}
                  </Text>
                  <Text className='text-md font-semibold text-gray-500 mt-2'>
                    {data?.publishedTime &&
                      new Date(data.publishedTime).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                  </Text>
                </>
              )}
            </View>
            <Separator className='mb-2' />
            <View className='px-1'>
              {isLoading ? (
                <View>
                  {Array.from({ length: 12 }).map((_, index) => (
                    <Skeleton key={index} className='h-5 w-full my-2' />
                  ))}
                </View>
              ) : (
                <Text
                  className={cn("text-primary leading-loose text-lg", {
                    "pt-2": language === "mm",
                  })}
                >
                  {language === "en" ? data?.textEn : data?.textMM}
                </Text>
              )}
            </View>
          </ScrollView>
          <Separator className='my-2' />
          <View className='mt-4'>
            <AudioPlayer
              text={language === "en" ? data?.textEn : data?.textMM}
              url={url}
              textLoading={isLoading}
              title={data?.title ?? ""}
              siteName={urlHostname ?? ""}
            />
          </View>
        </>
      )}
    </View>
  );
}
