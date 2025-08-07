import { createBookmark, useLists } from "@/lib/lists";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { getLinkPreview } from 'link-preview-js';
import { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { Appbar, Button, Divider, Icon, Menu, Text, TextInput, TouchableRipple } from "react-native-paper";

export default function CreateBookmark({shareintentMode, name, previewurl}: {shareintentMode: boolean, name?: string, previewurl?: string}) {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [title, setTitle] = useState(name || '');
    const [url, setUrl] = useState(previewurl || '');
    const [visible, setVisible] = useState(false);
    const lists = useLists();
    const [collection, setCollection] = useState(lists.data?.[0] || '');
    const screensize = Dimensions.get('window');
    useEffect(() => {
        if (lists.loaded && lists.data?.length > 0) {
            setCollection(lists.data[0]);
        }
    }, [lists.data]);
    return (
        <View style={{flex: 1}}>
            <Stack.Screen options={{
                headerShown: true,
                header: () => <Appbar.Header mode="large">
                    {!shareintentMode && <Appbar.BackAction onPress={() => router.back()} />}
                    <Appbar.Content title="Create Bookmark" />
                </Appbar.Header>,
            }} />
            <View style={{padding: 20, paddingTop: 0, gap: 16}}>
                <TextInput label="Title" value={title} onChangeText={setTitle} />
                <TextInput label="URL" value={url} onChangeText={setUrl} />
                {shareintentMode && <Menu style={{width: screensize.width - 40, marginTop: 55}} anchor={<TouchableRipple onPress={() => setVisible(true)}><TextInput label="Collection" value={collection.name} editable={false} /></TouchableRipple>} visible={visible} onDismiss={() => setVisible(false)}>
                    {lists.data?.map((list) => (
                        <Menu.Item key={list.id} title={list.name} onPress={() => {setCollection(list); setVisible(false)}} />
                    ))}
                </Menu>}
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
                    createBookmark(shareintentMode ? collection.id : params.id as string, newtitle, url).then(() => {
                        if (shareintentMode) {
                            router.replace("/");
                        } else {
                            router.back();
                        }
                    });
                }} icon="plus">
                    Create
                </Button>
            </View>
            {!shareintentMode && <Divider />}
            {!shareintentMode && <View style={{padding: 20, alignItems: "center", justifyContent: "center", flex: 1, gap: 10}}>
                <Icon source="share-variant" size={50} />
                <Text variant="titleLarge" style={{textAlign: "center", marginTop: 8}}>Add a bookmark from anywhere</Text>
                <Text variant="bodyMedium" style={{textAlign: "center"}}>Next time, just open any website and Share to WordScribe</Text>
            </View>}
        </View>
    );
}