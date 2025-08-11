import { useSignIn } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, View } from "react-native";
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
            <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior="padding">
                <View style={styles.container}>
                    <Image source={require("@/assets/images/logo.png")} style={styles.logo} />
                    <Text variant="displaySmall">Sign In</Text>
                    <TextInput autoCapitalize="none" mode="outlined" label="Email" style={styles.input} value={email} onChangeText={setEmail} />
                    <TextInput autoCapitalize="none" mode="outlined" label="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
                    <Button style={styles.button} icon="login" onPress={doSignIn} mode="contained">Sign In</Button>
                    <Text>Don't have an account?</Text>
                    <Button style={styles.button} icon="login" onPress={() => navigation.navigate("sign-up")} mode="outlined">Sign Up</Button>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

var styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 16,
        width: "100%",
        alignItems: "center",
    },
    keyboardAvoidingView: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        maxHeight: 70,
        width: "100%",
    },
    logo: {
        width: 40,
        resizeMode: "contain",
        height: 50,
    },
    button: {
        width: "100%",
    },
    safeArea: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});