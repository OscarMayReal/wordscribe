import { useAuth } from "@clerk/clerk-expo";
import { useState } from "react";

export function useContent(id: string) {
    const refresh = () => {
        setContent({loaded: false, data: "", refresh});
    };
    const [content, setContent] = useState({loaded: false, data: "", refresh});
    const { getToken, isLoaded } = useAuth()
    console.log(isLoaded);
    if (!content.loaded && isLoaded && content.data === "") {
        console.log("Loading content");
        console.log(process.env.EXPO_PUBLIC_API_URL + "/v1/parsebookmark/" + id);
        getToken().then((token) => {
            fetch(process.env.EXPO_PUBLIC_API_URL + "/v1/parsebookmark/" + id, {
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