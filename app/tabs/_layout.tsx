import { router, Tabs } from "expo-router";
import { useShareIntent } from "expo-share-intent";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Appbar, BottomNavigation, Icon, useTheme } from "react-native-paper";
export const headerContext = React.createContext({
    headerIsElevated: false,
    setHeaderIsElevated: (value: boolean) => {},
    tabIsElevated: false,
    setTabIsElevated: (value: boolean) => {},
});

export default function TabLayout() {
    var theme = useTheme();
    const [headerIsElevated, setHeaderIsElevated] = React.useState(false);
    const [tabIsElevated, setTabIsElevated] = React.useState(false);
    const shareIntent = useShareIntent();
    useEffect(() => {
        if (shareIntent.hasShareIntent) {
            router.replace("/shareintent");
        }
    }, [shareIntent.hasShareIntent]);
    return (
        <headerContext.Provider value={{headerIsElevated, setHeaderIsElevated, tabIsElevated, setTabIsElevated}}>
            <GestureHandlerRootView>
                <Tabs
                    screenOptions={{
                        sceneStyle: { backgroundColor: theme.colors.background },
                        header: ({navigation, route, options}) => (
                            <Appbar.Header elevated={headerIsElevated}>
                                <Appbar.Content title={options.title || ""} />
                            </Appbar.Header>
                        ),
                    }}
                    tabBar={({navigation, state, descriptors, insets}) => (
                        <BottomNavigation.Bar
                            navigationState={state}
                            safeAreaInsets={insets}
                            renderIcon={({route, focused, color}) => {
                                const { options } = descriptors[route.key];
                                if (options.tabBarIcon) {
                                    return options.tabBarIcon({ focused, color, size: 24 });
                                }
                                return null;
                            }}
                            onTabPress={({route}) => {
                                navigation.navigate(route.name);
                            }}
                            getLabelText={({ route }) => {
                                const { options } = descriptors[route.key];
                                const label =
                                typeof options.tabBarLabel === 'string'
                                    ? options.tabBarLabel
                                    : typeof options.title === 'string'
                                    ? options.title
                                    : route.name;
                        
                                return label;
                            }}

                        />
                    )}
                >
                    {/* <Tabs.Screen name="library" options={{title: "Library", tabBarIcon: ({focused, color}) => <MaterialCommunityIcons name={focused ? "book" : "book-outline"} size={24} color={color} />}} />
                    <Tabs.Screen name="discover" options={{title: "Discover", tabBarIcon: ({focused, color}) => <MaterialCommunityIcons name={focused ? "compass" : "compass-outline"} size={24} color={color} />}} />
                    <Tabs.Screen name="write" options={{title: "Blog", tabBarIcon: ({focused, color}) => <MaterialCommunityIcons name={focused ? "pencil" : "pencil-outline"} size={24} color={color} />}} />
                    <Tabs.Screen name="account" options={{title: "Account", tabBarIcon: ({focused, color}) => <MaterialCommunityIcons name={focused ? "account" : "account-outline"} size={24} color={color} />}} /> */}
                    <Tabs.Screen name="library" options={{title: "Library", tabBarIcon: ({focused, color}) => <Icon source={focused ? "bookshelf" : "bookshelf"} size={24} color={color} />}} />
                    <Tabs.Screen name="discover" options={{title: "Discover", tabBarIcon: ({focused, color}) => <Icon source={focused ? "compass" : "compass-outline"} size={24} color={color} />}} />
                    <Tabs.Screen name="write" options={{title: "Blog", tabBarIcon: ({focused, color}) => <Icon source={focused ? "pencil" : "pencil-outline"} size={24} color={color} />}} />
                    <Tabs.Screen name="account" options={{title: "Account", tabBarIcon: ({focused, color}) => <Icon source={focused ? "account" : "account-outline"} size={24} color={color} />}} />
                </Tabs>
            </GestureHandlerRootView>
        </headerContext.Provider>
    );
}