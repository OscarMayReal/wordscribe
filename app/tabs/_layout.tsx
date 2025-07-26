import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from "expo-router";
import React from "react";
import { Appbar, BottomNavigation, useTheme } from "react-native-paper";

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
    return (
        <headerContext.Provider value={{headerIsElevated, setHeaderIsElevated, tabIsElevated, setTabIsElevated}}>
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
                <Tabs.Screen name="library" options={{title: "Library", tabBarIcon: ({focused, color}) => <MaterialCommunityIcons name={focused ? "book" : "book-outline"} size={24} color={color} />}} />
                <Tabs.Screen name="discover" options={{title: "Discover", tabBarIcon: ({focused, color}) => <MaterialCommunityIcons name={focused ? "compass" : "compass-outline"} size={24} color={color} />}} />
                <Tabs.Screen name="write" options={{title: "Blog", tabBarIcon: ({focused, color}) => <MaterialCommunityIcons name={focused ? "pencil" : "pencil-outline"} size={24} color={color} />}} />
                <Tabs.Screen name="account" options={{title: "Account", tabBarIcon: ({focused, color}) => <MaterialCommunityIcons name={focused ? "account" : "account-outline"} size={24} color={color} />}} />
            </Tabs>
        </headerContext.Provider>
    );
}