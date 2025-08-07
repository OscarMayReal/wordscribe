import { deleteFeed, useFeedParser, useRSSFeedList } from "@/lib/rssfeed";
import { router, Stack, useFocusEffect } from "expo-router";
import React from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, Vibration, View } from "react-native";
import { ActivityIndicator, Appbar, Button, Divider, List, useTheme } from "react-native-paper";

export default function Discover() {
    const theme = useTheme();
    const feeds = useRSSFeedList();
    const [isElevated, setIsElevated] = React.useState(false);
    useFocusEffect(
        React.useCallback(() => {
            feeds.refresh();
        }, [])
    );
    console.log(feeds);
    if (feeds.loaded && feeds.data.length === 0) {
        return (
            <View style={styles.placeholder}>
                <Image source={require("@/assets/images/illustrations/telescope.png")} style={{width: 150, height: 150, objectFit: "contain"}} />
                <Text variant="titleLarge" style={{textAlign: "center", marginTop: 20, fontSize: 35, color: theme.colors.primary}}>Discover</Text>
                <Text style={{textAlign: "center", paddingHorizontal: 20, marginTop: 16, color: theme.colors.secondary}}>Add your sources to discover new and interesting content to bookmark</Text>
                <Button mode="contained" onPress={() => {router.push("/discoverpages/addfeed")}} style={{marginTop: 26}} icon="plus">Add Source</Button>
            </View>
        )
    } else if (!feeds.loaded) {
        return (
            <View style={styles.placeholder}>
                <ActivityIndicator />
            </View>
        )
    } else {
        return (
            <ScrollView onScroll={(e) => setIsElevated(e.nativeEvent.contentOffset.y > 1)} scrollEventThrottle={16}>
                <Stack.Screen options={{headerShown: true, header: () => <Appbar.Header elevated={isElevated}>
                    <Appbar.Content title="Discover" />
                    <Appbar.Action icon="plus" onPress={() => {router.push("/discoverpages/addfeed")}} />
                </Appbar.Header>}} />
                {feeds.data.map((feed) => (
                    <View key={feed.id}>
                        <FeedDiscoverView url={feed.url} id={feed.id} refresh={feeds.refresh} />
                    </View>
                ))}
            </ScrollView>
        )
    }
}

export function FeedDiscoverView({url, id, refresh}: {url: string, id: string, refresh: () => void}) {
    const feeddata = useFeedParser(url);
    const [expanded, setExpanded] = React.useState(true);
    return (
        <>
            <List.Accordion title={feeddata.data?.title} expanded={expanded} onLongPress={() => {Vibration.vibrate(150);Alert.alert("Delete feed", "Are you sure you want to delete this feed?", [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: () => deleteFeed(id).then(() => {
                        refresh();
                    }),
                },
            ])}} onPress={() => setExpanded(!expanded)} left={props => <List.Icon icon="rss" {...props} />}>
                {feeddata.data?.items?.map((item, index) => (
                    index < 5 && <List.Item
                        key={index}
                        title={item.title}
                        description={item.description}
                        left={props => <List.Icon icon="pencil" {...props} />}
                    />
                ))}
                {feeddata.data?.items?.length > 5 && <List.Item
                    title="Show more"
                    left={props => <List.Icon icon="chevron-down" {...props} />}
                    onPress={() => console.log("Show more")}
                />}
            </List.Accordion>
            <Divider />
        </>
    )
}

var styles = StyleSheet.create({
    placeholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    postCard: {
        margin: 16,
    },
});