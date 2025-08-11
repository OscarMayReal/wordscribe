import { useOrganization } from "@clerk/clerk-expo";
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, View } from "react-native";
import { Appbar, Button, Divider, TextInput } from "react-native-paper";

export default function CreatePost() {
    const router = useRouter();
    const organization = useOrganization();
    const [blogname, setBlogName] = useState("");
    useEffect(() => {
        if (organization.organization) {
            setBlogName(organization.organization.name);
        }
    }, [organization.organization]);
    return (
        <View>
            <Stack.Screen options={{headerShown: true, header: () => <Appbar.Header mode="large">
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Blog Settings" />
            </Appbar.Header>}} />
            <View style={{paddingHorizontal: 20}}>
                <TextInput
                    label="Blog Name"
                    value={blogname}
                    onChangeText={setBlogName}
                    mode="outlined"
                    style={{marginBottom: 16}}
                />
                <Button mode="contained" onPress={() => {
                    organization.organization?.update({name: blogname}).then(() => {
                        Alert.alert("Success", "Blog name updated");
                    })
                }} icon="pencil">
                    Save
                </Button>
                <Divider style={{marginVertical: 20}} />
                <ImageChange />
            </View>
        </View>
    );
}

export function ImageChange() {
    const organization = useOrganization();
    const [image, setImage] = useState(organization.organization?.imageUrl);
    return (
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 16}}>
            <Image source={{uri: image}} style={{width: 40, height: 40, objectFit: "contain", borderRadius: 10}} />
            <View style={{flex: 1}} />
            <Button mode="text" onPress={async () => {
                let result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ["images"],
                    allowsEditing: true,
                    selectionLimit: 1,
                    aspect: [1, 1],
                    quality: 1,
                    base64: true,
                });
                if (!result.canceled) {
                    const uri = result.assets[0].uri;
                    const file = "data:" + result.assets[0].mimeType + ";base64," + result.assets[0].base64;
                    setImage(uri);
                    organization.organization?.setLogo({file}).then(() => {
                        Alert.alert("Success", "Blog image updated");
                    })
                }
            }} icon="pencil">
                Change Image
            </Button>
        </View>
    )
}
    
