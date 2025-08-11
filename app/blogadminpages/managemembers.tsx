import { useBlogInfo } from "@/lib/blog";
import { useOrganization } from "@clerk/clerk-expo";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Appbar, Button, List, Surface, Text, TextInput } from "react-native-paper";

export default function AddFeed() {
    const organization = useOrganization({
        memberships: true,
        invitations: true,
    });
    const blog = useBlogInfo(organization.organization?.slug)

    const hasActiveSubscription = blog.data.plan == "blog_pro"
    const router = useRouter();
    const [showingAddMember, setShowingAddMember] = useState(false);
    return (
        <View>
            <Stack.Screen options={{headerShown: true, header: () => <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title={`Manage Members`} />
            </Appbar.Header>}} />
            <List.Section>
                <List.Subheader>Members</List.Subheader>
                {!showingAddMember ? <AddMemberButton setShowingAddMember={setShowingAddMember} hasActiveSubscription={hasActiveSubscription} /> : <AddMemberForm setShowingAddMember={setShowingAddMember} />}
                {organization?.memberships?.data?.map((membership) => (
                    <List.Item key={membership.id} title={membership.publicUserData?.firstName + " " + membership.publicUserData?.lastName} description={membership.publicUserData?.identifier} left={(props) => <List.Image source={{uri: membership.publicUserData?.imageUrl}} {...props} style={{...props.style, maxWidth: 40, maxHeight: 40, borderRadius: 999, borderWidth: 1, borderColor: "#ccc"}} />}
                    />
                ))}
            </List.Section>
            <List.Section>
                <List.Subheader>Invitations</List.Subheader>
                {organization?.invitations?.data?.map((invitation) => (
                    <List.Item key={invitation.id} title={invitation.emailAddress} description={invitation.status} left={(props) => <List.Icon icon="email" {...props} />}
                    />
                ))}
            </List.Section>
        </View>
    );
}

function AddMemberButton({setShowingAddMember, hasActiveSubscription}: {setShowingAddMember: (showing: boolean) => void, hasActiveSubscription: boolean}) {
    const organization = useOrganization({
        memberships: true,
    });
    const canAddMember = organization.organization?.membersCount < organization.organization?.maxAllowedMemberships || !hasActiveSubscription;
    return (
        <List.Item title={(!hasActiveSubscription ? "Subscribe to add members" : canAddMember ? "Add Member" : "Max members reached")} description={(!hasActiveSubscription ? "Tap to subscribe" : null)} onPress={() => setShowingAddMember(true)} left={(props) => <List.Icon icon="account-plus" {...props} />} />
    );
}
function AddMemberForm({setShowingAddMember}: {setShowingAddMember: (showing: boolean) => void}) {
    const [email, setEmail] = useState("");
    return (
        <Surface style={{marginHorizontal: 16, borderRadius: 16, padding: 16, marginBottom: 16}}>
            <Text variant="titleLarge" style={{marginBottom: 16}}>Add Member</Text>
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={{marginBottom: 16}}
            />
            <View style={{flexDirection: "row", justifyContent: "flex-end", gap: 16}}>
                <Button mode="outlined" onPress={() => setShowingAddMember(false)}>Cancel</Button>
                <Button mode="contained" onPress={() => console.log('Pressed')}>Add Member</Button>
            </View>
        </Surface>
    );
}
