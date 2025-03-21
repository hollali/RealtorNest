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
			<FlatList 
				data={[1,2]} 
				renderItem={({item}) => (
					<Card
						item={{
							$id: item.toString(),
							$collectionId: "",
							$databaseId: "",
							$createdAt: "",
							$updatedAt: "",
							$permissions: [],
						}}
					/>
				)}
				keyExtractor={(item) => item.toString()}
				numColumns={2}
				contentContainerClassName="pb-32"
				columnWrapperClassName="flex gap-5 px-5"
				ListHeaderComponent={
					<View className="px-5">
				<View className="flex flex-row items-center justify-between mt-5">
					<View className="flex flex-row items-center">
						<Image source={images.avatar} className="size-12 rounded-full" />
						<View className="flex flex-col items-start ml-2 justify-center">
							<Text className="text-xs font-rubik text-black-100">
								Hi There,
							</Text>
							<Text className="text-base font-rubik-medium text-black-300">
								Hollali Kelvin
							</Text>
						</View>
					</View>
					<Image source={icons.bell} className="size-6" />
				</View>
				<Search />
				<View className="my-5">
					<View className="flex flex-row items-center justify-between">
						<Text className="text-xl font-rubik-bold text-black-300">
							Featured
						</Text>
						<TouchableOpacity>
							<Text className="text-base font-rubik-bold text-primary-300">
								See All
							</Text>
						</TouchableOpacity>
					</View>
					<View className="flex flex-row gap-5 mt-5">
						<FeaturedCard
							item={{
								$id: "",
								$collectionId: "",
								$databaseId: "",
								$createdAt: "",
								$updatedAt: "",
								$permissions: [],
							}}
						/>
						<FeaturedCard
							item={{
								$id: "",
								$collectionId: "",
								$databaseId: "",
								$createdAt: "",
								$updatedAt: "",
								$permissions: [],
							}}
						/>
					</View>
				</View>
				<View className="flex flex-row items-center justify-between">
					<Text className="text-xl font-rubik-bold text-black-300">
						Our Recommendation
					</Text>
					<TouchableOpacity>
						<Text className="text-base font-rubik-bold text-primary-300">
							See All
						</Text>
					</TouchableOpacity>
				</View>
				<Filters/>
				<View className="flex flex-row gap-5 mt-5">
					<Card
						item={{
							$id: "",
							$collectionId: "",
							$databaseId: "",
							$createdAt: "",
							$updatedAt: "",
							$permissions: [],
						}}
					/>
					<Card
						item={{
							$id: "",
							$collectionId: "",
							$databaseId: "",
							$createdAt: "",
							$updatedAt: "",
							$permissions: [],
						}}
					/>
				</View>
			</View>
				}
			/>
		</SafeAreaView>
	);
}
