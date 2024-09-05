import "~/global.css";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform } from "react-native";
import { useColorScheme } from "~/hooks/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import TrackPlayer from "react-native-track-player";
import { playbackService, setupPlayer } from "~/lib/track-player";
import { DARK_THEME, LIGHT_THEME } from "~/lib/constants";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DatabaseProvider } from "~/db/provider";
import { useMigrationHelper } from "~/db/drizzle";
import { SafeAreaProvider } from "react-native-safe-area-context";
export { ErrorBoundary } from "expo-router";

TrackPlayer.registerPlaybackService(() => playbackService);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);
  const { success, error: migrationError } = useMigrationHelper();

  React.useEffect(() => {
    (async () => {
      await setupPlayer();

      const theme = await AsyncStorage.getItem("theme");
      if (Platform.OS === "web") {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add("bg-background");
      }
      if (!theme) {
        AsyncStorage.setItem("theme", colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === "dark" ? "dark" : "light";
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);

        setIsColorSchemeLoaded(true);
        return;
      }
      setIsColorSchemeLoaded(true);
    })()
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        SplashScreen.hideAsync();
      });
  }, []);

  if (!isColorSchemeLoaded || error || migrationError || !success) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const queryClient = new QueryClient();
  const { isDarkColorScheme } = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <DatabaseProvider>
          <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
          <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              />
            </GestureHandlerRootView>
          </SafeAreaProvider>
          <PortalHost />
        </DatabaseProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
