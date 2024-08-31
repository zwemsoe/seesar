import { Trash } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, ScrollView, View } from "react-native";
import { ChangeLanguageButtonDialog } from "~/components/ChangeLanguageButtonDialog";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/hooks/useColorScheme";
import { Colors } from "~/lib/constants";
import { FacebookIcon, InstagramIcon, ExternalLink } from "~/lib/icons";
import { cn } from "~/lib/utils";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { colorScheme, isDarkColorScheme } = useColorScheme();

  return (
    <ScrollView contentContainerClassName='flex-1 items-center gap-4 pt-4'>
      <ChangeLanguageButtonDialog />
      <Button
        className='w-11/12 flex-row justify-between items-center'
        variant='secondary'
      >
        <Text className='text-primary'>Clear local storage</Text>
        <Trash color={Colors[colorScheme ?? "light"].icon} size={18} />
      </Button>
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
