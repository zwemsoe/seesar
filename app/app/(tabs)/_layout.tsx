import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Colors } from "~/lib/constants";
import { Home, Plus, CircleUser, XIcon, Moon, Sun } from "~/lib/icons";
import { useColorScheme } from "~/hooks/useColorScheme";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { TouchableOpacity, View } from "react-native";
import { Toggle, ToggleIcon } from "~/components/ui/toggle";
import { HelloWave } from "~/components/HelloWave";
import { cn } from "~/lib/utils";
import "~/translations";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const { t } = useTranslation();
  const router = useRouter();

  const { colorScheme, toggleColorScheme, isDarkColorScheme } =
    useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        headerTitle: "",
        headerShadowVisible: false,
        headerStyle: {
          height: 110,
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Home color={color} strokeWidth={focused ? 2.3 : 1.8} />
          ),
          headerTitle: () => (
            <View className='w-full flex-row items-center gap-4'>
              <Text className='text-3xl font-bold leading-loose'>
                {t("welcome")}
              </Text>
              <HelloWave />
            </View>
          ),
          headerTitleAlign: "left",
        }}
      />

      <Tabs.Screen
        name='input'
        options={{
          title: undefined,
          tabBarButton: (props) => (
            <Button
              {...props}
              style={{
                width: 55,
                height: 55,
              }}
              className={cn(
                "border-2 border-black mt-1 rounded-full bg-black",
                {
                  "border-black": !isDarkColorScheme,
                  "bg-white": isDarkColorScheme,
                }
              )}
            >
              <Plus
                className={cn("text-white", {
                  "text-black": isDarkColorScheme,
                })}
              />
            </Button>
          ),
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <XIcon color={Colors[colorScheme ?? "light"].icon} />
            </TouchableOpacity>
          ),
          headerTitleAlign: "left",
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <CircleUser color={color} strokeWidth={focused ? 2.3 : 1.8} />
          ),
          headerTitle: () => (
            <View className='w-full flex-row justify-between items-center'>
              <Text className='text-3xl font-bold leading-loose'>
                {t("profile")}
              </Text>
              <Toggle
                pressed={isDarkColorScheme}
                onPressedChange={toggleColorScheme}
                aria-label='Toggle dark mode'
                variant='outline'
              >
                <ToggleIcon icon={isDarkColorScheme ? Moon : Sun} size={20} />
              </Toggle>
            </View>
          ),
          headerTitleAlign: "left",
        }}
      />
    </Tabs>
  );
}
