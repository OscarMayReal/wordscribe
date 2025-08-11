import { searchBookmarks } from "@/lib/lists";
import { useAuth } from "@clerk/clerk-expo";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { Appbar, List, Text } from "react-native-paper";
import { debounce } from "../blogadminpages/post/[id]/overview";

const searchDebounced = debounce((query: string, setSearchResults: (results: any[]) => void) => {
    searchBookmarks(query).then((results) => setSearchResults(results));
}, 1000);

export default function SearchBookmarks() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const user = useAuth();
    useFocusEffect(
        useCallback(() => {
            searchBookmarks(searchQuery).then((results) => setSearchResults(results));
        }, [searchQuery])
    );
    useEffect(() => {
        searchDebounced(searchQuery, setSearchResults);
    }, [searchQuery]);
    return (
        <ScrollView style={{flex: 1}}>
            <Stack.Screen options={{headerShown: true, header: () => <Appbar.Header elevated>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title={<TextInput placeholder="Search Bookmarks" value={searchQuery} style={{fontFamily: "Inter_400Regular", fontSize: 16, marginLeft: 0, paddingLeft: 0}} onChangeText={setSearchQuery} />} />
            </Appbar.Header>}} />
            {searchResults.filter((bookmark) => !bookmark.readBy.includes(user.userId || "")).length > 0 && <List.Section>
                <List.Subheader>Unread</List.Subheader>
                {searchResults.filter((bookmark) => !bookmark.readBy.includes(user.userId || "")).map((bookmark) => (
                    <List.Item key={bookmark.id} title={bookmark.title} description={bookmark.url} onPress={() => router.push("/librarypages/" + bookmark.listId + "/bookmark/" + bookmark.id + "/bookmarkdetails")} left={props => <List.Icon {...props} icon="book" />}/>
                ))}
            </List.Section>}
            {searchResults.filter((bookmark) => bookmark.readBy.includes(user.userId || "")).length > 0 && <List.Section>
                <List.Subheader>Read</List.Subheader>
                {searchResults.filter((bookmark) => bookmark.readBy.includes(user.userId || "")).map((bookmark) => (
                    <List.Item key={bookmark.id} title={bookmark.title} description={bookmark.url} onPress={() => router.push("/librarypages/" + bookmark.listId + "/bookmark/" + bookmark.id + "/bookmarkdetails")} left={props => <List.Icon {...props} icon="eye" />}/>
                ))}
            </List.Section>}
            {searchResults.length === 0 && <View style={{flex: 1, justifyContent: "center", alignItems: "center", padding: 20}}><Text style={{fontFamily: "Inter_400Regular", fontSize: 16}}>No results</Text></View>}
        </ScrollView>
    );
}