import { StyleSheet, ScrollView, View } from "react-native";
import { ChangeLanguageButtonDialog } from "~/components/ChangeLanguageButtonDialog";
import { DeleteFilesButton } from "~/components/DeleteFilesButton";
import { ExternalLink } from "~/components/ExternalLink";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/hooks/useColorScheme";
import { Colors } from "~/lib/constants";
import { ExternalLink as ExternalLinkIcon } from "~/lib/icons";
import { cn } from "~/lib/utils";

export default function ProfileScreen() {
  const { colorScheme, isDarkColorScheme } = useColorScheme();

  return (
    <ScrollView contentContainerClassName='flex-1 items-center gap-4 pt-4'>
      <ChangeLanguageButtonDialog />
      <DeleteFilesButton />
      <View className='flex-1'></View>
      <ExternalLink href='https://forms.gle/NijaX9uzfYLqHBNJA' asChild>
        <Button
          className={cn("w-11/12 mb-10 justify-between flex-row", {
            "border-black": !isDarkColorScheme,
            "border-white": isDarkColorScheme,
          })}
          variant='outline'
        >
          <Text>Give us feedback</Text>
          <ExternalLinkIcon
            color={Colors[colorScheme ?? "light"].icon}
            size={18}
          />
        </Button>
      </ExternalLink>

      {/* <Button
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
      </Button> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
