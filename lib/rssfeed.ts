import { getClerkInstance, useAuth } from "@clerk/clerk-expo";
import { useState } from "react";
import * as rssParser from 'react-native-rss-parser';
import { Feed } from "react-native-rss-parser";

export const useRSSFeedList = () => {
    const refresh = () => {
        setFeedList({loaded: false, data: [], refresh});
    };
    const { getToken, isLoaded } = useAuth()
    const [feedList, setFeedList] = useState({loaded: false, data: [], refresh});
    if (!feedList.loaded && isLoaded) {
        getToken().then((token) => {
            console.log("Loading feed list");
            fetch(process.env.EXPO_PUBLIC_API_URL + "/v1/rssfeeds", {
                method: "GET",
                redirect: "follow",
                headers: {
                    "Authorization": "Bearer " + token,
                },
            })
            .then(response => response.json())
            .then(data => {
                console.log("Feed list loaded");
                console.log(data);
                setFeedList({loaded: true, data, refresh});
            })
        })
    }
    return feedList;
}

export const addFeed = async (url: string) => {
    const auth = getClerkInstance();
    console.log("Adding feed");
    while (!auth.loaded) {
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log("Waiting for auth");
    }
    console.log("Auth loaded");
    auth.session?.getToken().then(async (token) => {
        await fetch(process.env.EXPO_PUBLIC_API_URL + "/v1/rssfeeds", {
            method: "POST",
            redirect: "follow",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({url}),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return data;
        })
    })
}

export const deleteFeed = async (id: string) => {
    const auth = getClerkInstance();
    console.log("Deleting feed");
    while (!auth.loaded) {
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log("Waiting for auth");
    }
    console.log("Auth loaded");
    auth.session?.getToken().then(async (token) => {
        await fetch(process.env.EXPO_PUBLIC_API_URL + "/v1/rssfeeds/" + id + "/delete", {
            method: "DELETE",
            redirect: "follow",
            headers: {
                "Authorization": "Bearer " + token,
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return data;
        })
    })
}

export function useFeedParser(url: string) {
    const refresh = () => {
        setFeed({loaded: false, data: null, refresh});
    };
    const [feed, setFeed] = useState({loaded: false, data: null as Feed | null, refresh});
    if (!feed.loaded && url !== "" && url !== undefined && url !== null) {
        fetch(url)
        .then(response => response.text())
        .then(resdata => {
            rssParser.parse(resdata).then((feedata: Feed) => {
                setFeed({loaded: true, data: feedata, refresh});
            });
        })
    }
    return feed;
}