import { useSignIn } from "@clerk/clerk-expo";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignIn() {
    const insets = useSafeAreaInsets();
    const {signIn, setActive, isLoaded} = useSignIn()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();
    var doSignIn = async () => {
        if (!email || !password) {
            return;
        }
        const result = await signIn?.create({identifier: email, password: password});
        if (result?.status === "complete") {
            await setActive({session: result.createdSessionId});
            navigation.reset({
                index: 0,
                routes: [{name: "index"}],
            });
        }
    }
    return (
        <SafeAreaView style={{...styles.safeArea, paddingTop: insets.top, paddingBottom: insets.bottom}}>
            <View style={styles.container}>
                <Text variant="displaySmall">Sign In</Text>
                <TextInput label="Email" style={styles.input} value={email} onChangeText={setEmail} />
                <TextInput label="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
                <Button onPress={doSignIn} mode="contained">Sign In</Button>
                <Text>or</Text>
                <Button onPress={() => {}} mode="outlined">Sign In with Google</Button>
            </View>
        </SafeAreaView>
    );
}

var styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 16,
        width: "100%",
    },
    input: {
        maxHeight: 70,
    },
    safeArea: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});