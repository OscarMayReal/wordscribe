import { StackedButton } from "@/app/librarypages/[id]/bookmark/[bookmarkid]/bookmarkdetails";
import { DeletePost, publishDraftChanges, updatePostName, updatePostPublic, useBlogPost } from "@/lib/blog";
import { useOrganization } from "@clerk/clerk-expo";
import { router, Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Alert, Dimensions, Linking, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Button, Divider, Switch, Text, TextInput, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const debounce = <F extends (...args: any[]) => any>(func: F, wait: number) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    
    return function(this: ThisParameterType<F>, ...args: Parameters<F>) {
        const context = this;
        
        if (timeout) {
            clearTimeout(timeout);
        }
        
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
};

const debouncedSavePostName = debounce((org: string, postid: string, title: string) => {
    updatePostName(org, postid, title);
}, 500);

export default function Overview() {
    const org = useOrganization();
    const params = useLocalSearchParams();
    const post = useBlogPost(org.organization?.slug || "", params.id || "");
    const [title, setTitle] = React.useState(post.data?.title || "");
    const [isPublic, setIsPublic] = React.useState(post.data?.public || false);
    const [hasLoadedPublic, setHasLoadedPublic] = React.useState(false);
    useFocusEffect(
        React.useCallback(() => {
            post.refresh();
        }, [])
    );
    useEffect(() => {
        setTitle(post.data?.title || "");
        setIsPublic(post.data?.public || false);
        console.log("post.data?.draftContent != post.data?.content", post.data?.draftContent != post.data?.content);
        setHasLoadedPublic(true);
    }, [post.data]);
    const [isTitleValid, setIsTitleValid] = React.useState(true);
    useEffect(() => {
        if (title.length < 3 && post.loaded) {
            setIsTitleValid(false);
        } else {
            setIsTitleValid(true);
        }
    }, [title]);
    useEffect(() => {
        debouncedSavePostName(org.organization?.slug || "", params.id as string, title);
    }, [title]);
    useEffect(() => {
        if (hasLoadedPublic) {
            console.log("Updating public");
            console.log(isPublic);
            updatePostPublic(org.organization?.slug || "", params.id as string, isPublic)
        }
    }, [isPublic]);

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
                    <Appbar.Content title={title} />
                </Appbar.Header>,
            }} />
            {/* <View style={[styles.imageLoading, {width: screensize.width, backgroundColor: theme.colors.elevation.level2}]}>
                <ActivityIndicator />
            </View> */}
            <View style={styles.actionRow}>
                <StackedButton icon="open-in-new" onPress={() => Linking.openURL(`https://${org.organization?.slug}.${process.env.EXPO_PUBLIC_WEB_URL}/post/${params.id}`)} title="Open" />
                <StackedButton icon="delete" onPress={() => Alert.alert("Delete Post", "Are you sure you want to delete this post? This action cannot be undone.", [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                    },
                    {
                        text: "Delete",
                        onPress: () => DeletePost(org.organization?.slug || "", params.id as string).then(() => router.back()),
                    },
                ])} title="Delete" />
                <StackedButton icon="pencil" onPress={() => router.push(`/blogadminpages/post/${params.id}/composepost`)} title="Edit" />
            </View>
            <Divider />
            <View style={{padding: 16}}>
                <TextInput label="Title" disabled={!post.loaded} value={title} error={!isTitleValid} mode="outlined" onChangeText={setTitle} />
            </View>
            <View style={{padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <Text style={{fontSize: 16}}>Public</Text>
                <Switch
                    value={isPublic}
                    onValueChange={setIsPublic}
                />
            </View>
            {(post.data?.isEdited && post.loaded) && <View style={{padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <Text style={{fontSize: 16}}>Publish Drafted Changes</Text>
                <Button mode="contained" onPress={() => {publishDraftChanges(org.organization?.slug || "", params.id as string).then(() => setTimeout(() => post.refresh(), 1000))}}>Publish</Button>
            </View>}
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