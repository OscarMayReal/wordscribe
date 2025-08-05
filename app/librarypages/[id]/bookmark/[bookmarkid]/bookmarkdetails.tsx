import { useContent } from "@/lib/content";
import { setBookmarkRead, useBookmarkInfo } from "@/lib/lists";
import { useOGInfo } from "@/lib/opengraph";
import { useAuth } from "@clerk/clerk-expo";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Dimensions, Image, Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, Appbar, Divider, Icon, TouchableRipple, useTheme } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BookmarkDetails() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const bookmarkInfo = useBookmarkInfo(params.bookmarkid as string);
    const ogInfo = useOGInfo(bookmarkInfo.data?.url as string);
    const screensize = Dimensions.get('window');
    const theme = useTheme();
    const content = useContent(params.bookmarkid as string);
    const insets = useSafeAreaInsets();
    const auth = useAuth();
    return (
        <ScrollView>
            <Stack.Screen options={{
                headerShown: true,
                header: () => <Appbar.Header>
                    <Appbar.BackAction onPress={() => router.back()} />
                    <Appbar.Content title={bookmarkInfo.data?.title} />
                </Appbar.Header>,
            }} />
            {(ogInfo.loaded && ogInfo.data) ? ogInfo.data.images.length > 0 ? <Image source={{uri: ogInfo.data.images[0]}} style={[styles.image, {width: screensize.width}]} /> : <View style={[styles.imageLoading, {width: screensize.width, backgroundColor: theme.colors.elevation.level2}]}><Icon source="image" size={24} /></View> : <View style={[styles.imageLoading, {width: screensize.width, backgroundColor: theme.colors.elevation.level2}]}><ActivityIndicator /></View>}
            <View style={styles.actionRow}>
                <StackedButton icon="open-in-new" onPress={() => Linking.openURL(bookmarkInfo.data?.url as string)} title="Open" />
                {!bookmarkInfo.data?.readBy?.includes(auth.userId) ? <StackedButton icon="eye" onPress={() => {setBookmarkRead(params.bookmarkid as string, true); bookmarkInfo.refresh();}} title="Mark Read" /> : <StackedButton icon="eye-off" onPress={() => {setBookmarkRead(params.bookmarkid as string, false); bookmarkInfo.refresh();}} title="Mark Unread" />}
                <StackedButton icon="delete" onPress={() => {console.log("Deleting bookmark")}} title="Delete" />
            </View>
            <Divider />
            <View style={{padding: 20}}>
                {content.loaded && content.data ? <RenderHTML source={{html: content.data}} contentWidth={screensize.width - 40} /> : <ActivityIndicator />}
            </View>
            <View style={{height: insets.bottom}} />
        </ScrollView>
    );
}

var styles = StyleSheet.create({
    imageLoading: {
        height: 250,
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        height: 250,
        objectFit: "cover",
    },
    actionRow: {
        flexDirection: "row",
    },
    actionButton: {
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: 20,
    },
});

function StackedButton({icon, onPress, title}: {icon: string, onPress: () => void, title: string}) {
    const theme = useTheme();
    return (
        <TouchableRipple onPress={onPress} style={{width: "33.33%"}}>
            <View style={styles.actionButton}>
                <Icon color={theme.colors.secondary} source={icon} size={24} />
                <Text style={{color: theme.colors.secondary}}>{title}</Text>
            </View>
        </TouchableRipple>
    );
}
