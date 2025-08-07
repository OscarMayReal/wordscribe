import { StackedButton } from "@/app/librarypages/[id]/bookmark/[bookmarkid]/bookmarkdetails";
import { useBlogPost } from "@/lib/blog";
import { useOrganization } from "@clerk/clerk-expo";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Appbar, Divider, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Overview() {
    const org = useOrganization();
    const params = useLocalSearchParams();
    const post = useBlogPost(org.organization?.slug || "", params.id || "");
    const screensize = Dimensions.get('window');
    const insets = useSafeAreaInsets();
    const [headerRaised, setHeaderRaised] = React.useState(false);
    const theme = useTheme();
    return (
        <ScrollView onScroll={(e) => setHeaderRaised(e.nativeEvent.contentOffset.y > 1)} scrollEventThrottle={16}>
            <Stack.Screen options={{
                headerShown: true,
                header: () => <Appbar.Header elevated={headerRaised}>
                    <Appbar.BackAction onPress={() => router.back()} />
                    <Appbar.Content title={post.data?.title as string} />
                </Appbar.Header>,
            }} />
            <View style={[styles.imageLoading, {width: screensize.width, backgroundColor: theme.colors.elevation.level2}]}>
                <ActivityIndicator />
            </View>
            <View style={styles.actionRow}>
                <StackedButton icon="open-in-new" onPress={() => console.log("Open")} title="Open" />
                <StackedButton icon="delete" onPress={() => console.log("Delete")} title="Delete" />
                <StackedButton icon="pencil" onPress={() => router.push(`/blogadminpages/post/${params.id}/composepost`)} title="Edit" />
            </View>
            <Divider />
            <View style={{height: insets.bottom}} />
        </ScrollView>
    );
}

var styles = StyleSheet.create({
    imageLoading: {
        height: 250,
        alignItems: "center",
        justifyContent: "center",
    },
    actionRow: {
        flexDirection: "row",
    },
});