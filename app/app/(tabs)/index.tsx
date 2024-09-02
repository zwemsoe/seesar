import { useQuery } from "@tanstack/react-query";
import { desc } from "drizzle-orm";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { Link2, AudioLines } from "~/lib/icons";
import {
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";
import { LocalDatabase, useDatabase } from "~/db/provider";
import { LinkContent, linkContentTable } from "~/db/schema";
import { useColorScheme } from "~/hooks/useColorScheme";
import { Colors } from "~/lib/constants";
import { cn, truncateString } from "~/lib/utils";
import { useCurrentReaderStore } from "~/state/store";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { useTranslation } from "react-i18next";

const fetchYourLinks = async (db: LocalDatabase) => {
  if (!db) {
    throw new Error("Database is not initialized");
  }

  const result = await db
    .select()
    .from(linkContentTable)
    .orderBy(desc(linkContentTable.updatedAt));

  return result;
};

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const router = useRouter();
  const { db } = useDatabase();
  const setUrl = useCurrentReaderStore((state) => state.setUrl);
  const { colorScheme } = useColorScheme();

  let { data, isLoading, error } = useQuery<LinkContent[]>({
    queryKey: ["your_links"],
    queryFn: () => fetchYourLinks(db),
    refetchOnMount: true,
  });

  return (
    <ScrollView contentContainerClassName='flex-1 pt-4 px-5'>
      <Text className='text-2xl font-bold mb-4 leading-loose'>
        {t("yourFiles")}
      </Text>

      {error && (
        <View className='p-2 border border-red-500 rounded-lg mb-4'>
          <Text className='text-red-500 font-medium text-md text-center leading-loose'>
            {t("serverError")}
          </Text>
        </View>
      )}

      {data && data.length > 0 ? (
        data.map((item) => (
          <TouchableOpacity
            key={item.url}
            onPress={() => {
              setUrl(item.url);
              router.push(`/reader`);
            }}
            className='flex-row items-center gap-4 border-b border-gray-200 pb-4 mb-4'
          >
            <View className='p-2 bg-primary rounded-lg w-12 h-12 items-center justify-center'>
              <Link2
                size={18}
                color={Colors[colorScheme ?? "light"].background}
              />
            </View>
            <View className='flex-col'>
              <Text className='font-medium'>
                {truncateString(item.title ?? "", 40)}
              </Text>
              <Text className='text-sm text-gray-500 font-semibold'>
                {`${item.siteName}`}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      ) : isLoading ? (
        <View className='flex-row items-center gap-4 border-b border-gray-200 pb-4 mb-4'>
          <Skeleton className='w-12 h-12 rounded-lg' />
          <View className='flex-col w-full'>
            <Skeleton className='w-4/5 h-6' />
            <Skeleton className='w-20 h-4 mt-1' />
          </View>
        </View>
      ) : (
        <Button
          variant='outline'
          onPress={() => router.push("/input")}
          className={cn("", {
            "min-h-14": currentLanguage === "mm",
          })}
        >
          <Text
            className={cn("leading-loose", {
              "py-1.5": currentLanguage === "mm",
            })}
          >
            {t("addYourFirstFile")}
          </Text>
        </Button>
      )}

      <Text className='text-2xl font-bold mb-3 mt-10 leading-loose'>
        {t("samples")}
      </Text>
      {Array.from({ length: 5 }).map((item) => (
        <TouchableOpacity
          key={Math.random()}
          //  onPress={() => {
          //    setUrl(item.url);
          //    router.push(`/reader`);
          //  }}
          className='flex-row items-center gap-4 border-b border-gray-200 pb-4 mb-4'
        >
          <View className='p-2 bg-secondary rounded-lg w-12 h-12 items-center justify-center'>
            <AudioLines size={18} color={Colors[colorScheme ?? "light"].icon} />
          </View>
          <View className='flex-col'>
            <Text className='font-medium'>The Little Prince</Text>
            <Text className='text-sm text-gray-500 font-semibold'>
              {`10mins`}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
