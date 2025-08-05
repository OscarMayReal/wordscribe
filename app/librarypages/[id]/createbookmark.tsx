import { createBookmark } from "@/lib/lists";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { getLinkPreview } from 'link-preview-js';
import { useState } from "react";
import { View } from "react-native";
import { Appbar, Button, Divider, Icon, Text, TextInput } from "react-native-paper";

export default function CreateBookmark() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    return (
        <View style={{flex: 1}}>
            <Stack.Screen options={{
                headerShown: true,
                header: () => <Appbar.Header mode="large">
                    <Appbar.BackAction onPress={() => router.back()} />
                    <Appbar.Content title="Create Bookmark" />
                </Appbar.Header>,
            }} />
            <View style={{padding: 20, paddingTop: 0, gap: 16}}>
                <TextInput label="Title" value={title} onChangeText={setTitle} />
                <TextInput label="URL" value={url} onChangeText={setUrl} />
                <Button mode="contained" onPress={async () => {
                    var newtitle = title;
                    console.log(title);
                    if (url === '') {
                        return;
                    }
                    if (title === '') {
                        console.log("Getting title");
                        const data = await getLinkPreview(url);
                        console.log(data);
                        if (data.title) {
                            newtitle = data.title;
                        } else {
                            newtitle = url;
                        }
                    }
                    createBookmark(params.id as string, newtitle, url).then(() => {
                        router.back();
                    });
                }} icon="plus">
                    Create
                </Button>
            </View>
            <Divider />
            <View style={{padding: 20, alignItems: "center", justifyContent: "center", flex: 1, gap: 10}}>
                <Icon source="share-variant" size={50} />
                <Text variant="titleLarge" style={{textAlign: "center", marginTop: 8}}>Add a bookmark from anywhere</Text>
                <Text variant="bodyMedium" style={{textAlign: "center"}}>Next time, just open any website and Share to WordScribe</Text>
            </View>
        </View>
    );
}