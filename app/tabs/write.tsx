import { useOrganization, useOrganizationList } from '@clerk/clerk-expo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
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
                setIsElevated(offsetY >= 50);
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
    return (
        <View style={styles.container}>
            <Tabs.Screen options={{headerShown: false}} />
            <Appbar.Header 
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
                <Appbar.Action icon="account-group" onPress={() => console.log('Edit')} />
                <Appbar.Action icon="cog" onPress={() => console.log('Delete')} />
            </Appbar.Header>
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
                                  <Text variant="titleLarge" style={{color: theme.colors.onBackground}}>
                                      {currentOrganization?.organization?.name + " (" + currentOrganization?.organization?.slug + ")"}
                                  </Text>
                                  <MaterialCommunityIcons name="chevron-down" size={24} color={theme.colors.onBackground} />
                              </TouchableOpacity>
                          } 
                          onDismiss={() => setMenuVisible(false)}>
                        {organizations.userMemberships?.data?.map((org) => (
                            <Menu.Item 
                                key={org.id} 
                                title={org.organization.name} 
                                onPress={() => {
                                    organizations.setActive?.({organization: org.organization}); 
                                    setMenuVisible(false);
                                }} 
                            />
                        ))}
                    </Menu>
                </Animated.View>
                <PostCard />
                <PostCard />
                <PostCard />
                <PostCard />
                <PostCard />
                <PostCard />
                <PostCard />
                <PostCard />
                <FabSpacer />
            </Animated.ScrollView>
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
