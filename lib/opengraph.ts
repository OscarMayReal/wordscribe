import { getLinkPreview } from 'link-preview-js';
import { useState } from "react";

export function useOGInfo(url: string) {
    const [ogInfo, setOGInfo] = useState({loaded: false, data: {}});
    if (!ogInfo.loaded && url !== "" && url !== undefined) {
        try {
            getLinkPreview(url).then((data) => {
                console.log(data);
                setOGInfo({loaded: true, data});
            });
        } catch (error) {
            console.log(error);
        }
    }
    return ogInfo;
}

export function useExtraInfo(url: string) {
    const [extraInfo, setExtraInfo] = useState({loaded: false, data: {}});
    if (!extraInfo.loaded && url !== "" && url !== undefined) {
        fetch("https://api.mirolink.io/?url=" + encodeURIComponent(url)).then((response) => response.json()).then((data) => {
            console.log(data);
            setExtraInfo({loaded: true, data});
        });
    }
    return extraInfo;
}