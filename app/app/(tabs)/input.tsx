import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";

export default function InputScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [value, setValue] = useState("");

  return (
    <ScrollView contentContainerClassName='flex-1 justify-center items-center'>
      <Text className='text-xl font-bold text-center max-w-xs leading-loose'>
        {t("inputTitle")}
      </Text>

      <Textarea
        placeholder='https://...'
        value={value}
        onChangeText={setValue}
        className='w-10/12 mt-10'
      />

      <Button
        className='mt-10  w-3/12'
        onPress={() => router.push(`/read/123`)}
      >
        <Text>Listen</Text>
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
