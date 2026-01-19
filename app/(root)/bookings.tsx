import { Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "@/lib/global-provider";
import { useEffect, useState } from "react";
import { getBookingsForUser, getPropertyById } from "@/lib/appwrite";
import { router } from "expo-router";
import icons from "@/constants/icons";

export default function BookingsScreen() {
  const { user } = useGlobalContext();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.$id) {
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const data = await getBookingsForUser(user.$id);
        const propertyResults = await Promise.allSettled(
          data.map(async (booking) => {
            const property = await getPropertyById({ id: booking.propertyId });
            return { ...booking, property };
          }),
        );

        const detailedBookings = propertyResults
          .map((result, index) => {
            if (result.status === "fulfilled") {
              return result.value;
            } else {
              console.error(
                `Failed to fetch property for booking at index ${index}:`,
                result.reason,
              );
              return { ...data[index], property: null };
            }
          })
          .filter((booking) => booking.property !== null);

        setBookings(detailedBookings);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch bookings";
        setError(errorMessage);
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handlePropertyPress = (propertyId: string | undefined) => {
    if (propertyId) {
      router.push(`/property/${propertyId}` as any);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-5 bg-white">
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.push("/(root)/(tabs)/profile")}
          className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
        >
          <Image source={icons.backArrow} className="w-5 h-5 mr-2" />
        </TouchableOpacity>

        {/* Error State */}
        {error && (
          <Text className="text-lg font-rubik-bold text-red-500 p-3 bg-red-100 rounded-lg mb-3">
            {error}
          </Text>
        )}

        {/* Loading */}
        {loading && (
          <Text className="text-lg font-rubik p-3">Loading bookings...</Text>
        )}

        {/* No Bookings */}
        {!loading && bookings.length === 0 && (
          <Text className="text-lg font-rubik p-3">No bookings yet.</Text>
        )}

        {/* Bookings List */}
        {!loading &&
          bookings.length > 0 &&
          bookings.map((booking) => (
            <TouchableOpacity
              key={booking.$id || booking.id || `booking-${Date.now()}`}
              onPress={() => handlePropertyPress(booking.property?.$id)}
              className="mb-4 bg-primary-100 p-4 rounded-xl"
            >
              <Image
                source={{ uri: booking.property?.image }}
                className="h-40 w-full rounded-xl mb-3"
              />
              <Text className="text-xl font-rubik-bold">
                {booking.property?.name}
              </Text>
              <Text className="text-black-200 font-rubik mt-1">
                Booked for ${booking.price}
              </Text>
              <Text className="text-black-300 text-xs">
                {new Date(booking.date).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}
