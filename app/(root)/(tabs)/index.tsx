import Search from "@/components/search";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { Link } from "expo-router";
import { Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
	return (
		<SafeAreaView className="bg-white h-full">
			<View className="px-5">
				<View className="flex flex-row items-center justify-between mt-5">
          <View className="flex flex-row items-center">
            <Image source={images.avatar} className="size-12 rounded-full"/>
            <View className="flex flex-col items-start ml-2 justify-center">
              <Text className="text-xs font-rubik text-black-100">Hi There,</Text>
              <Text className="text-base font-rubik-medium text-black-300">Hollali</Text>
            </View>
          </View>
          <Image source={icons.bell} className="size-6"/>
        </View>
			</View>
      <Search/>
      <View className="my-5">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-base font-rubik-medium text-black-300">Featured</Text>
          <TouchableOpacity>
            <Text className="text-xs font-rubik text-black-100">See All</Text>
          </TouchableOpacity>
        </View>
      </View>
		</SafeAreaView>
	);
}
