import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "~/hooks/useColorScheme";
import { SupportedLanguages } from "~/translations";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { cn } from "~/lib/utils";
import { RadioGroup, RadioGroupItemWithLabel } from "./ui/radio-group";
import { View } from "react-native";
import { SquarePenIcon } from "~/lib/icons";
import { Colors } from "~/lib/constants";

export function ChangeLanguageButtonDialog() {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;
  const { isDarkColorScheme, colorScheme } = useColorScheme();

  const [locale, setLocale] = useState<SupportedLanguages>(
    currentLanguage as SupportedLanguages
  );

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem("language");
      if (savedLanguage) {
        i18n.changeLanguage(savedLanguage);
      }
    };
    loadLanguage();
  }, [i18n]);

  const changeLanguage = async (lang: string) => {
    await AsyncStorage.setItem("language", lang);
    i18n.changeLanguage(lang);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='secondary'
          className={cn(
            "w-11/12 justify-between flex-row  min-h-14 items-center",
            {
              "border-gray-300": !isDarkColorScheme,
              "border-white": isDarkColorScheme,
            }
          )}
        >
          <View className='flex-row items-center'>
            <Text
              className={cn("leading-loose", {
                "py-2": currentLanguage === "mm",
              })}
            >
              {`${t("language")} (${currentLanguage === "en" ? "🇬🇧" : "🇲🇲"})`}
            </Text>
          </View>
          <SquarePenIcon
            size={18}
            color={Colors[colorScheme ?? "light"].icon}
          />
        </Button>
      </DialogTrigger>
      <DialogContent className='min-w-full'>
        <DialogHeader>
          <DialogTitle
            className={cn("leading-loose", {
              "pt-3": currentLanguage === "mm",
            })}
          >
            {t("changeLanguage")}
          </DialogTitle>
        </DialogHeader>
        <RadioGroup
          value={locale}
          onValueChange={(value) => setLocale(value as SupportedLanguages)}
          className='gap-5 my-3'
        >
          <RadioGroupItemWithLabel
            value='mm'
            label='မြန်မာ (🇲🇲)'
            onLabelPress={() => setLocale("mm")}
          />
          <RadioGroupItemWithLabel
            value='en'
            label='English (🇬🇧)'
            onLabelPress={() => setLocale("en")}
          />
        </RadioGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button onPress={() => changeLanguage(locale)}>
              <Text>OK</Text>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
