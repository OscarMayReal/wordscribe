import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { Stack } from "expo-router";
import { PaperProvider, useTheme } from "react-native-paper";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <PaperProvider>
        <StackHolder />
      </PaperProvider>
    </ClerkProvider>
  );
}

function StackHolder() {
  var theme = useTheme();
  return (
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }} />
  );
}
