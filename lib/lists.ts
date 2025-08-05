import { getClerkInstance, useAuth } from "@clerk/clerk-expo";
import { useState } from "react";

export function useLists() {
    const refresh = () => {
        setLists({loaded: false, data: [], refresh});
    };
    const [lists, setLists] = useState({loaded: false, data: [], refresh});
    const { getToken, isLoaded } = useAuth()
    console.log(isLoaded);
    if (!lists.loaded && isLoaded) {
        console.log("Loading lists");
        console.log(process.env.EXPO_PUBLIC_API_URL + "/v1/lists");
        getToken().then((token) => {
            fetch(process.env.EXPO_PUBLIC_API_URL + "/v1/lists", {
                method: "GET",
                redirect: "follow",
                headers: {
                    "Authorization": "Bearer " + token,
                },
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setLists({loaded: true, data, refresh});
            })
        })
    }
    return lists;
}

export async function createList(name: string) {
    const auth = getClerkInstance();
    console.log("Creating list");
    while (!auth.loaded) {
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log("Waiting for auth");
    }
    console.log("Auth loaded");
    auth.session?.getToken().then((token) => {
        fetch(process.env.EXPO_PUBLIC_API_URL + "/v1/lists", {
            method: "POST",
            redirect: "follow",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({name}),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return data;
        })
    })
}

export function useListContent(listId: string) {
    const refresh = () => {
        setContent({loaded: false, data: [], refresh});
    };
    const [content, setContent] = useState({loaded: false, data: [], refresh});
    const { getToken, isLoaded } = useAuth()
    console.log(isLoaded);
    if (!content.loaded && isLoaded) {
        console.log("Loading list content");
        console.log(process.env.EXPO_PUBLIC_API_URL + "/v1/lists/" + listId + "/bookmarks");
        getToken().then((token) => {
            fetch(process.env.EXPO_PUBLIC_API_URL + "/v1/lists/" + listId + "/bookmarks", {
                method: "GET",
                redirect: "follow",
                headers: {
                    "Authorization": "Bearer " + token,
                },
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setContent({loaded: true, data, refresh});
            })
        })
    }
    return content;
}

export function useBookmarkInfo(id: string) {
    const refresh = () => {
        setBookmarkInfo({loaded: false, data: [], refresh});
    };
    const [bookmarkInfo, setBookmarkInfo] = useState({loaded: false, data: [], refresh});
    const { getToken, isLoaded } = useAuth()
    console.log(isLoaded);
    if (!bookmarkInfo.loaded && isLoaded) {
        console.log("Loading bookmark info");
        console.log(process.env.EXPO_PUBLIC_API_URL + "/v1/bookmarks/" + id + "/info");
        getToken().then((token) => {
            fetch(process.env.EXPO_PUBLIC_API_URL + "/v1/bookmarks/" + id + "/info", {
                method: "GET",
                redirect: "follow",
                headers: {
                    "Authorization": "Bearer " + token,
                },
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setBookmarkInfo({loaded: true, data, refresh});
            })
        })
    }
    return bookmarkInfo;
}
    

export function useListInfo(listId: string) {
    const refresh = () => {
        setListInfo({loaded: false, data: [], refresh});
    };
    const [listInfo, setListInfo] = useState({loaded: false, data: [], refresh});
    const { getToken, isLoaded } = useAuth()
    console.log(isLoaded);
    if (!listInfo.loaded && isLoaded) {
        console.log("Loading list info");
        console.log(process.env.EXPO_PUBLIC_API_URL + "/v1/lists/" + listId + "/info");
        getToken().then((token) => {
            fetch(process.env.EXPO_PUBLIC_API_URL + "/v1/lists/" + listId + "/info", {
                method: "GET",
                redirect: "follow",
                headers: {
                    "Authorization": "Bearer " + token,
                },
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setListInfo({loaded: true, data, refresh});
            })
        })
    }
    return listInfo;
}

export const setBookmarkRead = async (bookmarkId: string, state: boolean) => {
    const auth = getClerkInstance();
    console.log("Setting bookmark read");
    while (!auth.loaded) {
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log("Waiting for auth");
    }
    console.log("Auth loaded");
    auth.session?.getToken().then((token) => {
        fetch(process.env.EXPO_PUBLIC_API_URL + "/v1/bookmarks/" + bookmarkId + "/read", {
            method: "POST",
            redirect: "follow",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({state}),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return data;
        })
    })
}