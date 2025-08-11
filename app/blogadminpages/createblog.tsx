import { useClerk } from "@clerk/clerk-expo";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Appbar, Button, TextInput } from "react-native-paper";

export default function CreateBlog() {
    const router = useRouter();
    const clerk = useClerk();
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    return (
        <View>
            <Stack.Screen options={{headerShown: true, header: () => <Appbar.Header mode="large">
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Create Blog" />
            </Appbar.Header>}} />
            <View style={{paddingHorizontal: 20}}>
                <TextInput
                    label="Blog Name"
                    value={name}
                    onChangeText={setName}
                    mode="outlined"
                    style={{marginBottom: 16}}
                />
                <TextInput
                    label="Subdomain"
                    value={slug}
                    onChangeText={setSlug}
                    mode="outlined"
                    style={{marginBottom: 16}}
                    right={
                        <TextInput.Affix text=".wordscribe.app" />
                    }
                />
                <Button mode="contained" disabled={name === ""} onPress={() => {
                    clerk.createOrganization({name: name, slug: slug.toLowerCase()}).then((org) => {
                        console.log(org);
                        router.back();
                    })
                }} icon="pencil">
                    Create
                </Button>
            </View>
        </View>
    );
}