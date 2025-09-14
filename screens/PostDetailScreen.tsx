import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RootStackParamList } from "../types/navigation";
import {
  Ionicons,
  AntDesign,
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import moment from "moment";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";

// ✅ Route and navigation types
type PostDetailRouteProp = RouteProp<RootStackParamList, "PostDetail">;
type PostDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PostDetail"
>;

const { width } = Dimensions.get("window");

const PostDetailScreen = () => {
  const route = useRoute<PostDetailRouteProp>();
  const navigation = useNavigation<PostDetailNavigationProp>();
  const { post } = route.params;

  const [activeIndex, setActiveIndex] = useState(0);

  const handleLike = (id: string) => {
    console.log("Liked", id);
    // Connect your API here
  };

  const handleRetweet = (id: string) => {
    console.log("Retweeted", id);
    // Connect your API here
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userRow}>
          <Image source={{ uri: post?.userImg }} style={styles.userImg} />
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{post.firstName || "Anonymous"}</Text>
            {post?.nickName && (
              <Text style={styles.nickname}>@{post.nickName}</Text>
            )}
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{moment(post.createdAt).fromNow()}</Text>
          </View>
        </View>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#000" />
        </Pressable>
      </View>

      {/* Media */}
      {post.media?.length > 0 && (
        <View>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={styles.mediaScroll}
          >
            {post.media.map((uri: string, index: number) =>
              uri.endsWith(".mp4") ? (
                <View key={index} style={styles.videoPlaceholder}>
                  <Ionicons name="play-circle" size={50} color="#fff" />
                </View>
              ) : (
                <Image
                  key={index}
                  source={{ uri }}
                  style={styles.fullImg}
                  resizeMode="cover"
                />
              )
            )}
          </ScrollView>

          {/* Dots */}
          {post.media.length > 1 && (
            <View style={styles.dotsContainer}>
              {post.media.map((_: string, idx: number) => (
                <View
                  key={idx}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: activeIndex === idx ? "#4caf50" : "#ccc",
                    },
                  ]}
                />
              ))}
            </View>
          )}
        </View>
      )}

      {/* Caption */}
      {post.caption && <Text style={styles.caption}>{post.caption}</Text>}

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.action}
          onPress={() => handleLike(post._id)}
        >
          <AntDesign
            name={post.likes?.includes(post.userId) ? "heart" : "hearto"}
            size={20}
            color={post.likes?.includes(post.userId) ? "red" : "gray"}
          />
          <Text style={styles.actionText}>{post.likes?.length || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.action}
          onPress={() => navigation.navigate("Comments", { post })}
        >
          <Feather name="message-circle" size={20} color="gray" />
          <Text style={styles.actionText}>{post.commentsCount || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.action}
          onPress={() => handleRetweet(post._id)}
        >
          <FontAwesome5
            name="retweet"
            size={20}
            color={post.originalPostId ? "green" : "gray"}
          />
          <Text style={styles.actionText}>{post.retweets?.length || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action}>
          <MaterialCommunityIcons
            name="comment-quote-outline"
            size={20}
            color="gray"
          />
          <Text style={styles.actionText}>{post.rcast || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action}>
          <Feather name="share" size={20} color="gray" />
          <Text style={styles.actionText}>{post.shares || 0}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PostDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // ✅ fix alignment
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#ddd",
  },
  userName: { fontSize: 16, fontWeight: "600", color: "#000" },
  nickname: { fontSize: 13, color: "gray" },
  timeContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: "auto",
  },
  time: { color: "#555", fontSize: 12, fontWeight: "500" },
  mediaScroll: { marginVertical: 10 },
  fullImg: { width, height: 350 },
  videoPlaceholder: {
    width,
    height: 350,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  caption: { fontSize: 16, color: "#333", paddingHorizontal: 15, marginTop: 8 },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  action: { flexDirection: "row", alignItems: "center" },
  actionText: { marginLeft: 6, fontSize: 12, color: "#555" },
});
