import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { Stack, useRouter } from "expo-router";
import { ShareIntentProvider } from "expo-share-intent";
import { setStatusBarStyle } from 'expo-status-bar';
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider, useTheme } from "react-native-paper";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useEffect(() => {
    console.log(colorScheme);
    setStatusBarStyle(colorScheme === 'dark' ? 'light' : 'dark');
  }, [colorScheme]);
  const { theme } = useMaterial3Theme();
  const router = useRouter();
  const paperTheme =
    colorScheme === 'dark'
      ? { ...MD3DarkTheme, colors: theme.dark }
      : { ...MD3LightTheme, colors: theme.light };


  return (
    <ShareIntentProvider options={{
      resetOnBackground: true,
      onResetShareIntent: () => {
        router.replace("/");
      },
    }}>
      <ClerkProvider tokenCache={tokenCache} publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
        <PaperProvider theme={paperTheme}>
          <StackHolder />
        </PaperProvider>
      </ClerkProvider>
    </ShareIntentProvider>
  );
}

function StackHolder() {
  var theme = useTheme();
  return (
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }} />
  );
}
