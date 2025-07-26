import { useAuth, useUser } from "@clerk/clerk-expo";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image, StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

export default function Account() {
    const auth = useAuth();
    const user = useUser();
    const theme = useTheme();
    return (
        <View style={styles.container}>
            <View style={styles.userRow}>
                <Image source={{uri: user?.user?.imageUrl}} style={[styles.avatar, {borderColor: theme.colors.outline}]} />
                <View style={styles.textContainer}>
                    <View style={styles.textRow}>
                        <Text style={[styles.name, {color: theme.colors.onBackground}]}>{user?.user?.fullName}</Text>
                    </View>
                    <Text style={[styles.email, {color: theme.colors.secondary}]}>@{user?.user?.username}</Text>
                </View>
                <View style={styles.buttonRow}>
                    <Button mode="contained-tonal" elevation={1} style={styles.buttonRowButton} onPress={() => console.log('Pressed')}>
                        <View style={styles.buttonRowButtonContent}>
                            <MaterialCommunityIcons name="logout" size={20} color={theme.colors.secondary} />
                            <Text style={{fontSize: 16, color: theme.colors.secondary}}>Logout</Text>
                        </View>
                    </Button>
                    <Button mode="contained-tonal" elevation={1} style={styles.buttonRowButton} onPress={() => console.log('Pressed')}>
                        <View style={styles.buttonRowButtonContent}>
                            <MaterialCommunityIcons name="share-variant" size={20} color={theme.colors.secondary} />
                            <Text style={{fontSize: 16, color: theme.colors.secondary}}>Share</Text>
                        </View>
                    </Button>
                </View>
            </View>
        </View>
    );
}

var styles = StyleSheet.create({
    container: {
        marginLeft: 16,
        marginRight: 16,
    },
    textRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingVertical: 2,
    },
    userRow: {
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
    },
    textContainer: {
        alignItems: "center",
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 1,
    },
    name: {
        fontSize: 30,
        fontWeight: "medium",
    },
    email: {
        fontSize: 20,
        color: "#6c6c6c",
    },
    buttonRow: {
        flexDirection: "row",
        gap: 15,
        marginTop: 16,
    },
    buttonRowButton: {
        padding: 2,
        borderRadius: 50,
    },
    buttonRowButtonContent: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
});