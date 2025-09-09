import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useUserOnboarding } from "@/contexts/UserOnBoardingContext";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation";
import { Ionicons } from "@expo/vector-icons";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Location">;

const EditProfile = () => {
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
  } = useUserOnboarding();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [canEdit, setCanEdit] = useState(true);

  // Check if 24 hours have passed since account creation
  useEffect(() => {
    if (user?.createdAt) {
      const createdAt = new Date(user.createdAt).getTime();
      const now = Date.now();
      const hoursSinceCreation = (now - createdAt) / (1000 * 60 * 60);

      if (hoursSinceCreation > 24) {
        setCanEdit(false);
      }
    }
  }, [user]);

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
        image: user?.imageUrl || image,
        provider: "clerk",
      };

      const res = await axios.post(
        "http://192.168.100.4:3000/api/users/create-user",
        payload
      );

      if (res.data.success) {
        // 🔹 Update Clerk metadata
        await user?.update({
          unsafeMetadata: {
            hasNames: true,
            ...user.unsafeMetadata,
          },
        });

        // 🔹 Go to next step (Location)
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
      <View className="flex-row items-center mb-6 justify-between">
        <Text></Text>
        <Text className="font-bold mb-2 text-center text-2xl">
          Edit Your Profile 🚀
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className=" p-2"
        >
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {!canEdit && (
        <Text className="text-red-500 mb-3 text-center">
          You can only edit your profile within 24 hours of account creation.
        </Text>
      )}

      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        editable={canEdit}
        className={`border border-gray-300 rounded-lg p-3 mb-3 ${
          !canEdit ? "bg-gray-100" : ""
        }`}
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        editable={canEdit}
        className={`border border-gray-300 rounded-lg p-3 mb-3 ${
          !canEdit ? "bg-gray-100" : ""
        }`}
      />
      <TextInput
        placeholder="Nick Name"
        value={nickName}
        onChangeText={setNickName}
        editable={canEdit}
        className={`border border-gray-300 rounded-lg p-3 mb-3 ${
          !canEdit ? "bg-gray-100" : ""
        }`}
      />

      {error ? <Text className="text-red-500 mb-3">{error}</Text> : null}

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading || !canEdit}
        className={`bg-black py-4 rounded-xl items-center ${
          !canEdit ? "bg-gray-400" : ""
        }`}
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

export default EditProfile;
