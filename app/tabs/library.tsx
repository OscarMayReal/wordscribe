import { headerContext } from "@/app/tabs/_layout";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function Read() {
    const {headerIsElevated, setHeaderIsElevated} = React.useContext(headerContext);
    return (
        <View>
            <ScrollView onScroll={(e) => setHeaderIsElevated(e.nativeEvent.contentOffset.y > 1)} scrollEventThrottle={16}>
                <Text style={{ height: 10000 }}>Read</Text>
                <Button onPress={() => setHeaderIsElevated(!headerIsElevated)}>Scroll to top</Button>
            </ScrollView>
        </View>
    );
}
