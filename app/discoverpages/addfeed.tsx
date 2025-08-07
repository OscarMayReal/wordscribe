import { addFeed } from "@/lib/rssfeed";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Appbar, Button, TextInput } from "react-native-paper";

export default function AddFeed() {
    const router = useRouter();
    const [feedUrl, setFeedUrl] = useState("");
    return (
        <View>
            <Stack.Screen options={{headerShown: true, header: () => <Appbar.Header mode="large">
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Add Feed" />
            </Appbar.Header>}} />
            <View style={{paddingHorizontal: 20}}>
                <TextInput
                    label="Feed URL"
                    value={feedUrl}
                    onChangeText={setFeedUrl}
                    mode="outlined"
                    style={{marginBottom: 16}}
                />
                <Button
                    mode="contained"
                    onPress={() => {
                        addFeed(feedUrl).then(() => {
                            router.back();
                        });
                    }}
                >
                    Add Feed
                </Button>
            </View>
        </View>
    );
}