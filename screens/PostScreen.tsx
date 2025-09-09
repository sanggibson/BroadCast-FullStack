import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { useLevel } from "@/context/LevelContext";
import moment from "moment";
import {
  AntDesign,
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation";
import axios from "axios";
import PostOptions from "./postOptions";
import { ActivityIndicator } from "react-native-paper";

// ---------------------- Types ----------------------
type PostScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "PostScreen"
>;
type StatusInputNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "StatusInput"
>;

interface Status {
  _id: string;
  userId: string;
  userName: string;
  media: string[];
  caption?: string;
  createdAt: string;
}

// ---------------------- Constants ----------------------
const { width } = Dimensions.get("window");
const STATUS_RADIUS = 30;
const STATUS_BORDER_WIDTH = 4;

// ---------------------- PostScreen ----------------------
const PostScreen = () => {
  const { currentLevel, userDetails } = useLevel();
  const navigation = useNavigation<PostScreenNavProp>();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------------------- Fetch Posts ----------------------
  const fetchPosts = async () => {
    try {
      let url = "http://192.168.100.4:3000/api/posts";
      if (currentLevel.type !== "home") {
        url += `?levelType=${currentLevel.type}&levelValue=${currentLevel.value}`;
      }
      const res = await axios.get(url);
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPosts();
  }, [currentLevel]);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [currentLevel])
  );

  // Inside PostScreen component
  const handleLike = async (postId: string) => {
    try {
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id !== postId) return post;

          const userId = userDetails?.userId || "tempId";
          const hasLiked = post.likes?.includes(userId);

          return {
            ...post,
            likes: hasLiked
              ? post.likes.filter((id: string) => id !== userId) // Unlike
              : [...(post.likes || []), userId], // Like
          };
        })
      );

      // Send to backend
      await axios.post(`http://192.168.100.4:3000/api/posts/${postId}/like`, {
        userId: userDetails?.userId,
      });
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleRetweet = async (postId: string) => {
    try {
      if (!userDetails?.userId) return;

      const res = await axios.post(
        `http://192.168.100.4:3000/api/posts/${postId}/retweet`,
        {
          userId: userDetails.userId,
          userName: userDetails.firstName || userDetails.nickname,
        }
      );

      // Prepend new retweet to feed
      setPosts((prev) => [res.data, ...prev]);
    } catch (err: any) {
      console.error("Error retweeting post:", err);
      alert(err.response?.data?.message || "Could not retweet");
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await axios.delete(`http://192.168.100.4:3000/api/posts/${postId}`);
      // Remove from local state
      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Could not delete post");
    }
  };

  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  const formattedTitle =
    currentLevel.type === "home"
      ? "Home"
      : `${capitalize(currentLevel.value)} ${capitalize(currentLevel.type)}`;

  // ---------------------- Render Each Post ----------------------
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.postContainer}>
      {/* User Info */}
      <View style={styles.userRow}>
        <Image
          source={{
            uri: userDetails?.userImg || userDetails?.image,
          }}
          style={styles.userImg}
        />
        <View className="flex-col">
          <Text style={styles.userName}>
            {userDetails?.firstName || "Unknown"}
          </Text>
          {userDetails?.nickName && (
            <Text style={styles.nickname}>@{userDetails.nickName}</Text>
          )}
        </View>
        <View
          style={{
            backgroundColor: "#f5f5f5",
            borderRadius: 16,
            paddingHorizontal: 8,
            paddingVertical: 4,
            marginLeft: "auto",
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 3,
            elevation: 1,
          }}
        >
          <Text style={{ color: "#555", fontSize: 12, fontWeight: "500" }}>
            {moment(item.createdAt).fromNow()}
          </Text>
        </View>
        <View>
          <PostOptions
            post={{ ...item, currentUserId: userDetails?.userId }}
            onDelete={(postId) => handleDeletePost(postId)}
          />
        </View>
      </View>

      {/* Media */}
      {item.media?.length > 0 && (
        <ScrollView
          horizontal={item.media.length > 1}
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: 8 }}
        >
          {item.media.map((uri: string, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate("PostDetail", { post: item })}
              style={{
                marginRight: item.media.length > 1 ? 8 : 0,
                width: item.media.length > 1 ? 300 : "100%",
                height: 300,
              }}
            >
              {uri.endsWith(".mp4") ? (
                <View style={styles.videoPlaceholder}>
                  <Ionicons name="play-circle" size={50} color="#fff" />
                </View>
              ) : (
                <Image
                  source={{ uri }}
                  style={styles.postImg}
                  resizeMode="cover"
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      {item.retweetOf && (
        <Text style={{ color: "gray", fontSize: 12, marginBottom: 4 }}>
          Recasted from @{item.retweetOf}
        </Text>
      )}

      {/* Caption */}
      {item.caption && (
        <Text className="font-base" numberOfLines={4} ellipsizeMode="tail">
          {item.caption}
        </Text>
      )}

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.action}
          onPress={() => handleLike(item._id)}
        >
          <AntDesign
            name={
              item.likes?.includes(userDetails?.userId) ? "heart" : "hearto"
            } // heart = filled, hearto = outline
            size={20}
            color={item.likes?.includes(userDetails?.userId) ? "red" : "gray"}
          />
          <Text style={styles.actionText}>{item.likes?.length || ""}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.action}
          onPress={() => navigation.navigate("Comments", { post: item })}
        >
          <Feather name="message-circle" size={20} color="gray" />
          <Text style={styles.actionText}>{item.commentsCount || ""}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.action}
          onPress={() => handleRetweet(item._id)}
        >
          <FontAwesome5
            name="retweet"
            size={20}
            color={item.originalPostId ? "green" : "gray"} // optional: mark already retweeted
          />
          <Text style={styles.actionText}>{item.retweets?.length || ""}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action}>
          <MaterialCommunityIcons
            name="comment-quote-outline"
            size={20}
            color="gray"
          />
          <Text style={styles.actionText}>{item.rcast || ""}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action}>
          <Feather name="share" size={20} color="gray" />
          <Text style={styles.actionText}>{item.shares || ""}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#0000ff" />
        <Text>Loading posts...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListHeaderComponent={<StatusList currentLevel={currentLevel} />}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No casts available for {currentLevel.value}
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

export default PostScreen;

// ---------------------- StatusList Component ----------------------
interface StatusListProps {
  currentLevel: { type: string; value: string };
}

const StatusList: React.FC<StatusListProps> = ({ currentLevel }) => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [seenStatuses, setSeenStatuses] = useState<string[]>([]);
  const navigation = useNavigation<StatusInputNavProp>();

  const fetchStatuses = async () => {
    try {
      let url = "http://192.168.100.4:3000/api/statuses";
      if (currentLevel.type !== "home") {
        url += `?levelType=${currentLevel.type}&levelValue=${currentLevel.value}`;
      }
      const res = await axios.get(url);
      setStatuses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, [currentLevel]);

  useFocusEffect(
    useCallback(() => {
      fetchStatuses();
    }, [currentLevel])
  );

  const groupedStatuses: Record<string, Status[]> = statuses.reduce(
    (acc, status) => {
      if (!acc[status.userId]) acc[status.userId] = [];
      acc[status.userId].push(status);
      return acc;
    },
    {} as Record<string, Status[]>
  );

  Object.keys(groupedStatuses).forEach((userId) => {
    groupedStatuses[userId].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  const formattedTitle =
    currentLevel.type === "home"
      ? "Home"
      : `${capitalize(currentLevel.value)} ${capitalize(currentLevel.type)}`;

  return (
    <View>
      <Text style={styles.statusHeader}>{formattedTitle}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ padding: 5 }}
      >
        {/* Add New Status */}
        <TouchableOpacity
          style={styles.statusWrapper}
          onPress={() => navigation.navigate("StatusInput")}
        >
          <View style={styles.addStatusCircle}>
            <Ionicons name="add" size={28} color="blue" />
          </View>
          <Text style={styles.statusLabel}>Your Story</Text>
        </TouchableOpacity>

        {/* Existing Statuses */}
        {Object.keys(groupedStatuses).map((userId) => {
          const userStatuses = groupedStatuses[userId];
          const isSeen = userStatuses.every((status) =>
            seenStatuses.includes(status._id)
          );

          return (
            <TouchableOpacity
              key={userId}
              style={styles.statusWrapper}
              onPress={() => {
                navigation.navigate("StatusView", { userStatuses });
                const newSeen = userStatuses.map((s) => s._id);
                setSeenStatuses((prev) => [...new Set([...prev, ...newSeen])]);
              }}
            >
              <View
                style={[
                  styles.statusCircle,
                  { borderColor: isSeen ? "gray" : "#27A6F5" },
                ]}
              >
                <Image
                  source={{
                    uri:
                      userStatuses[0].media[0] ||
                      "https://via.placeholder.com/60",
                  }}
                  style={styles.statusImg}
                />
              </View>
              <Text style={styles.statusLabel}>
                {userStatuses[0].userName || "Anonymous"}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

// ---------------------- Styles ----------------------
const styles = StyleSheet.create({
  postContainer: {
    marginVertical: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  userRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  userImg: { width: 40, height: 40, borderRadius: 20 },
  userName: { marginLeft: 10, fontWeight: "bold" },
  nickname: { marginLeft: 5, fontSize: 12, color: "gray" },
  postImg: { width: "100%", height: 300, borderRadius: 10 },
  videoPlaceholder: {
    width: "100%",
    height: 300,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  caption: { padding: 8 },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  action: { flexDirection: "row", alignItems: "center", gap: 5 },
  actionText: { fontSize: 14, fontWeight: "bold" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { padding: 20, alignItems: "center" },
  emptyText: { fontWeight: "bold", fontSize: 18 },
  statusHeader: {
    alignSelf: "center",
    marginTop: 20,
    fontSize: 24,
    fontWeight: "bold",
    padding: 5,
  },
  statusWrapper: { marginRight: 10, alignItems: "center" },
  addStatusCircle: {
    width: STATUS_RADIUS * 2,
    height: STATUS_RADIUS * 2,
    borderRadius: STATUS_RADIUS,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  statusCircle: {
    width: STATUS_RADIUS * 2,
    height: STATUS_RADIUS * 2,
    borderRadius: STATUS_RADIUS,
    borderWidth: STATUS_BORDER_WIDTH,
    borderStyle: "dotted",
    justifyContent: "center",
    alignItems: "center",
  },
  statusImg: {
    width: STATUS_RADIUS * 2 - STATUS_BORDER_WIDTH * 2,
    height: STATUS_RADIUS * 2 - STATUS_BORDER_WIDTH * 2,
    borderRadius: STATUS_RADIUS - STATUS_BORDER_WIDTH,
  },
  statusLabel: { fontSize: 12, fontWeight: "bold", marginTop: 4 },
});
