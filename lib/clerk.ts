import { getClerkInstance, useAuth } from "@clerk/clerk-expo";
import { useState } from "react";

export const useOrganizationSubscriptions = () => {
    const user = useAuth();
    const [subscriptions, setSubscriptions] = useState({loaded: false, data: []});
    if (!subscriptions.loaded && user.isLoaded && user.orgId !== null) {
        getClerkInstance().getOrganization(user.orgId).then((organization) => {
            organization?.getSubscriptions().then((subscriptions) => {
                setSubscriptions({loaded: true, data: subscriptions.data});
            });
        });
    }
    return subscriptions;
}