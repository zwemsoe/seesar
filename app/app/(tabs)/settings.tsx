import { useTranslation } from "react-i18next";
import { StyleSheet, ScrollView, View } from "react-native";
import { ChangeLanguageButtonDialog } from "~/components/ChangeLanguageButtonDialog";
import { DeleteFilesButton } from "~/components/DeleteFilesButton";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/hooks/useColorScheme";
import { Colors } from "~/lib/constants";
import { FacebookIcon, InstagramIcon, ExternalLink } from "~/lib/icons";
import { cn } from "~/lib/utils";

export default function ProfileScreen() {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;
  const { colorScheme, isDarkColorScheme } = useColorScheme();

  return (
    <ScrollView contentContainerClassName='flex-1 items-center gap-4 pt-4'>
      <ChangeLanguageButtonDialog />
      <DeleteFilesButton />
      <View className='flex-1'></View>
      <Button
        className={cn("w-11/12 justify-between flex-row", {
          "border-black": !isDarkColorScheme,
          "border-white": isDarkColorScheme,
        })}
        variant='outline'
      >
        <FacebookIcon color={Colors[colorScheme ?? "light"].icon} size={18} />
        <Text>Facebook</Text>
        <ExternalLink color={Colors[colorScheme ?? "light"].icon} size={18} />
      </Button>
      <Button
        className={cn("w-11/12 justify-between flex-row  mb-10", {
          "border-black": !isDarkColorScheme,
          "border-white": isDarkColorScheme,
        })}
        variant='outline'
      >
        <InstagramIcon color={Colors[colorScheme ?? "light"].icon} size={18} />
        <Text>Instagram</Text>
        <ExternalLink color={Colors[colorScheme ?? "light"].icon} size={18} />
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
