import { Tabs } from "expo-router";
import React from "react";
import { Colors } from "~/lib/constants";
import { Home, Plus, CircleUser } from "~/lib/icons";
import { useColorScheme } from "~/hooks/useColorScheme";
import { Button } from "~/components/ui/button";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => <Home color={color} />,
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
                // height: "100%",
                marginTop: 6,
              }}
            >
              <Plus />
            </Button>
          ),
        }}
      />
      <Tabs.Screen
        name='account'
        options={{
          title: "Account",
          tabBarIcon: ({ color, focused }) => <CircleUser color={color} />,
        }}
      />
    </Tabs>
  );
}
