import { useAuth } from "@clerk/clerk-expo";
import { Redirect, router } from "expo-router";
import { ShareIntentProvider, useShareIntentContext } from "expo-share-intent";
import ShareIntentHandler from "./shareintent";

export default function RootLayout() {
    return <ShareIntentProvider options={{
        resetOnBackground: true,
        onResetShareIntent: () => {
            router.replace("/");
        },
    }}><RedirectManager /></ShareIntentProvider>;
}

export function RedirectManager() {
    const {isSignedIn, isLoaded} = useAuth();
    const shareIntent = useShareIntentContext();
    if (!isLoaded) {
        return null;
    }
    if (isSignedIn && !shareIntent.hasShareIntent) {
        return <Redirect href="/tabs/library" />;
    }
    if (shareIntent.hasShareIntent) {
        return <ShareIntentHandler />;
    }
    return <Redirect href="/sign-in" />;
}
