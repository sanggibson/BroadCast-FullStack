import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useTheme } from "@/context/ThemeContext";

// Replace with your backend URL
const BASE_URL = "http://192.168.100.4:3000/api/users";

const MembersScreen = ({ currentUserId }: { currentUserId: string }) => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { theme, isDark } = useTheme();
  // Fetch all members
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}`);
      // Mark following state (based on if currentUserId is in their followers)
      const updated = res.data.map((m: any) => ({
        ...m,
        isFollowing: m.followers?.includes(currentUserId),
      }));
      setMembers(updated);
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Follow / Unfollow
  const toggleFollow = async (memberId: string, isFollowing: boolean) => {
    try {
      const endpoint = `${BASE_URL}/${currentUserId}/${
        isFollowing ? "unfollow" : "follow"
      }/${memberId}`;
      await axios.post(endpoint);

      setMembers((prev) =>
        prev.map((m) =>
          m._id === memberId ? { ...m, isFollowing: !isFollowing } : m
        )
      );
    } catch (err) {
      console.error("Error updating follow state:", err);
    }
  };

  const renderMember = ({ item }: any) => (
    <View style={styles.memberCard}>
      {/* Left side: avatar + info */}
      <View style={styles.userInfo}>
        <Image source={{ uri: item.image }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={styles.username}>@{item.nickName}</Text>
        </View>
      </View>

      {/* Right side: Follow/Unfollow button */}
      <TouchableOpacity
        style={[
          styles.button,
          item.isFollowing ? styles.unfollowBtn : styles.followBtn,
        ]}
        onPress={() => toggleFollow(item._id, item.isFollowing)}
      >
        <Text
          style={item.isFollowing ? styles.unfollowText : styles.followText}
        >
          {item.isFollowing ? "Unfollow" : "Follow"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Transparent StatusBar */}
      <StatusBar
        translucent
        backgroundColor="transparent" // prevent the warning
        barStyle={isDark ? "light-content" : "dark-content"}
      />
      <Text style={[styles.title, {color: theme.text}]}>Members ({members.length})</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1DA1F2" />
      ) : (
        <FlatList
          data={members}
          renderItem={renderMember}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 20 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
    </SafeAreaView>
  );
};

export default MembersScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa", padding: 16 },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  userInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  name: { fontSize: 16, fontWeight: "600", color: "#111" },
  username: { fontSize: 14, color: "#666", marginTop: 2 },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  followBtn: { borderColor: "#1DA1F2", backgroundColor: "#1DA1F2" },
  unfollowBtn: { borderColor: "#ccc", backgroundColor: "#fff" },
  followText: { color: "#fff", fontWeight: "600" },
  unfollowText: { color: "#333", fontWeight: "600" },
});
