import { useListContent, useListInfo } from "@/lib/lists";
import { useAuth } from "@clerk/clerk-expo";
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Dimensions, Linking, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, FAB, List } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BookmarksView() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const listInfo = useListInfo(params.id as string);
    const listContent = useListContent(params.id as string);
    const auth = useAuth();
    const open = (url: string) => {
        Linking.openURL(url);
    };
    useFocusEffect(
        React.useCallback(() => {
            listContent.refresh();
        }, [])
    );
    const screensize = Dimensions.get('window');
    const insets = useSafeAreaInsets();
    return (
        <View style={{flex: 1}}>
            <Stack.Screen options={{
                headerShown: true,
                header: () => <Appbar.Header>
                    <Appbar.BackAction onPress={() => router.back()} />
                    <Appbar.Content title={listInfo.data?.name} />
                </Appbar.Header>,
            }} />
            <ScrollView>
                {listContent.loaded && listContent.data?.bookmarks?.filter((bookmark) => !bookmark.readBy?.includes(auth.userId)).length > 0 && <List.Section>
                    <List.Subheader>Unread</List.Subheader>
                    {listContent.data?.bookmarks?.map((bookmark) => (
                        !bookmark.readBy?.includes(auth.userId) ? <List.Item
                            key={bookmark.id}
                            title={bookmark.title}
                            description={bookmark.url}
                            left={props => <List.Icon icon="book" {...props} />}
                            onPress={() => {
                                router.push(`/librarypages/${params.id}/bookmark/${bookmark.id}/bookmarkdetails`);
                            }}
                        /> : null
                    ))}
                </List.Section>}
                {listContent.loaded && listContent.data?.bookmarks?.filter((bookmark) => bookmark.readBy?.includes(auth.userId)).length > 0 && <List.Section>
                    <List.Subheader>Read</List.Subheader>
                    {listContent.data?.bookmarks?.map((bookmark) => (
                        bookmark.readBy?.includes(auth.userId) ? <List.Item
                            key={bookmark.id}
                            title={bookmark.title}
                            description={bookmark.url}
                            left={props => <List.Icon icon="eye" {...props} />}
                            onPress={() => {
                                router.push(`/librarypages/${params.id}/bookmark/${bookmark.id}/bookmarkdetails`);
                            }}
                        /> : null
                    ))}
                </List.Section>}
            </ScrollView>
            <FAB
                icon="bookmark-outline"
                style={[styles.fab, {marginBottom: insets.bottom + 16}]}
                size="medium"
                label="Add"
                onPress={() => router.push(`/librarypages/${params.id}/createbookmark`)}
            />
        </View>
    );
}

var styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});
