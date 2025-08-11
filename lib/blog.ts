import { getClerkInstance, useAuth } from "@clerk/clerk-expo";
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

export const useBlogInfo = (blogslug: string) => {
    const { getToken, isLoaded } = useAuth()
    const refresh = () => {
        setPosts({loaded: false, data: [], refresh});
    };
    const [posts, setPosts] = useState({loaded: false, data: {}, refresh});
    if (!posts.loaded && isLoaded) {
        getToken().then((token) => {
            fetch(process.env.EXPO_PUBLIC_API_URL + "/v1/blog/" + blogslug + "/info", {
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

export const createBlogPost = async (blogslug: string, title: string) => {
    return new Promise(async (resolve, reject) => {
        const auth = getClerkInstance();
        while (!auth.loaded) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        auth.session?.getToken().then(async (token) => {
            console.log("Creating post");
            var response = await fetch(process.env.EXPO_PUBLIC_API_URL + "/v1/blog/" + blogslug + "/posts", {
                method: "POST",
                redirect: "follow",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({title}),
            })
            var data = await response.json()
            console.log(data);
            resolve(data);
        })
    })
}

export const DeletePost = async (blogslug: string, postid: string) => {
    return new Promise(async (resolve, reject) => {
        const auth = getClerkInstance();
        while (!auth.loaded) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        auth.session?.getToken().then(async (token) => {
            console.log("Deleting post");
            var response = await fetch(process.env.EXPO_PUBLIC_API_URL + "/v1/blog/" + blogslug + "/posts/" + postid + "/delete", {
                method: "DELETE",
                redirect: "follow",
                headers: {
                    "Authorization": "Bearer " + token,
                },
            })
            var data = await response.json()
            console.log(data);
            resolve(data);
        })
    })
}

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

const getBlogPost = async (blogslug: string, postid: string) => {
    return new Promise(async (resolve, reject) => {
        const auth = getClerkInstance();
        while (!auth.loaded) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        auth.session?.getToken().then(async (token) => {
            console.log("Getting post");
            const response = await fetch(process.env.EXPO_PUBLIC_API_URL + "/v1/blog/" + blogslug + "/posts/" + postid + "/info", {
                method: "GET",
                redirect: "follow",
                headers: {
                    "Authorization": "Bearer " + token,
                },
            })
            const data = await response.json()
            console.log(data);
            resolve(data);
        })
    })
}

export const savePostDraft = async (blogslug: string, postid: string, content: string) => {
    const auth = getClerkInstance();
    while (!auth.loaded) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    auth.session?.getToken().then(async (token) => {
        console.log("Saving draft");
        await fetch(process.env.EXPO_PUBLIC_API_URL + "/v1/blog/" + blogslug + "/posts/" + postid, {
            method: "PUT",
            redirect: "follow",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({draftContent: content}),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return data;
        })
    })
}

export const updatePostName = async (blogslug: string, postid: string, name: string) => {
    const auth = getClerkInstance();
    while (!auth.loaded) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    auth.session?.getToken().then(async (token) => {
        console.log("Saving draft");
        await fetch(process.env.EXPO_PUBLIC_API_URL + "/v1/blog/" + blogslug + "/posts/" + postid, {
            method: "PUT",
            redirect: "follow",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({title: name}),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return data;
        })
    })
}

export const updatePostPublic = async (blogslug: string, postid: string, postPublic: boolean) => {
    const auth = getClerkInstance();
    while (!auth.loaded) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    auth.session?.getToken().then(async (token) => {
        console.log("Saving draft");
        console.log(postPublic);
        await fetch(process.env.EXPO_PUBLIC_API_URL + "/v1/blog/" + blogslug + "/posts/" + postid, {
            method: "PUT",
            redirect: "follow",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({public: postPublic}),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return data;
        })
    })
}

export const publishDraftChanges = async (blogslug: string, postid: string) => {
    const auth = getClerkInstance();
    const blog = await getBlogPost(blogslug, postid);
    console.log("blog", blog);
    while (!auth.loaded) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    auth.session?.getToken().then(async (token) => {
        console.log("Publishing draft");
        await fetch(process.env.EXPO_PUBLIC_API_URL + "/v1/blog/" + blogslug + "/posts/" + postid, {
            method: "PUT",
            redirect: "follow",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({content: blog.draftContent}),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return data;
        })
    })
}

    