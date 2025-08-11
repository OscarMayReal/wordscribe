import { useSignUp } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignIn() {
    const insets = useSafeAreaInsets();
    const {signUp, setActive, isLoaded} = useSignUp()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [verification, setVerification] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const navigation = useNavigation();
    var doSignIn = async () => {
        if (!email || !password) {
            return;
        }
        const result = await signUp?.create({emailAddress: email, password: password, firstName: firstName, lastName: lastName, username: username});
        await signUp?.prepareEmailAddressVerification({ strategy: 'email_code' });
        setVerification(true);
    }
    var doVerify = async () => {
        if (!verificationCode) {
            return;
        }
        const result = await signUp?.attemptEmailAddressVerification({ code: verificationCode});
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
                {!verification ? <View style={styles.container}>
                    <Image source={require("@/assets/images/logo.png")} style={styles.logo} />
                    <Text variant="displaySmall">Sign Up</Text>
                    <View style={styles.inputRow}>
                        <TextInput mode="outlined" label="First Name" style={styles.rowInput} value={firstName} onChangeText={setFirstName} />
                        <TextInput mode="outlined" label="Last Name" style={styles.rowInput} value={lastName} onChangeText={setLastName} />
                    </View>
                    <TextInput autoCapitalize="none" mode="outlined" label="Username" style={styles.input} value={username} onChangeText={setUsername} />
                    <TextInput autoCapitalize="none" mode="outlined" label="Email" style={styles.input} value={email} onChangeText={setEmail} />
                    <TextInput autoCapitalize="none" mode="outlined" label="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
                    <Button style={styles.button} icon="login" onPress={doSignIn} mode="contained" disabled={firstName === "" || lastName === "" || username === "" || email === "" || password === ""}>Sign Up</Button>
                    <Text>Already have an account?</Text>
                    <Button style={styles.button} icon="login" onPress={() => navigation.navigate("sign-in")} mode="outlined">Sign In</Button>
                </View>
                : <View style={styles.container}>
                    <Image source={require("@/assets/images/logo.png")} style={styles.logo} />
                    <Text variant="displaySmall">Verify Email</Text>
                    <TextInput autoCapitalize="none" mode="outlined" label="Verification Code" style={styles.input} value={verificationCode} onChangeText={setVerificationCode} />
                    <Button style={styles.button} icon="login" onPress={doVerify} mode="contained" disabled={verificationCode === ""}>Verify</Button>
                </View>}
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
    rowInput: {
        width: "50%",
    },
    inputRow: {
        marginHorizontal: 8,
        flexDirection: "row",
        gap: 16,
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