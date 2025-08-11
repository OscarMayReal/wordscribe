import { DiscoverItem } from "@/app/tabs/discover";
import { useLists } from "@/lib/lists";
import { useFeedInfo, useFeedParser } from "@/lib/rssfeed";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { Appbar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SeeMore() {
    const listsHook = useLists();
    const params = useLocalSearchParams();
    const feed = useFeedInfo(params.id as string);
    const router = useRouter();
    const feeddata = useFeedParser(feed.data?.url as string);
    const insets = useSafeAreaInsets();
    const [headerRaised, setHeaderRaised] = React.useState(false);
    return (
        <ScrollView onScroll={(e) => setHeaderRaised(e.nativeEvent.contentOffset.y > 1)} scrollEventThrottle={16}>
            <Stack.Screen options={{headerShown: true, header: () => <Appbar.Header elevated={headerRaised}>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title={feeddata.data?.title} />
            </Appbar.Header>}} />
            <View>
                {feeddata.data?.items?.map((item, index) => (
                    <DiscoverItem key={index} item={item} listsHook={listsHook} />
                ))}
            </View>
            <View style={{height: insets.bottom}} />
        </ScrollView>
    );
}
