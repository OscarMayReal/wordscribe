import { useAuth } from "@clerk/clerk-expo";
import { useState } from "react";

export const useBlogPosts = (blogslug: string) => {
    const { getToken, isLoaded } = useAuth()
    const refresh = () => {
        setPosts({loaded: false, data: [], refresh});
    };
    const [posts, setPosts] = useState({loaded: false, data: [], refresh});
    if (!posts.loaded && isLoaded) {
        getToken().then((token) => {
            fetch(process.env.EXPO_PUBLIC_API_URL + "/v1/blog/" + blogslug + "/posts", {
                method: "GET",
                redirect: "follow",
                headers: {
                    "Authorization": "Bearer " + token,
                },
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setPosts({loaded: true, data, refresh});
            })
        })
    }
    return posts;
};

export const useBlogPost = (blogslug: string, postid: string) => {
    const { getToken, isLoaded } = useAuth()
    const refresh = () => {
        setPost({loaded: false, data: [], refresh});
    };
    const [post, setPost] = useState({loaded: false, data: [], refresh});
    if (!post.loaded && isLoaded) {
        getToken().then((token) => {
            fetch(process.env.EXPO_PUBLIC_API_URL + "/v1/blog/" + blogslug + "/posts/" + postid + "/info", {
                method: "GET",
                redirect: "follow",
                headers: {
                    "Authorization": "Bearer " + token,
                },
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setPost({loaded: true, data, refresh});
            })
        })
    }
    return post;
};
    