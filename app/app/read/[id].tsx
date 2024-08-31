import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { ExternalLink } from "~/components/ExternalLink";
import { Badge } from "~/components/ui/badge";
import { useColorScheme } from "~/hooks/useColorScheme";
import { Colors } from "~/lib/constants";
import { ChevronLeftIcon, ExternalLink as ExternalLinkIcon } from "~/lib/icons";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "~/components/ui/skeleton";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AudioPlayer from "~/components/audio-player";
import { Separator } from "~/components/ui/separator";
import { useState } from "react";
import { cn } from "~/lib/utils";

type Content = {
  original: string;
  translated: string;
  title: string;
  author: string;
  publishedTime: string;
  url: string;
};

const fetchContent = async (url: string): Promise<Content> => {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/process-link`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    }
  );
  return response.json();
};

const url = "https://www.bbc.com/news/articles/c8ergpxnd8xo";

export default function AudioReaderPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colorScheme } = useColorScheme();
  const [language, setLanguage] = useState<"en" | "my">("my");

  let { data, isLoading, error } = useQuery({
    queryKey: ["content", url],
    queryFn: () => fetchContent(url),
  });

  return (
    <View className='container py-16 px-4 h-full'>
      <View className='flex-row items-center justify-between'>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeftIcon color={Colors[colorScheme ?? "light"].icon} />
        </TouchableOpacity>
      </View>
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
                      {data?.url}
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
                "pt-2": language === "my",
              })}
            >
              {language === "en" ? data?.original : data?.translated}
            </Text>
          )}
        </View>
      </ScrollView>
      <Separator className='my-2' />
      <View className='mt-4'>
        {
          <AudioPlayer
            text={language === "en" ? data?.original : data?.translated}
            textLoading={isLoading}
            language={language}
            setLanguage={setLanguage}
          />
        }
      </View>
    </View>
  );
}
