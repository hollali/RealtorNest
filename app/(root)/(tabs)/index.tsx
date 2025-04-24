import { Card, FeaturedCard } from "@/components/cards";
import Filters from "@/components/filters";
import Search from "@/components/search";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { Link } from "expo-router";
import {
	FlatList,
	Image,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export default function Index() {
	return (
		<SafeAreaView className="bg-white h-full">
			<View className="px-5">
				<View className="flex flex-row items-center justify-between mt-5">
					<View className="flex flex-row items-center">
						<Image source={images.avatar} className="size-12 rounded-full"/>
						<View className="flex flex-col items-start ml-2 justify-center">
							<Text className="text-xs font-rubik text-black-100">Hi,</Text>
							<Text className="text-base font-rubik-medium text-black-300">
								John Doe
							</Text>	
						</View>
					</View>
					<Image source={icons.bell} className="size-6"/>
				</View>
			</View>
			<Search/>
			<View className="my-5">
				<View></View>
			</View>
		</SafeAreaView>
	);
}
