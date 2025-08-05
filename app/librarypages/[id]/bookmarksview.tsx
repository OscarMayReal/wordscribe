import { useListContent, useListInfo } from "@/lib/lists";
import { useAuth } from "@clerk/clerk-expo";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Linking, ScrollView, View } from "react-native";
import { Appbar, List } from "react-native-paper";

export default function BookmarksView() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const listInfo = useListInfo(params.id as string);
    const listContent = useListContent(params.id as string);
    const auth = useAuth();
    const open = (url: string) => {
        Linking.openURL(url);
    };
    return (
        <View>
            <Stack.Screen options={{
                headerShown: true,
                header: () => <Appbar.Header>
                    <Appbar.BackAction onPress={() => router.back()} />
                    <Appbar.Content title={listInfo.data.name} />
                </Appbar.Header>,
            }} />
            <ScrollView>
                <List.Section>
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
                </List.Section>
                <List.Section>
                    <List.Subheader>Read</List.Subheader>
                    {listContent.data?.bookmarks?.map((bookmark) => (
                        bookmark.readBy?.includes(auth.userId) ? <List.Item
                            key={bookmark.id}
                            title={bookmark.title}
                            description={bookmark.url}
                            left={props => <List.Icon icon="book" {...props} />}
                            onPress={() => {
                                router.push(`/librarypages/${params.id}/bookmark/${bookmark.id}/bookmarkdetails`);
                            }}
                        /> : null
                    ))}
                </List.Section>
            </ScrollView>
        </View>
    );
}