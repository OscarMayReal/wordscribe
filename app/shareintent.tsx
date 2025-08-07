import { useShareIntentContext } from "expo-share-intent";
import CreateBookmark from "./librarypages/[id]/createbookmark";

export default function ShareIntentHandler() {
    const shareIntent = useShareIntentContext();
    console.log(shareIntent);
    return <CreateBookmark shareintentMode={true} name={shareIntent.shareIntent?.meta?.title || ""} previewurl={shareIntent.shareIntent?.webUrl || ""} />;
}