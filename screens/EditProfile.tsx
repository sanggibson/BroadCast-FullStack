import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
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
import * as ImagePicker from "expo-image-picker";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Location">;

const CLOUDINARY_UPLOAD_PRESET = "MediaCast";
const CLOUDINARY_CLOUD_NAME = "ds25oyyqo";

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
    setImage,
  } = useUserOnboarding();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [canEdit, setCanEdit] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [fetching, setFetching] = useState(true);

  // Cloudinary upload function
  const uploadToCloudinary = async (uri: string) => {
    const data = new FormData();
    data.append("file", {
      uri,
      type: "image/jpeg",
      name: "upload.jpg",
    } as any);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    data.append("cloud_name", CLOUDINARY_CLOUD_NAME);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
      );
      const result = await res.json();
      return result.secure_url;
    } catch (err) {
      console.error("Cloudinary Upload Error:", err);
      return null;
    }
  };

  // Fetch user data from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!user?.id) return;
        const res = await axios.get(
          `http://192.168.100.4:3000/api/users/${user.id}`
        );
        const data = res.data;
        if (data) {
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setNickName(data.nickName || "");
          setImage(data.image || "");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchUser();
  }, [user]);

  // 24-hour countdown
  useEffect(() => {
    if (!user?.createdAt) return;

    const createdAt = new Date(user.createdAt).getTime();
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    const updateTime = () => {
      const now = Date.now();
      const diff = TWENTY_FOUR_HOURS - (now - createdAt);
      if (diff <= 0) {
        setCanEdit(true);
        setTimeLeft(0);
      } else {
        setCanEdit(false);
        setTimeLeft(Math.floor(diff / 1000));
      }
    };

    updateTime(); // initial call
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [user]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (err) {
      console.error("Error picking image:", err);
    }
  };

  const handleSubmit = async () => {
    if (!canEdit) return; // prevent click before time
    if (!firstName || !lastName || !nickName) {
      setError("All fields are required");
      return;
    }
    setLoading(true);

    try {
      let uploadedImageUrl = image;

      if (image && !image.startsWith("http")) {
        const url = await uploadToCloudinary(image);
        if (!url) throw new Error("Failed to upload image");
        uploadedImageUrl = url;
      }

      const payload = {
        clerkId: user?.id,
        email: user?.primaryEmailAddress?.emailAddress,
        firstName,
        lastName,
        nickName,
        image: uploadedImageUrl,
        provider: "clerk",
      };

      const res = await axios.post(
        "http://192.168.100.4:3000/api/users/create-user",
        payload
      );

      if (res.data.success) {
        await user?.update({
          unsafeMetadata: {
            hasNames: true,
            ...user.unsafeMetadata,
          },
        });
        navigation.goBack();
      }
    } catch (err) {
      console.log("Error saving user:", err);
      setError("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <View className="flex-row items-center mb-6 justify-between">
        <Text></Text>
        <Text className="font-bold mb-2 text-center text-2xl">
          Edit Your Profile 🚀
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <Text className="text-gray-600 mb-4 font-bold text-2xl">
        {canEdit
          ? "You can now edit your profile!"
          : `Time left: ${formatTime(timeLeft)}`}
      </Text>

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
        placeholder="Nickname"
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
        disabled={!canEdit || loading}
        style={{
          backgroundColor: !canEdit ? "#ccc" : "#000",
          paddingVertical: 16,
          borderRadius: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading && (
          <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
        )}
        <Text
          style={{
            color: !canEdit ? "#666" : "#fff",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          {loading ? "Saving..." : "Save & Continue"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EditProfile;
