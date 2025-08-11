import { createBlogPost } from "@/lib/blog";
import { useOrganization } from "@clerk/clerk-expo";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Appbar, Button, TextInput } from "react-native-paper";

export default function CreatePost() {
    const router = useRouter();
    const organization = useOrganization();
    const [title, setTitle] = useState("");
    return (
        <View>
            <Stack.Screen options={{headerShown: true, header: () => <Appbar.Header mode="large">
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Create Post" />
            </Appbar.Header>}} />
            <View style={{paddingHorizontal: 20}}>
                <TextInput
                    label="Title"
                    value={title}
                    onChangeText={setTitle}
                    mode="outlined"
                    style={{marginBottom: 16}}
                />
                <Button mode="contained" disabled={title === "" || !organization.organization} onPress={() => {
                    createBlogPost(organization.organization?.slug || "", title).then((post) => {
                        router.replace(`/blogadminpages/post/${post.id}/overview`);
                    })
                }} icon="pencil">
                    Create
                </Button>
            </View>
        </View>
    );
}