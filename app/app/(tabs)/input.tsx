import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { useCurrentReaderStore } from "~/state/store";

const urlSchema = z.string().url().min(1);

export default function InputScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const setUrl = useCurrentReaderStore((state) => state.setUrl);

  const handleSubmit = () => {
    try {
      urlSchema.parse(value);
      setUrl(value.trim());
      setError("");
      setValue("");
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

      {error && (
        <Text className='text-red-500 text-sm text-center mt-4 leading-loose'>
          {t("invalidInput")}
        </Text>
      )}

      <Button className='mt-10' onPress={handleSubmit}>
        <Text
          className={cn("leading-loose", {
            "pt-1.5": currentLanguage === "mm",
          })}
        >
          {t("translate")}
        </Text>
      </Button>
    </ScrollView>
  );
}
