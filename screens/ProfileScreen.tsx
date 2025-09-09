import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation";
import { useLevel } from "@/context/LevelContext";

const { width } = Dimensions.get("window");

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "EditProfile"
>;

// Dummy Data
const userPosts = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1580894894513-541f1a64d1da?w=600",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=600",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1606813909355-1389a7981c6b?w=600",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1612817159949-0a1d9d14bcbb?w=600",
  },
];

const followersData = [
  {
    id: "1",
    name: "Alice",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: "2",
    name: "Bob",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: "3",
    name: "Charlie",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
];

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { userDetails } = useLevel();
  const [tab, setTab] = useState<"Posts" | "Followers" | "Following">("Posts");
  const [followers, setFollowers] = useState(followersData);
  const [followingIds, setFollowingIds] = useState<string[]>(["2"]); // currently following Bob

  const toggleFollow = (userId: string) => {
    if (followingIds.includes(userId)) {
      setFollowingIds(followingIds.filter((id) => id !== userId));
    } else {
      setFollowingIds([...followingIds, userId]);
    }
  };

  const renderPost = ({ item }: { item: (typeof userPosts)[0] }) => (
    <View style={styles.postCard}>
      <Image source={{ uri: item.image }} style={styles.postImage} />
    </View>
  );

  const renderFollower = ({ item }: { item: (typeof followers)[0] }) => {
    const isFollowing = followingIds.includes(item.id);

    return (
      <View style={styles.followerCard}>
        <Image source={{ uri: item.avatar }} style={styles.followerAvatar} />
        <Text style={styles.followerName}>{item.name}</Text>
        <TouchableOpacity
          style={[
            styles.followButton,
            {
              backgroundColor: isFollowing ? "#fff" : "#4caf50",
              borderWidth: isFollowing ? 1 : 0,
            },
          ]}
          onPress={() => toggleFollow(item.id)}
        >
          <Text
            style={{
              color: isFollowing ? "#4caf50" : "#fff",
              fontWeight: "bold",
            }}
          >
            {isFollowing ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text></Text>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}>
          <Ionicons name="settings-outline" size={24} color="#222" />
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <View className="items-center mt-4 mb-2 flex-row px-4 space-x-6 justify-center">
        <Image source={{ uri: userDetails?.image }} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{userDetails?.firstName}</Text>
        <Text style={styles.bio}>@{userDetails?.nickName}</Text>
        </View>
        
      </View>
      <View className="items-center border border-gray-300 rounded-lg px-4 py-1 self-center mb-4 bg-gray-400 shadow-sm">
        <Text className="text-lg font-bold text-white">Edit</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <TouchableOpacity
          style={styles.statBox}
          onPress={() => setTab("Posts")}
        >
          <Text style={styles.statNumber}>{userPosts.length}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.statBox}
          onPress={() => setTab("Followers")}
        >
          <Text style={styles.statNumber}>{followers.length}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.statBox}
          onPress={() => setTab("Following")}
        >
          <Text style={styles.statNumber}>{followingIds.length}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </TouchableOpacity>
      </View>

      {/* Active Tab Indicator */}
      <View style={styles.tabIndicatorRow}>
        {["Posts", "Followers", "Following"].map((t) => (
          <View
            key={t}
            style={[
              styles.tabIndicator,
              { backgroundColor: tab === t ? "#4caf50" : "transparent" },
            ]}
          />
        ))}
      </View>

      {/* Conditional Content */}
      {tab === "Posts" && (
        <FlatList
          data={userPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      )}

      {tab === "Followers" && (
        <FlatList
          data={followers}
          renderItem={renderFollower}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      )}

      {tab === "Following" && (
        <FlatList
          data={followers.filter((f) => followingIds.includes(f.id))}
          renderItem={renderFollower}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center" },
  avatar: { width: 80, height: 80, borderRadius: 50, marginBottom: 8 },
  name: { fontSize: 20, fontWeight: "bold", color: "#222" },
  bio: { fontSize: 14, color: "#666", textAlign: "center", marginTop: 4 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  statBox: { alignItems: "center" },
  statNumber: { fontSize: 18, fontWeight: "bold", color: "#222" },
  statLabel: { fontSize: 13, color: "#666", fontWeight: "600" },
  tabIndicatorRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  tabIndicator: { width: 60, height: 3, borderRadius: 2, marginHorizontal: 2 },
  postCard: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
  },
  postImage: { width: (width - 48) / 2, height: 140, borderRadius: 12 },
  followerCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  followerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  followerName: { fontSize: 16, color: "#222", flex: 1 },
  followButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});
