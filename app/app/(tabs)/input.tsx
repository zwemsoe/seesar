import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet } from "react-native";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { useCurrentReaderStore } from "~/state/store";

const urlSchema = z.string().url().min(1);

export default function InputScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const setUrl = useCurrentReaderStore((state) => state.setUrl);

  const handleSubmit = () => {
    try {
      urlSchema.parse(value);
      setUrl(value);
      router.push("/reader");
    } catch (error) {
      setError("Invalid Input");
    }
  };

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

      {error && <Text className='text-red-500'>{error}</Text>}

      <Button className='mt-10  w-3/12' onPress={handleSubmit}>
        <Text>Listen</Text>
      </Button>
    </ScrollView>
  );
}
