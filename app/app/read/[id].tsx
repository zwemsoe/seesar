import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { ExternalLink } from "~/components/ExternalLink";
import { Badge } from "~/components/ui/badge";
import { useColorScheme } from "~/hooks/useColorScheme";
import { Colors } from "~/lib/constants";
import { ChevronLeftIcon, ExternalLink as ExternalLinkIcon } from "~/lib/icons";
import Markdown from "react-native-markdown-display";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "~/components/ui/skeleton";

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

export default function AudioReaderPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colorScheme } = useColorScheme();
  const { data, isLoading, error } = useQuery({
    queryKey: ["content", id],
    queryFn: () => fetchContent(id as string),
  });

  return (
    <View className='container py-20 px-4 h-full'>
      <View className='flex-row items-center justify-between'>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeftIcon color={Colors[colorScheme ?? "light"].icon} />
        </TouchableOpacity>
      </View>
      <View className='flex-col mt-3.5 px-2 pb-4 border-b border-gray-300'>
        {isLoading ? (
          <>
            <Skeleton className='h-5 w-28 mt' />
            <Skeleton className='h-6 w-full mt-3' />
            <Skeleton className='h-6 w-80 mt-2' />
            <Skeleton className='h-5 w-40 mt-4' />
            <Skeleton className='h-5 w-40 mt-2' />
          </>
        ) : (
          <View className='flex-row'>
            <>
              <Badge variant='secondary'>
                <ExternalLink href='https://www.google.com'>
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
              <Text className='text-xl font-bold mt-3 color-primary'>
                {data?.title}
              </Text>
              <Text className='text-md font-semibold text-gray-500 mt-4'>
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
          </View>
        )}
      </View>
      <View className='flex-1 px-2 border-b border-gray-300'>
        {isLoading ? (
          <View className='mt-2'>
            {Array.from({ length: 15 }).map((_, index) => (
              <Skeleton key={index} className='h-5 w-full mt-3' />
            ))}
          </View>
        ) : (
          <ScrollView className='mt-2'>
            <Markdown
              style={{
                paragraph: {
                  letterSpacing: 1,
                  color: Colors[colorScheme ?? "light"].text,
                },
              }}
            >
              {data?.translated || ""}
            </Markdown>
          </ScrollView>
        )}
      </View>
      <View className='mb-5'>
        <Text className='text-md font-semibold text-gray-500 my-5 px-2'>
          Audio Player
        </Text>
      </View>
    </View>
  );
}
