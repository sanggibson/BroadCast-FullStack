import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons, AntDesign, Feather } from "@expo/vector-icons";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";
import { useLevel } from "@/context/LevelContext";
import { useTheme } from "@/context/ThemeContext";

const API_URL = `http://192.168.100.4:3000/api/comments`;

// helper → format date into "mins ago"
const timeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
};

export default function CommentsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { post } = route.params;

  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const { user } = useUser();
  const [activeIndex, setActiveIndex] = useState(0);
  const { userDetails } = useLevel();
  const flatListRef = useRef<FlatList>(null);
  const { theme, isDark } = useTheme();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/${post._id}`);
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      await axios.post(API_URL, {
        postId: post._id,
        userId: user?.id,
        userName: user?.lastName,
        text: commentText,
      });
      setCommentText("");
      await fetchComments();

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      await axios.post(`${API_URL}/${commentId}/like`, {
        userId: user?.id,
      });
      fetchComments();
    } catch (err) {
      console.error("Error liking comment:", err);
    }
  };

  const handleLikeReply = async (commentId: string, replyIndex: number) => {
    try {
      await axios.post(`${API_URL}/${commentId}/replies/${replyIndex}/like`, {
        userId: user?.id,
      });
      fetchComments();
    } catch (err) {
      console.error("Error liking reply:", err);
    }
  };

  const handleAddReply = async () => {
    if (!replyText.trim() || !replyingTo) return;
    try {
      await axios.post(`${API_URL}/${replyingTo._id}/reply`, {
        userId: user?.id,
        userName: user?.lastName,
        text: replyText,
      });
      setReplyText("");
      setReplyingTo(null);
      setReplyModalVisible(false);
      fetchComments();
    } catch (err) {
      console.error("Error adding reply:", err);
    }
  };

  const renderReplies = (replies: any[], parentId: string) =>
    replies.map((reply, index) => (
      <View key={index} style={{ marginLeft: 20, marginTop: 8, padding: 6 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{
              uri:
                userDetails?.image && userDetails.image.trim() !== ""
                  ? userDetails.image
                  : user?.imageUrl || "",
            }}
            style={{ height: 30, width: 30, borderRadius: 50, marginRight: 8 }}
          />
          <Text
            style={{ fontWeight: "bold", fontSize: 14, color: theme.subtext }}
          >
            {reply.userName}
          </Text>
        </View>

        <Text style={{ marginTop: 4, fontSize: 14, color: theme.subtext }}>
          {reply.text}
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            marginTop: 6,
          }}
        >
          <Text style={{ fontSize: 12, color: "gray", marginRight: 12 }}>
            {timeAgo(reply.createdAt)}
          </Text>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => handleLikeReply(parentId, index)}
          >
            <AntDesign
              name="heart"
              size={14}
              color={reply.likes.includes(user?.id) ? "red" : "gray"}
            />
            <Text style={{ fontSize: 12, marginLeft: 4, color: "gray" }}>
              {reply.likes.length}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    ));

  const renderItem = ({ item }: any) => (
    <View style={styles.commentBox}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Image
            source={{
              uri:
                userDetails?.image && userDetails.image.trim() !== ""
                  ? userDetails.image
                  : user?.imageUrl || "",
            }}
            style={{ height: 30, width: 30, borderRadius: 20 }}
          />
          <Text style={{ fontWeight: "bold", color: theme.text }}>
            {item.userName}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Ionicons name="time-outline" size={14} color="gray" />
          <Text style={styles.timeText}>{timeAgo(item.createdAt)}</Text>
        </View>
      </View>

      <Text style={[styles.commentText, { color: theme.subtext }]}>
        {item.text}
      </Text>

      <View style={styles.commentActions}>
        <TouchableOpacity
          style={styles.likeBtn}
          onPress={() => handleLikeComment(item._id)}
        >
          <AntDesign
            name="heart"
            size={16}
            color={item.likes.includes(user?.id) ? "red" : "gray"}
          />
          <Text style={styles.likeCount}>{item.likes.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setReplyingTo(item);
            setReplyModalVisible(true);
          }}
        >
          <Text style={styles.replyBtn}>Reply</Text>
        </TouchableOpacity>
      </View>

      {item.replies && renderReplies(item.replies, item._id)}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDark ? "light-content" : "dark-content"}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Comments ({comments.length})
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Post preview */}
        <View style={{ padding: 6, borderBottomColor: "#eee" }}>
          {post.media?.length > 0 && (
            <>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={styles.mediaScroll}
                onScroll={(e) => {
                  const slide = Math.round(
                    e.nativeEvent.contentOffset.x /
                      (Dimensions.get("window").width - 30)
                  );
                  setActiveIndex(slide);
                }}
                scrollEventThrottle={16}
              >
                {post.media.map((uri: string, idx: number) =>
                  uri.endsWith(".mp4") ? (
                    <View key={idx} style={styles.videoPlaceholder}>
                      <Ionicons name="play-circle" size={50} color="#fff" />
                    </View>
                  ) : (
                    <Image
                      key={idx}
                      source={{ uri }}
                      style={styles.scrollImage}
                      resizeMode="cover"
                    />
                  )
                )}
              </ScrollView>

              <View style={styles.pagination}>
                {post.media.map((_: string, i: number) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      { opacity: i === activeIndex ? 1 : 0.3 },
                    ]}
                  />
                ))}
              </View>
            </>
          )}

          <Text style={styles.postCaption}>{post.caption}</Text>
          <Text style={styles.postUser}>@{post.user?.nickName}</Text>
        </View>

        {/* Comments list */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="gray"
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            ref={flatListRef}
            data={comments}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No comments yet</Text>
            }
          />
        )}

        {/* Add comment */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 8,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: "#eee",
            backgroundColor: theme.background,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              borderWidth: 1,
              borderColor: theme.subtext,
              borderRadius: 20,
              paddingHorizontal: 10,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                paddingVertical: 6,
                color: theme.text,
              }}
              placeholder="Add a comment..."
              value={commentText}
              onChangeText={setCommentText}
              placeholderTextColor={theme.subtext}
            />
            <TouchableOpacity onPress={handleAddComment}>
              <Feather name="send" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Reply Modal */}
      <Modal
        visible={replyModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setReplyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.subtext }]}>
              Replying to {replyingTo?.userName}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Write a reply..."
              value={replyText}
              onChangeText={setReplyText}
              placeholderTextColor={theme.subtext}
              numberOfLines={10}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setReplyModalVisible(false)}>
                <Text style={{ color: "red" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddReply}>
                <Text style={{ color: "blue" }}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 16, fontWeight: "bold" },
  postCaption: { fontSize: 14, marginBottom: 4 },
  postUser: { fontSize: 12, color: "gray" },
  commentBox: { padding: 10 },
  commentText: { marginVertical: 2 },
  commentActions: { flexDirection: "row", alignItems: "center", gap: 12 },
  timeText: { fontSize: 12, color: "gray" },
  likeBtn: { flexDirection: "row", alignItems: "center" },
  likeCount: { fontSize: 12, marginLeft: 4, color: "gray" },
  replyBtn: { fontSize: 13, color: "blue" },
  inputcomment: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 10,
    padding: 6,
  },
  sendBtn: { marginLeft: 8, color: "blue", fontWeight: "bold" },
  emptyText: { textAlign: "center", marginTop: 20, color: "gray" },
  mediaScroll: { marginBottom: 6 },
  scrollImage: {
    width: Dimensions.get("window").width - 30,
    height: 300,
    borderRadius: 8,
    marginRight: 10,
  },
  videoPlaceholder: {
    width: Dimensions.get("window").width - 30,
    height: 300,
    borderRadius: 8,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#333",
    marginHorizontal: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    minHeight: 250,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
});
