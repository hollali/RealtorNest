import { useGlobalContext } from "@/lib/global-provider";
import { Redirect, Slot } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppLayout() {
    const { loading, isLogged } = useGlobalContext();

    return loading ? (
        <SafeAreaView className="bg-white h-full flex justify-center items-center">
            <View>
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        </SafeAreaView>
    ) : isLogged ? (
        <Slot />
    ) : (
        <Redirect href="/sign-in" />
    );
}
