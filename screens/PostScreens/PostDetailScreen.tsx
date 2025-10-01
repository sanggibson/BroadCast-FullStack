
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RootStackParamList } from "../../types/navigation";
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
import { useTheme } from "@/context/ThemeContext";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";
import { useLevel } from "@/context/LevelContext";
import Video from "react-native-video";

const BASE_URL = "http://192.168.100.4:3000/api";

type PostDetailRouteProp = RouteProp<RootStackParamList, "PostDetail">;

const { width } = Dimensions.get("window");

const PostDetailScreen = () => {
  const route = useRoute<PostDetailRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme, isDark } = useTheme();
  const { user } = useUser();
  const currentUser = { _id: user?.id };
  const { userDetails } = useLevel();

  const [post, setPost] = useState(route.params.post);

  // ----------------- LIKE HANDLER -----------------
  const handleLike = async () => {
    try {
      setPost((prev) => {
        const likes = prev.likes || [];
        const alreadyLiked = likes.includes(currentUser._id);

        return {
          ...prev,
          likes: alreadyLiked
            ? likes.filter((id) => id !== currentUser._id)
            : [...likes, currentUser._id],
        };
      });

      await axios.post(`${BASE_URL}/posts/${post._id}/like`, {
        userId: currentUser._id,
      });
    } catch (err) {
      console.error("Error liking post:", err);
      setPost(post); // rollback
    }
  };

  // ----------------- RETWEET HANDLER -----------------
  const handleRetweet = (id: string) => {
    console.log("Retweeted", id);
  };

  // ----------------- MEDIA GRID -----------------
  const renderMediaGrid = () => {
    if (!post.media || post.media.length === 0) return null;

    return post.media.map((uri: string, index: number) => {
      const isVideo = uri.endsWith(".mp4");

      // Single media
      if (post.media.length === 1) {
        return isVideo ? (
          <Video
            key={index}
            source={{ uri }}
            style={styles.singleMedia}
            resizeMode="cover"
            repeat
            // muted
            controls
          />
        ) : (
          <Image
            key={index}
            source={{ uri }}
            style={styles.singleMedia}
            resizeMode="cover"
          />
        );
      }

      // Multiple media (stacked)
      return isVideo ? (
        <Video
          key={index}
          source={{ uri }}
          style={styles.multiMedia}
          resizeMode="cover"
          repeat
          // muted
          controls
        />
      ) : (
        <Image
          key={index}
          source={{ uri }}
          style={styles.multiMedia}
          resizeMode="cover"
        />
      );
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDark ? "light-content" : "dark-content"}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userRow}>
            <Image
              source={{ uri: userDetails?.image || user?.imageUrl }}
              style={styles.userImg}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.userName, { color: theme.text }]}>
                {user?.firstName}
              </Text>
              {user?.lastName && (
                <Text style={styles.nickname}>@{user?.lastName}</Text>
              )}
            </View>
            <Text style={styles.time}>{moment(post.createdAt).fromNow()}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={26} color={isDark ? "#fff" : "#000"} />
          </TouchableOpacity>
        </View>

        {/* Media Grid */}
        {renderMediaGrid()}

        {/* Caption */}
        {post.caption && (
          <Text style={[styles.caption, { color: theme.text }]}>
            {post.caption}
          </Text>
        )}
      </ScrollView>

      {/* Floating actions */}
      <View style={styles.actionsColumn}>
        <TouchableOpacity style={styles.action} onPress={handleLike}>
          <AntDesign
            name={post.likes?.includes(currentUser._id) ? "heart" : "hearto"}
            size={20}
            color={post.likes?.includes(currentUser._id) ? "red" : "white"}
          />
          <Text style={styles.actionText}>{post.likes?.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.action}
          onPress={() => navigation.navigate("CommentsScreen", { post })}
        >
          <Feather name="message-circle" size={20} color="white" />
          <Text style={styles.actionText}>{post.commentsCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.action}
          onPress={() => handleRetweet(post._id)}
        >
          <FontAwesome5
            name="retweet"
            size={20}
            color={post.originalPostId ? "green" : "white"}
          />
          <Text style={styles.actionText}>{post.retweets?.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action}>
          <MaterialCommunityIcons
            name="comment-quote-outline"
            size={20}
            color="white"
          />
          <Text style={styles.actionText}>{post.rcast}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action}>
          <Feather name="share" size={20} color="white" />
          <Text style={styles.actionText}>{post.shares}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PostDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  userImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
    backgroundColor: "#ddd",
  },
  userName: { fontSize: 16, fontWeight: "600" },
  nickname: { fontSize: 13, color: "gray" },
  time: { fontSize: 12, color: "gray", marginLeft: "auto" },

  caption: {
    fontSize: 16,
    paddingHorizontal: 15,
    marginTop: 10,
    lineHeight: 22,
  },

  singleMedia: { width: "100%", height: 300, borderRadius: 10 },
  multiMedia: { width: "100%", height: 380, marginBottom: 6, borderRadius: 10 },

  actionsColumn: {
    position: "absolute",
    right: 15,
    bottom: 100,
    alignItems: "center",
    backgroundColor: "rgba(128,128,128,0.4)",
    borderRadius: 50,
    padding: 10,
  },
  action: {
    alignItems: "center",
    marginVertical: 15,
  },
  actionText: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
    color: "white",
  },
});

