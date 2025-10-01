import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Text,
  Image,
  StatusBar,
} from "react-native";
import axios from "axios";
import io, { Socket } from "socket.io-client";
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useUser } from "@clerk/clerk-expo";

import PostItem from "./PostItem";
import HeaderComponent from "./HeaderComponent";
import ListEmptyComponent from "./ListEmptyComponent";
import { Post, RootStackParamList } from "@/types/navigation";
import { useTheme } from "@/context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

const BASE_URL = `http://192.168.100.4:3000`;

type Props = {
  currentLevel: { type: string; value: string | null };
};

const PostScreen: React.FC<Props> = ({ currentLevel }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused(); // ✅ detect screen focus
  const socketRef = useRef<Socket | null>(null);

  const { theme, isDark } = useTheme();
  const { user } = useUser();
  const currentUserId = user?.id ?? "";
  const currentUserNickname = user?.username ?? user?.firstName ?? "User";

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [visiblePostId, setVisiblePostId] = useState<string | null>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setVisiblePostId(viewableItems[0].item._id); // first visible post
    }
  }).current;

  const viewabilityConfig = { itemVisiblePercentThreshold: 80 };

  /** Fetch posts */
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setPosts([]); // clear old posts
      const url = `${BASE_URL}/api/posts?levelType=${currentLevel.type}&levelValue=${currentLevel.value}`;
      const res = await axios.get<Post[]>(url);
      setPosts(res.data ?? []);
    } catch (err) {
      console.error("❌ Error fetching posts:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentLevel]);

  /** Refetch when screen gains focus */
  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );

  /** Socket.io real-time */
  useEffect(() => {
    const socket = io(BASE_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    const room = `level-${currentLevel.type}-${currentLevel.value || "all"}`;
    socket.emit("joinRoom", room);

    socket.on("newPost", (post: Post) => {
      setPosts((prev) => [post, ...prev]);
    });

    return () => {
      socket.emit("leaveRoom", room);
      socket.off("newPost");
      socket.disconnect();
    };
  }, [currentLevel]);

  if (loading && !refreshing) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        }}
      >
        {/* Logo or app icon */}
        <Image
          source={require("@/assets/icon.jpg")}
          style={{ height: 50, width: 50, borderRadius: 25, marginBottom: 12 }}
        />

        {/* Activity loader */}
        <ActivityIndicator size="small" color={theme.text} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Transparent StatusBar */}
      <StatusBar
        translucent
        backgroundColor="transparent" // prevent the warning
        barStyle={isDark ? "light-content" : "dark-content"}
      />

      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <PostItem
            post={item}
            isVisible={visiblePostId === item._id && isFocused} // 👈 true if this post is in view
            currentUserId={currentUserId}
            currentUserNickname={currentUserNickname}
            socket={socketRef.current}
            // handleDeletePost={(postId: any) =>
            //   setPosts((prev) => prev.filter((p) => p._id !== postId))
            // }
          />
        )}
        ListHeaderComponent={<HeaderComponent />}
        ListEmptyComponent={<ListEmptyComponent />}
        contentContainerStyle={{
          paddingBottom: 100,
          backgroundColor: theme.background,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchPosts();
            }}
            tintColor={theme.text} // iOS spinner color
            colors={[theme.text]} // Android spinner color
          />
        }
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </SafeAreaView>
  );
};

export default PostScreen;
