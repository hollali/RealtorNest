import { Avatars,Client,Account,Databases,OAuthProvider,Query,} from "react-native-appwrite";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import { Storage } from "react-native-appwrite";
import * as FileSystem from "expo-file-system";

export const config = {
	platform: "com.hollali.realtornest",
	endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
	projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
	iosProjectId: process.env.EXPO_PUBLIC_APPWRITE_IOS_PROJECT_ID,
	databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
	galleriesCollectionId:process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID,
	reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
	agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID,
	propertiesCollectionId:process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID,
	bookingsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID,
	storageBucketId: process.env.EXPO_PUBLIC_APPWRITE_STORAGE_BUCKET_ID,
	userProfilesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_PROFILES_COLLECTION_ID,
};

export const client = new Client();

client
	.setEndpoint(config.endpoint!)
	.setProject(config.projectId!)
	.setPlatform(config.platform!)

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export async function login() {
	try {
		const redirectUri = Linking.createURL("/");
		const response = await account.createOAuth2Token(
			OAuthProvider.Google,
			redirectUri
		);
		if (!response) throw new Error("Failed to login");
		const browserResult = await openAuthSessionAsync(
			response.toString(),
			redirectUri
		);
		if (browserResult.type !== "success") throw new Error("Failed to login");
		const url = new URL(browserResult.url);
		const secret = url.searchParams.get("secret")?.toString();
		const userId = url.searchParams.get("userId")?.toString();

		if (!secret || !userId) throw new Error("Failed to login");
		const session = await account.createSession(userId, secret);
		if (!session) throw new Error("Failed to create a session");

		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

export async function logout() {
	try {
		await account.deleteSession("current");
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

export async function getCurrentUser() {
	try {
		const response = await account.get(); // Throws if guest
		if (response?.$id) {
			const useAvatar = avatar.getInitials(response.name);
			return {
				...response,
				avatar: useAvatar.toString(),
			};
		}
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.warn("User not authenticated:", error.message);
		} else {
			console.warn("Unknown error occurred", error);
		}
		return null;
	}
}


export async function getLatestProperties() {
	try {
		const result = await databases.listDocuments(
			config.databaseId!,
			config.propertiesCollectionId!,
			[Query.orderDesc("$createdAt"), Query.limit(5)]
		);
		return result.documents;
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function getProperties({
	filter,
	query,
	limit,
}: {
	filter: string;
	query: string;
	limit?: number;
}) {
	try {
		const buildQuery = [Query.orderDesc("$createdAt")];

		if (filter && filter !== "All")
			buildQuery.push(Query.equal("type", filter));

		if (query)
			buildQuery.push(
				Query.or([
					Query.search("name", query),
					Query.search("address", query),
					Query.search("type", query),
				])
			);

		if (limit) buildQuery.push(Query.limit(limit));

		const result = await databases.listDocuments(
			config.databaseId!,
			config.propertiesCollectionId!,
			buildQuery
		);

		return result.documents;
	} catch (error) {
		console.error(error);
		return [];
	}
}

// write function to get property by id
export async function getPropertyById({ id }: { id: string }) {
	try {
		const result = await databases.getDocument(
			config.databaseId!,
			config.propertiesCollectionId!,
			id
		);
		return result;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getBookingsForUser(userId: string) {
	try {
		const result = await databases.listDocuments(
			config.databaseId!,
			config.bookingsCollectionId!,
			[Query.equal("userId", userId), Query.orderDesc("$createdAt")]
		);
		return result.documents;
	} catch (error) {
		console.error("Error fetching user bookings:", error);
		return [];
	}
}

export async function createBooking({
	userId,
	propertyId,
	price,
}: {
	userId: string;
	propertyId: string;
	price: number;
}) {
	try {
		const result = await databases.createDocument(
			config.databaseId!,
			config.bookingsCollectionId!,
			"unique()", // Appwrite will auto-generate a unique ID
			{
				userId,
				propertyId,
				price,
				date: new Date().toISOString(), // optional field for tracking
			}
		);
		return result;
	} catch (error) {
		console.error("Error creating booking:", error);
		throw error;
	}
}

export async function uploadProfileImage(uri: string, userId: string) {
	try {
		// Get file info including size
		const fileInfo = await FileSystem.getInfoAsync(uri);
		if (!fileInfo.exists || !fileInfo.size) {
			throw new Error("File does not exist or size is unknown");
		}

		const file = {
			uri,
			name: `${userId}-avatar.jpg`,
			type: "image/jpeg",
			size: fileInfo.size,
		};

		const uploadedFile = await storage.createFile(
			config.storageBucketId!,
			"user-" + userId,
			file
		);

		const imageUrl = storage.getFilePreview(config.storageBucketId!, uploadedFile.$id).href;

		return imageUrl;
	} catch (error) {
		console.error("Failed to upload profile image:", error);
		return null;
	}
}
