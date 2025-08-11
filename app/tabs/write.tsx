import { useBlogPosts } from "@/lib/blog";
import { useOrganization, useOrganizationList } from '@clerk/clerk-expo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, Tabs, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { Appbar, Avatar, Button, Card, Divider, FAB, IconButton, List, Menu, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Write() {
    const [_, forceUpdate] = useReducer(x => x + 1, 0);
    const theme = useTheme();
    const organizations = useOrganizationList({
        userMemberships: true,
        active: true,
    });
    const currentOrganization = useOrganization();
    const insets = useSafeAreaInsets();
    const [menuVisible, setMenuVisible] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;
    const [isElevated, setIsElevated] = useState(false);
    
    // Handle scroll events to update elevated state
    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        {
            useNativeDriver: false,
            listener: (event: { nativeEvent: { contentOffset: { y: number } } }) => {
                // Update elevated state based on scroll position
                // Header will elevate when scrolled down enough to make the header text fully visible
                // The value 50 matches the inputRange in headerOpacity interpolation
                const offsetY = event.nativeEvent.contentOffset.y;
                setIsElevated(offsetY >= 10);
            },
        }
    );
    
    // Initialize header state when component mounts
    useEffect(() => {
        setIsElevated(false);
        return () => {
            // Cleanup if needed
        };
    }, []);

    useEffect(() => {
        if (organizations.isLoaded && currentOrganization.isLoaded && !currentOrganization.organization && organizations.userMemberships?.data?.length > 0) {
            organizations.setActive({organization: organizations.userMemberships?.data[0].organization});
            forceUpdate();
        }
    }, [organizations, currentOrganization]);

    useFocusEffect(
        useCallback(() => {
            if (currentOrganization?.isLoaded) {
                posts.refresh();
            } else {
                forceUpdate();
            }
        }, [currentOrganization?.organization?.slug])
    );
    
    // Header animation interpolation
    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const titleOpacity = scrollY.interpolate({
        inputRange: [0, 25],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const posts = useBlogPosts(currentOrganization?.organization?.slug);
    useEffect(() => {
        if (currentOrganization?.isLoaded) {
            posts.refresh();
        }
    }, [currentOrganization?.organization?.slug]);
    if (!currentOrganization?.isLoaded) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }
    if (!currentOrganization?.organization?.slug) {
        return (
            <View style={styles.noblog}>
                <Text variant="titleLarge">You don't have a Blog</Text>
                <Text variant="bodyMedium">Create one now to start writing!</Text>
                <Button mode="contained" icon="plus" onPress={() => router.push('/blogadminpages/createblog')}>Create Blog</Button>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <Tabs.Screen options={{headerShown: true, header: () => <Appbar.Header 
                statusBarHeight={insets.top} 
                elevated={isElevated}
            >
                <Appbar.Content
                    title={
                        <Animated.View style={{ opacity: headerOpacity }}>
                            <Text 
                                variant="titleLarge" 
                                numberOfLines={1}
                                style={{ color: theme.colors.onBackground }}
                            >
                                {currentOrganization?.organization?.name}
                            </Text>
                        </Animated.View>
                    }
                />
                {/* <Appbar.Action icon="account-group" onPress={() => router.push('/blogadminpages/managemembers')} /> */}
                <Appbar.Action icon="cog" onPress={() => router.push('/blogadminpages/blogsettings')} />
            </Appbar.Header>}} />
            <Animated.ScrollView 
                style={styles.scrollContainer}
                contentContainerStyle={{ paddingBottom: 16 }}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                <Animated.View style={{ opacity: titleOpacity, marginBottom: 16 }}>
                    <Menu visible={menuVisible} 
                          anchor={
                              <TouchableOpacity 
                                  onPress={() => setMenuVisible(!menuVisible)} 
                                  style={styles.headerTitle}
                              >
                                  <Text variant="titleLarge" style={{color: theme.colors.onBackground, fontSize: 28, paddingBottom: 16}}>
                                      {currentOrganization?.organization?.name}
                                  </Text>
                                  <MaterialCommunityIcons name="chevron-down" size={24} color={theme.colors.onBackground} style={{paddingBottom: 10}} />
                              </TouchableOpacity>
                          } 
                          onDismiss={() => setMenuVisible(false)}>
                        {organizations.userMemberships?.data?.map((org) => (
                            <Menu.Item 
                                key={org.id} 
                                title={org.organization.name} 
                                leadingIcon="pencil"
                                onPress={() => {
                                    organizations.setActive?.({organization: org.organization}); 
                                    setMenuVisible(false);
                                }} 
                            />
                        ))}
                        <Divider />
                        <Menu.Item title="Create Blog" leadingIcon="plus" onPress={() => {
                            router.push('/blogadminpages/createblog');
                            setMenuVisible(false);
                        }} />
                    </Menu>
                </Animated.View>
                {posts.data?.filter((post) => post.public).length > 0 && <List.Section>
                    <List.Subheader>Posts</List.Subheader>
                    {posts.data.filter((post) => post.public).map((post) => (
                        <PostListItem key={post.id} type="post" post={post} />
                    ))}
                    {posts.data.filter((post) => post.public).length > 5 && <ShowMoreListItem />}
                </List.Section>}
                {posts.data?.filter((post) => !post.public).length > 0 && <List.Section>
                    <List.Subheader>Drafts</List.Subheader>
                    {posts.data.filter((post) => !post.public).map((post) => (
                        <PostListItem key={post.id} type="draft" post={post} />
                    ))}
                    {posts.data.filter((post) => !post.public).length > 5 && <ShowMoreListItem />}
                </List.Section>}
                <FabSpacer />
            </Animated.ScrollView>
            <FAB
                icon="plus"
                style={styles.fab}
                size="medium"
                label="New Post"
                onPress={() => router.push('/blogadminpages/createpost')}
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

var PostListItem = ({type, post}: {type: "post" | "draft", post: any}) => {
    return (
        <List.Item onPress={() => router.push('/blogadminpages/post/' + post.id + '/overview')} title={post.title} description={new Date(post.updatedAt).toLocaleString()} left={(props) => <List.Icon icon={type === "post" ? "text" : "pencil"} {...props} />} />
    );
}

var ShowMoreListItem = () => {
    return (
        <List.Item onPress={() => console.log('Pressed')} title="Show more" left={(props) => <List.Icon icon="chevron-down" {...props} />} />
    );
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
        // paddingLeft: 16,
        paddingTop: 16,
        // paddingRight: 16,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    headerTitle: {
        paddingLeft: 16,
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
    noblog: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
    },
});
