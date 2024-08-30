import { useTranslation } from "react-i18next";
import { StyleSheet, ScrollView, View } from "react-native";
import { ChangeLanguageButtonDialog } from "~/components/ChangeLanguageButtonDialog";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/hooks/useColorScheme";
import { Colors } from "~/lib/constants";
import { Circle, FacebookIcon, InstagramIcon, ExternalLink } from "~/lib/icons";
import { cn } from "~/lib/utils";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { colorScheme, isDarkColorScheme } = useColorScheme();

  return (
    <ScrollView contentContainerClassName='flex-1 items-center gap-4'>
      <Card
        className={cn("w-11/12 mt-5 mb-3", {
          "border-white": isDarkColorScheme,
        })}
      >
        <CardHeader>
          <View className='flex-row gap-5 items-center'>
            <Circle fill='grey' size={50} color='grey' />
            <CardTitle className='text-md'>{t("profileOpenAccount")}</CardTitle>
          </View>
        </CardHeader>
      </Card>

      <ChangeLanguageButtonDialog />
      <Button className='w-11/12' variant='secondary'>
        <Text>Sign Out</Text>
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
