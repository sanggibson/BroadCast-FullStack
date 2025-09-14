import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";
import { useLevel } from "@/context/LevelContext";
import { ActivityIndicator } from "react-native-paper";
import Video from "react-native-video";

const InputScreen = () => {
  const [cast, setCast] = useState("");
  const [media, setMedia] = useState<
    { uri: string; type: "image" | "video" }[]
  >([]);
  const { user } = useUser();
  const navigation = useNavigation();
  const [postError, setPostError] = useState("");
  const { userDetails, currentLevel } = useLevel(); // Custom hook to get user details and current level
  const [loading, setLoading] = useState(false);
  // Pick from gallery (images + videos)
  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const assets = result.assets.map((asset) => ({
        uri: asset.uri,
        type: asset.type as "image" | "video",
      }));
      setMedia((prev) => [...prev, ...assets]);
      setPostError("");
    }
  };

  // Take photo/video
  const takePhotoOrVideo = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.canceled) {
      setMedia((prev) => [
        ...prev,
        {
          uri: result.assets[0].uri,
          type: result.assets[0].type as "image" | "video",
        },
      ]);
      setPostError("");
    }
  };

  // Remove single media
  const removeMedia = (uri: string) => {
    setMedia((prev) => prev.filter((item) => item.uri !== uri));
  };

  // Upload to Cloudinary
  const uploadToCloudinary = async (uri: string, type: "image" | "video") => {
    const data = new FormData();
    data.append("file", {
      uri,
      type: type === "video" ? "video/mp4" : "image/jpeg",
      name: type === "video" ? "upload.mp4" : "upload.jpg",
    } as any);
    data.append("upload_preset", "MediaCast"); // your preset
    data.append("cloud_name", "ds25oyyqo");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/ds25oyyqo/${type}/upload`,
        { method: "POST", body: data }
      );
      const result = await res.json();
      return result.secure_url;
    } catch (err) {
      console.error("Cloudinary Upload Error:", err);
      return null;
    }
  };

  // Handle Post
  // const handlePost = async () => {
  //   setPostError("");

  //   if (!user) {
  //     setPostError("You must be signed in to post.");
  //     return;
  //   }

  //   if (!cast && media.length === 0) {
  //     setPostError("Please add a caption or upload media before posting.");
  //     return;
  //   }

  //   const uploadedUrls: string[] = [];
  //   for (let item of media) {
  //     const url = await uploadToCloudinary(item.uri, item.type);
  //     if (url) uploadedUrls.push(url);
  //   }

  //   try {
  //     const res = await axios.post("http://192.168.100.4:3000/api/posts", {
  //       userId: user.id,
  //       userName: user.username || `${user.firstName} ${user.lastName}`,
  //       firstName: user.firstName,
  //       nickname: user.publicMetadata?.nickname || "",
  //       caption: cast,
  //       media: uploadedUrls,

  //       // ✅ Attach current level here
  //       levelType: currentLevel.type, // e.g., "county", "ward", "home"
  //       levelValue: currentLevel.value, // e.g., "Nairobi", "Westlands"
  //     });

  //     console.log("✅ Post saved:", res.data);
  //     setCast("");
  //     setMedia([]);
  //     navigation.goBack();
  //   } catch (err: any) {
  //     console.error("❌ Post Error:", err.response?.data || err.message);
  //     setPostError("Something went wrong while posting.");
  //   }
  // };
const handlePost = async () => {
  setPostError("");

  if (!user) {
    setPostError("You must be signed in to post.");
    return;
  }

  if (!cast && media.length === 0) {
    setPostError("Please add a caption or upload media before posting.");
    return;
  }

  const uploadedUrls: string[] = [];
  for (let item of media) {
    const url = await uploadToCloudinary(item.uri, item.type);
    if (url) uploadedUrls.push(url);
  }

  try {
    const res = await axios.post("http://192.168.100.4:3000/api/posts", {
      userId: user.id, // Clerk ID only
      caption: cast,
      media: uploadedUrls,
      levelType: currentLevel.type, // e.g., "county", "ward", "home"
      levelValue: currentLevel.value, // e.g., "Nairobi", "Westlands"
    });

    console.log("✅ Post saved:", res.data);
    setCast("");
    setMedia([]);
    navigation.goBack();
  } catch (err: any) {
    console.error("❌ Post Error:", err.response?.data || err.message);
    setPostError("Something went wrong while posting.");
  }
};

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>
        <Text className="font-bold text-2xl">
          {currentLevel?.type === "home"
            ? "Home"
            : `${
                currentLevel?.value && typeof currentLevel.value === "string"
                  ? currentLevel.value.charAt(0).toUpperCase() +
                    currentLevel.value.slice(1)
                  : "currentLevel"
              } ${
                currentLevel?.type && typeof currentLevel.type === "string"
                  ? currentLevel.type.charAt(0).toUpperCase() +
                    currentLevel.type.slice(1)
                  : "currentLevel"
              }`}
        </Text>
        <TouchableOpacity
          disabled={!cast && media.length === 0}
          onPress={handlePost}
          style={[
            styles.postButton,
            { opacity: cast || media.length > 0 ? 1 : 0.6 },
          ]}
        >
          <View className="flex-row items-center gap-2">
            {loading && <ActivityIndicator color="#fff" size={"small"} />}
            <Text style={styles.postButtonText}>Post</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Media Previews */}
      {media.length > 0 &&
        (media.length === 1 ? (
          // Single media: full width
          <View style={styles.previewWrapperFull}>
            <Image source={{ uri: media[0].uri }} style={styles.postImgFull} />
            {media[0].type === "video" && (
              <View style={styles.playIconFull}>
                <Video
                  source={{ uri: media[0].uri }}
                  style={{ width: 300, height: 300, borderRadius: 10 }}
                  resizeMode="cover"
                  controls
                  paused={false}
                />
                {/* <Ionicons name="play-circle" size={50} color="white" /> */}
              </View>
            )}
            <TouchableOpacity
              style={styles.removeButtonFull}
              onPress={() => removeMedia(media[0].uri)}
            >
              <Ionicons name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ) : (
          // Multiple media: horizontal scroll
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {media.map((item, index) => (
              <View key={index} style={styles.previewWrapper}>
                <Image source={{ uri: item.uri }} style={styles.postImg} />
                {item.type === "video" && (
                  <View style={styles.playIcon}>
                    <Video
                      source={{ uri: item.uri }}
                      style={{ width: 300, height: 300, borderRadius: 10 }}
                      resizeMode="cover"
                      controls
                      paused={false}
                    />
                    {/* <Ionicons name="play-circle" size={36} color="white" /> */}
                  </View>
                )}
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeMedia(item.uri)}
                >
                  <Ionicons name="close-circle" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        ))}

      {postError && <Text style={{ color: "red" }}>{postError}</Text>}

      {/* Caption */}
      <TextInput
        placeholder="What's on your mind..."
        style={styles.captionInput}
        multiline
        value={cast}
        onChangeText={setCast}
      />

      {/* Camera + Gallery buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={takePhotoOrVideo}>
          <Ionicons name="camera" size={24} color="blue" />
          <Text>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={pickMedia}>
          <Ionicons name="image" size={24} color="blue" />
          <Text>Gallery</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default InputScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15, marginTop: 10 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    marginTop: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  postButton: {
    backgroundColor: "blue",
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  postButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  previewWrapper: { position: "relative", marginRight: 10 },
  postImg: { width: 120, height: 120, borderRadius: 12 },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "white",
    borderRadius: 12,
  },
  playIcon: { position: "absolute", top: "35%", left: "35%" },
  captionInput: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    marginVertical: 20,
  },
  actionsRow: { flexDirection: "row", justifyContent: "space-around" },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  previewWrapperFull: {
    position: "relative",
    width: "100%",
    height: 300,
    marginVertical: 8,
  },
  postImgFull: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  playIconFull: {
    position: "absolute",
    top: "40%",
    left: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonFull: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "white",
    borderRadius: 12,
  },
});
