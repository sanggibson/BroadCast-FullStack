import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import type { RootStackParamList, Post } from "../types/navigation";
import { Ionicons } from "@expo/vector-icons";

type PostDetailRoute = RouteProp<RootStackParamList, "PostDetail">;

const PostDetailScreen = () => {
  const route = useRoute<PostDetailRoute>();
  const navigation = useNavigation();
  const { post } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.userName}>{post.userName || "Anonymous"}</Text>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityLabel="Close post"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={28} color="#000" />
        </Pressable>
      </View>

      {/* Media */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.mediaScroll}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        {post.media.map((uri, index) =>
          uri.endsWith(".mp4") ? (
            <View key={index} style={styles.videoPlaceholder}>
              <Ionicons name="play-circle" size={50} color="#fff" />
            </View>
          ) : (
            <Image
              key={index}
              source={{ uri }}
              style={styles.postImg}
              resizeMode="cover"
            />
          )
        )}
      </ScrollView>

      {/* Caption */}
      {post.caption && (
        <Text style={styles.caption} numberOfLines={5} ellipsizeMode="tail">
          {post.caption}
        </Text>
      )}
    </SafeAreaView>
  );
};

export default PostDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  mediaScroll: {
    marginVertical: 10,
  },
  postImg: {
    width: 300,
    height: 300,
    borderRadius: 12,
    marginRight: 10,
  },
  videoPlaceholder: {
    width: 300,
    height: 300,
    borderRadius: 12,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  caption: {
    fontSize: 16,
    color: "#333",
    paddingHorizontal: 15,
    marginTop: 10,
  },
});

