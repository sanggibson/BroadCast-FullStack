import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useUserOnboarding } from "@/contexts/UserOnBoardingContext";
import { useAuth, useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Location">;

const NamesScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useUser();
  const { getToken } = useAuth();

  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    nickName,
    setNickName,
    image,
    setImage,
  } = useUserOnboarding();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pick image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName || !nickName) {
      setError("All fields are required");
      return;
    }
    setLoading(true);

    try {
      const payload = {
        clerkId: user?.id,
        email: user?.primaryEmailAddress?.emailAddress,
        firstName,
        lastName,
        nickName,
        image, // 👈 send selected image
        provider: "clerk",
      };

      const res = await axios.post(
        "http://192.168.100.4:3000/api/users/create-user",
        payload
      );

      if (res.data.success) {
        // Update Clerk metadata
        await user?.update({
          unsafeMetadata: {
            hasNames: true,
            ...user.unsafeMetadata,
          },
        });

        navigation.replace("Location");
      }
    } catch (err) {
      console.log("Error saving user:", err);
      setError("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4 justify-center">
      <Text className="font-bold mb-2 text-center text-2xl">
        Complete Your Profile 🚀
      </Text>

      {/* Profile Image */}
      <TouchableOpacity onPress={pickImage} className="items-center mb-4">
        {image ? (
          <Image
            source={{ uri: image }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
        ) : (
          <View className="w-24 h-24 bg-gray-200 rounded-full items-center justify-center">
            <Text>Add Image</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        className="border border-gray-300 rounded-lg p-3 mb-3"
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        className="border border-gray-300 rounded-lg p-3 mb-3"
      />
      <TextInput
        placeholder="Nickname"
        value={nickName}
        onChangeText={setNickName}
        className="border border-gray-300 rounded-lg p-3 mb-3"
      />

      {error ? <Text className="text-red-500 mb-3">{error}</Text> : null}

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        className="bg-black py-4 rounded-xl items-center"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold text-base">
            Save & Continue
          </Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default NamesScreen;
