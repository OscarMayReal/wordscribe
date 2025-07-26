import { useOrganization, useOrganizationList } from '@clerk/clerk-expo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Appbar, Avatar, Card, FAB, IconButton, Menu, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Write() {
    const theme = useTheme();
    const organizations = useOrganizationList({
        userMemberships: true,
        active: true,
    });
    const currentOrganization = useOrganization();
    const insets = useSafeAreaInsets();
    const [menuVisible, setMenuVisible] = useState(false);
    const [headerIsElevated, setHeaderIsElevated] = useState(false);
    return (
        <View style={styles.container}>
            <Tabs.Screen options={{headerShown: false}} />
            <Appbar.Header statusBarHeight={insets.top} elevated={headerIsElevated} mode='large'>
                <Appbar.Content 
                    title={<Menu visible={menuVisible} anchor={<TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={styles.headerTitle}><Text variant="titleLarge" style={{color: theme.colors.onBackground}}>{currentOrganization?.organization?.name + " (" + currentOrganization?.organization?.slug + ")"}</Text><MaterialCommunityIcons name="chevron-down" size={24} color={theme.colors.onBackground} /></TouchableOpacity>} onDismiss={() => setMenuVisible(false)}>
                        {organizations.userMemberships?.data?.map((org) => (
                            <Menu.Item key={org.id} title={org.organization.name} onPress={() => {organizations.setActive?.({organization: org.organization}); setMenuVisible(false)}} />
                        ))}
                    </Menu>}
                />
                <Appbar.Action icon="cog-outline" onPress={() => console.log('Settings')} />
                <Appbar.Action icon="account-group-outline" onPress={() => console.log('Users')} />
            </Appbar.Header>
            <ScrollView style={styles.scrollContainer} onScroll={(e) => setHeaderIsElevated(e.nativeEvent.contentOffset.y > 1)} scrollEventThrottle={5}>
                <PostCard />
                <PostCard />
                <PostCard />
                <PostCard />
                <PostCard />
                <PostCard />
                <PostCard />
                <PostCard />
                <FabSpacer />
            </ScrollView>
            <FAB
                icon="plus"
                style={styles.fab}
                size="medium"
                label="New Post"
                onPress={() => console.log('Pressed')}
            />
        </View>
    );
}

var FabSpacer = () => {
    return (
        <View style={styles.fabSpacer} />
    );
}

var PostCard = () => {
    return (
        <Card style={styles.postCard}>
            <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
            <Card.Title title="Post Title" subtitle="Post author" left={(props) => <Avatar.Icon icon="account" size={40} {...props} />} />
            <Card.Content>
                <Text>Post content</Text>
            </Card.Content>
            <Card.Actions>
                <IconButton icon="heart" mode="text" onPress={() => console.log('Pressed')} />
                <IconButton icon="comment-outline" mode="text" onPress={() => console.log('Pressed')} />
                <IconButton icon="share-variant-outline" mode="text" onPress={() => console.log('Pressed')} />
                <View style={{flex: 1}} />
            </Card.Actions>
        </Card>
    );
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
        paddingLeft: 16,
        paddingTop: 16,
        paddingRight: 16,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    headerTitle: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    postCard: {
        marginBottom: 16,
    },
    fabSpacer: {
        height: 70,
    },
});
