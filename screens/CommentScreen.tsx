import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { useLevel } from "@/context/LevelContext";
import moment from "moment";

interface Comment {
  _id: string;
  postId?: string;
  userId: string;
  userName: string;
  text: string;
  likes: string[];
  createdAt: string;
  replies?: Comment[];
}

const CommentsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { post } = route.params;
  const { userDetails, currentLevel } = useLevel();

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `http://192.168.100.4:3000/api/comments/${post._id}`
      );
      setComments(res.data);
    } catch (err: any) {
      console.error(
        "Error fetching comments:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Reply to a comment
  const handleReply = (comment: Comment) => {
    setReplyingTo(comment);
    setNewComment(`@${comment.userName} `);
  };

  // Send a new comment or reply
  const handleSend = async () => {
    if (!newComment.trim()) return;
    if (!userDetails?.clerkId || !userDetails?.firstName) {
      console.error("User not logged in or missing info", userDetails);
      return;
    }

    setSending(true);
    try {
      if (replyingTo) {
        // Sending a reply
        const res = await axios.post(
          `http://192.168.100.4:3000/api/comments/${replyingTo._id}/reply`,
          {
            userId: userDetails.clerkId,
            userName: userDetails.firstName,
            text: newComment.trim(),
          }
        );

        // Update parent comment replies
        setComments((prev) =>
          prev.map((c) =>
            c._id === replyingTo._id
              ? { ...c, replies: [...(c.replies || []), res.data] }
              : c
          )
        );

        setReplyingTo(null);
      } else {
        // Top-level comment
        const res = await axios.post(`http://192.168.100.4:3000/api/comments`, {
          postId: post._id,
          userId: userDetails.clerkId,
          userName: userDetails.firstName,
          text: newComment.trim(),
        });
        setComments((prev) => [res.data, ...prev]);
      }

      setNewComment("");
    } catch (err: any) {
      console.error("Error saving comment:", err.response?.data || err.message);
    } finally {
      setSending(false);
    }
  };

  // Like a comment or reply
  const toggleLike = async (comment: Comment) => {
    try {
      const res = await axios.post(
        `http://192.168.100.4:3000/api/comments/${comment._id}/like`,
        { userId: userDetails.clerkId }
      );

      // Update comment or reply
      setComments((prev) =>
        prev.map((c) =>
          c._id === comment._id
            ? res.data
            : {
                ...c,
                replies: c.replies?.map((r) =>
                  r._id === comment._id ? res.data : r
                ),
              }
        )
      );
    } catch (err: any) {
      console.error("Error liking comment:", err.response?.data || err.message);
    }
  };

  // Delete
  const confirmDelete = (commentId: string) => {
    setCommentToDelete(commentId);
    setDeleteModalVisible(true);
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    try {
      await axios.delete(
        `http://192.168.100.4:3000/api/comments/${commentToDelete}`
      );

      setComments((prev) =>
        prev
          .map((c) => ({
            ...c,
            replies: c.replies?.filter((r) => r._id !== commentToDelete),
          }))
          .filter((c) => c._id !== commentToDelete)
      );

      setDeleteModalVisible(false);
      setCommentToDelete(null);
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  // Swipe actions
  const renderRightActions = (comment: Comment) => (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity
        style={{
          // backgroundColor: "#1E90FF",
          justifyContent: "center",
          alignItems: "center",
          width: 80,
          marginVertical: 5,
          borderRadius: 8,
        }}
        onPress={() => handleReply(comment)}
      >
        <Text style={{ color: "blue", fontWeight: "bold" }}>Reply</Text>
      </TouchableOpacity>

      {comment.userId === userDetails.clerkId && (
        <TouchableOpacity
          style={{
            // backgroundColor: "#FF3B30",
            justifyContent: "center",
            alignItems: "center",
            width: 80,
            marginVertical: 5,
            borderRadius: 8,
            marginLeft: 5,
          }}
          onPress={() => confirmDelete(comment._id)}
        >
          <Text style={{ color: "red", fontWeight: "bold" }}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Render comment with replies
  const renderItem = ({ item }: { item: Comment }) => {
    const likedByUser = item.likes.includes(userDetails?.clerkId || "");

    const handleLongPress = () => {
      // Only show options if user is the owner or reply option
      setCommentToDelete(item._id);
      setDeleteModalVisible(true); // Reuse modal for options
      // You can add a "Reply" option inside the modal
    };

    return (
      <View>
        <TouchableOpacity onLongPress={handleLongPress} delayLongPress={300}>
          <View style={styles.commentRow}>
            <Text style={styles.commentUser}>{item.userName}: </Text>
            <Text>{item.text}</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <TouchableOpacity onPress={() => toggleLike(item)}>
                <Ionicons
                  name={likedByUser ? "heart" : "heart-outline"}
                  size={20}
                  color="red"
                />
              </TouchableOpacity>
              <Text style={{ marginLeft: 5 }}>{item.likes.length}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Render replies */}
        {item.replies?.map((reply) => {
          const likedByUser = reply.likes.includes(userDetails?.clerkId || "");
          return (
            <TouchableOpacity
              key={reply._id}
              onLongPress={() => {
                setCommentToDelete(reply._id);
                setDeleteModalVisible(true);
              }}
              delayLongPress={300}
            >
              <View style={[styles.commentRow, { marginLeft: 20 }]}>
                <Text style={styles.commentUser}>{reply.userName}: </Text>
                <Text
                  className="text-red-600"
                  style={{ width: 300 }}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {reply.text}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 4,
                  }}
                >
                  <TouchableOpacity onPress={() => toggleLike(reply)}>
                    <Ionicons
                      name={likedByUser ? "heart" : "heart-outline"}
                      size={20}
                      color="red"
                    />
                  </TouchableOpacity>
                  <Text style={{ marginLeft: 5 }}>{reply.likes.length}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        {/* Post header */}
        <View style={styles.postHeader}>
          <Image source={{ uri: post.userImg }} style={styles.userImg} />
          <View className="ml-2 flex-row items-center gap-3">
            <View>
              <Text style={{ fontWeight: "bold" }}>{post.firstName}</Text>
              <Text className="text-sm text-gray-400">@{post.nickName}</Text>
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
                {moment(post.createdAt).fromNow()}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginLeft: "auto" }}
          >
            <Ionicons name="close" size={28} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Post media */}
        {post.media &&
          post.media.length > 0 &&
          (post.media.length === 1 ? (
            // Single image - full width
            <Image
              source={{ uri: post.media[0] }}
              style={{
                width: "100%", // full width
                height: 300,
                borderRadius: 12,
                marginVertical: 10,
              }}
              resizeMode="cover"
            />
          ) : (
            // Multiple images - horizontal scroll
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={post.media}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={{
                    width: 300,
                    height: 300,
                    margin: 10,
                    borderRadius: 12,
                  }}
                  resizeMode="cover"
                />
              )}
            />
          ))}

        {post.caption && <Text style={styles.postCaption}>{post.caption}</Text>}

        <Text style={styles.commentsTitle}>Comments ({comments.length})</Text>

        <FlatList
          data={comments}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={() =>
            !loading ? (
              <View style={{ padding: 20, alignItems: "center" }}>
                <Text className="font-bold text-2xl">
                  No comments available for {currentLevel?.value}
                </Text>
              </View>
            ) : null
          }
        />

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            placeholder="Add a comment..."
            style={styles.input}
            value={newComment}
            onChangeText={setNewComment}
            editable={!sending}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={sending}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              {sending ? "Sending..." : "Send"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Delete modal */}
        <Modal
          visible={deleteModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={{ fontSize: 16, marginBottom: 20 }}>
                Choose an action
              </Text>
              <View
                style={{ flexDirection: "row", justifyContent: "flex-end" }}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (commentToDelete) {
                      const comment =
                        comments.find((c) => c._id === commentToDelete) ||
                        comments
                          .flatMap((c) => c.replies || [])
                          .find((r) => r._id === commentToDelete);
                      if (comment) handleReply(comment);
                    }
                    setDeleteModalVisible(false);
                  }}
                  style={{ marginRight: 10 }}
                >
                  <Text style={{ color: "#1E90FF", fontWeight: "bold" }}>
                    Reply
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDeleteComment}>
                  <Text style={{ color: "#FF3B30", fontWeight: "bold" }}>
                    Delete
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setDeleteModalVisible(false)}
                  style={{ marginLeft: 10 }}
                >
                  <Text style={{ color: "#999" }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  postHeader: { flexDirection: "row", alignItems: "center", padding: 10 },
  userImg: { width: 40, height: 40, borderRadius: 20 },
  userName: { marginLeft: 10, fontWeight: "bold", fontSize: 16 },
  postImg: { width: 300, height: 300, marginVertical: 10, borderRadius: 12 },
  postCaption: { paddingHorizontal: 10, marginBottom: 10 },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  commentUser: { fontWeight: "bold", marginRight: 5 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#1F2937",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
});

export default CommentsScreen;
