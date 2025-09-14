import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";

type Media = { uri: string; type: "image" | "video" };
const screenWidth = Dimensions.get("window").width;

const StatusInput = () => {
  const [status, setStatus] = useState("");
  const [media, setMedia] = useState<Media[]>([]);
  const [uploading, setUploading] = useState(false);
  const { user } = useUser();
  const navigation = useNavigation();

  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: false,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newMedia = result.assets.map((asset) => ({
        uri: asset.uri,
        type: asset.type as "image" | "video",
      }));
      setMedia((prev) => [...prev, ...newMedia]);
    }
  };

  const takeMedia = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: false,
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
    }
  };

  const removeMedia = (uri: string) => {
    setMedia((prev) => prev.filter((m) => m.uri !== uri));
  };

  const uploadToCloudinary = async (uri: string, type: "image" | "video") => {
    const data = new FormData();
    data.append("file", {
      uri,
      type: type === "video" ? "video/mp4" : "image/jpeg",
      name: type === "video" ? "upload.mp4" : "upload.jpg",
    } as any);
    data.append("upload_preset", "MediaCast");
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

  const handlePost = async () => {
    if (!status.trim() && media.length === 0) {
      alert("Please add a status or media!");
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (const m of media) {
      const url = await uploadToCloudinary(m.uri, m.type);
      if (url) uploadedUrls.push(url);
    }

    try {
     await axios.post("http://192.168.100.4:3000/api/statuses", {
       userId: user?.id,
       userName:
         user?.firstName ||
         user?.username ||
         user?.publicMetadata?.nickname ||
         "Anonymous",
       caption: status,
       media: uploadedUrls,
     });


      setStatus("");
      setMedia([]);
      navigation.goBack();
    } catch (err) {
      console.error("Error posting status:", err);
      alert("Something went wrong. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Add Status</Text>
        <TouchableOpacity
          style={{ marginLeft: "auto" }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        value={status}
        onChangeText={setStatus}
        multiline
      />

      {media.length > 0 && (
        <View style={{ marginTop: 10 }}>
          {media.length === 1 ? (
            // Single media fills width
            media[0].type === "image" ? (
              <Image
                source={{ uri: media[0].uri }}
                style={styles.singleMedia}
              />
            ) : (
              <View style={styles.singleVideo}>
                <Ionicons name="play-circle" size={80} color="#fff" />
              </View>
            )
          ) : (
            // Multiple media scroll horizontally
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {media.map((m, index) => (
                <View key={index} style={{ marginRight: 10 }}>
                  {m.type === "image" ? (
                    <Image
                      source={{ uri: m.uri }}
                      style={styles.mediaPreview}
                    />
                  ) : (
                    <View style={styles.videoPreview}>
                      <Ionicons name="play-circle" size={50} color="#fff" />
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeMedia(m.uri)}
                  >
                    <Ionicons name="close-circle" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      <View
        style={{
          flexDirection: "row",
          marginTop: 16,
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity style={styles.actionBtn} onPress={pickMedia}>
          <Ionicons name="image-outline" size={24} color="#2563EB" />
          <Text>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={takeMedia}>
          <Ionicons name="camera-outline" size={24} color="#2563EB" />
          <Text>Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.postBtn,
            { opacity: status || media.length > 0 ? 1 : 0.6 },
          ]}
          onPress={handlePost}
          disabled={uploading || (!status && media.length === 0)}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff" }}>Post</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    minHeight: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  postBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  singleMedia: {
    width: screenWidth - 32,
    height: 250,
    borderRadius: 12,
  },
  singleVideo: {
    width: screenWidth - 32,
    height: 250,
    backgroundColor: "#000",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  mediaPreview: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  videoPreview: {
    width: 120,
    height: 120,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  removeButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
});

export default StatusInput;
