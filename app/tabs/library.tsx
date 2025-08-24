import { headerContext } from "@/app/tabs/_layout";
import { createList, useLists } from "@/lib/lists";
import { Tabs, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Dimensions, KeyboardAvoidingView, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Button, FAB, List, Modal, Portal, Text, TextInput, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Read() {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const {headerIsElevated, setHeaderIsElevated} = React.useContext(headerContext);
    const theme = useTheme();
    const router = useRouter();
    const lists = useLists();
    const screensize = Dimensions.get('window');
    const [createListPopupVisible, setCreateListPopupVisible] = useState(false);
    return (
        <View style={{flex: 1}}> 
            <Tabs.Screen options={{header: () => <Header listsHook={lists} />}} />
            {lists.loaded && lists.data?.length > 0 && <ScrollView refreshControl={<RefreshControl refreshing={!lists.loaded} onRefresh={lists.refresh} />} onScroll={(e) => setHeaderIsElevated(e.nativeEvent.contentOffset.y > 1)} scrollEventThrottle={16} style={styles.scrollview}>
                <List.Section>
                    <List.Subheader>Your Lists</List.Subheader>
                    {lists.data?.map((list) => (
                        <List.Item
                            description={list.bookmarks?.length + " bookmark" + (list.bookmarks?.length === 1 ? "" : "s")}
                            left={props => <List.Icon icon="folder" {...props} />}
                            key={list.id}
                            title={list.name}
                            onPress={() => router.push(`/librarypages/${list.id}/bookmarksview`)}
                        />
                    ))}
                </List.Section>
            </ScrollView>}
            {!lists.loaded && <View style={styles.placeholder}>
                <ActivityIndicator />
            </View>}
            {lists.loaded && lists.data?.length === 0 && <View style={styles.placeholder}>
                <Text variant="titleLarge">You don't have any Lists</Text>
                <Text variant="bodyMedium">Create one now to start bookmarking!</Text>
                <Button mode="contained" icon="plus" onPress={() => setCreateListPopupVisible(true)}>Create List</Button>
            </View>}
            <FAB
                icon="plus"
                style={styles.fab}
                size="medium"
                label="Create List"
                onPress={() => setCreateListPopupVisible(true)}
            />
            <CreateListPopup listsHook={lists} visible={createListPopupVisible} onDismiss={() => setCreateListPopupVisible(false)} />
        </View>
    );
}

// function Header({searchQuery, setSearchQuery}: {searchQuery: string, setSearchQuery: (query: string) => void}) {
//     const insets = useSafeAreaInsets();
//     const {headerIsElevated, setHeaderIsElevated} = React.useContext(headerContext);
//     const theme = useTheme();
//     const router = useRouter();
//     const screensize = Dimensions.get('window');
//     return (
//         <Appbar.Header statusBarHeight={insets.top} elevated={headerIsElevated}>
//             <Appbar.Content title={<View style={styles.headerbar}>
//                 <Image source={require("@/assets/images/logo.png")} style={{width: 22, height: 39.04, objectFit: "fill", marginRight: 14}} />
//                 <Searchbar 
//                     placeholder="Search" 
//                     value={searchQuery} 
//                     onChangeText={(query: string) => setSearchQuery(query)} 
//                     style={{backgroundColor: theme.colors.elevation.level2, width: screensize.width - 118}}
//                     editable={false}
//                 />
//                 <Avatar.Icon style={{marginLeft: 10}} size={40} icon="account" />
//             </View>} />
//         </Appbar.Header>
//     );
// }

function Header({listsHook}: {listsHook: {refresh: () => void}}) {
    const insets = useSafeAreaInsets();
    const {headerIsElevated, setHeaderIsElevated} = React.useContext(headerContext);
    const theme = useTheme();
    const router = useRouter();
    const screensize = Dimensions.get('window');
    return (
        <Appbar.Header statusBarHeight={insets.top} elevated={headerIsElevated}>
            <Appbar.Content title={<View style={styles.headerbar}>
                <Text variant="titleLarge">WordScribe</Text>
            </View>} />
            <Appbar.Action icon="magnify" isLeading onPress={() => router.push("/librarypages/searchbookmarks")} />
            <Appbar.Action icon="account" onPress={() => router.push("/tabs/account")} />
            <Appbar.Action icon="refresh" onPress={() => listsHook.refresh()} />
        </Appbar.Header>
    );
}

function CreateListPopup({visible, onDismiss, listsHook}: {visible: boolean, onDismiss: () => void, listsHook: {refresh: () => void, data: any, loaded: boolean}}) {
    const theme = useTheme();
    const screensize = Dimensions.get('window');
    const insets = useSafeAreaInsets();
    const [listName, setListName] = useState('');
    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss}>
                <View style={[styles.modal, {backgroundColor: theme.colors.background, width: screensize.width, height: screensize.height}]}>
                    <KeyboardAvoidingView style={{height: screensize.height}} behavior="padding">
                        <Appbar.Header statusBarHeight={insets.top}>
                            <Appbar.Content title="Create List" />
                            <Appbar.Action icon="close" onPress={onDismiss} />
                        </Appbar.Header>
                        <View style={styles.modalContent}>
                            <TextInput
                                label="List Name"
                                value={listName}
                                onChangeText={setListName}
                                style={{backgroundColor: theme.colors.elevation.level2}}
                            />
                        </View>
                        <View style={styles.modalFooter}>
                            <Button onPress={onDismiss} mode="outlined">Cancel</Button>
                            <Button onPress={() => {console.log("Creating list"); createList(listName).then(() => {listsHook.refresh(); onDismiss();});}} mode="contained">Create</Button>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </Portal>
    );
}

var styles = StyleSheet.create({
    modal: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    scrollview: {
        
    },
    modalContent: {
        padding: 16,
        paddingTop: 0,
        flex: 1,
    },
    modalFooter: {
        padding: 16,
        gap: 16,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    headerbar: {
        flexDirection: "row",
        alignItems: "center",
    },
    placeholder: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
    },
});
