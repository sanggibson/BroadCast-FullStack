import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

// Sample data
const initialMembers = [
  {
    id: "1",
    name: "Alice Johnson",
    username: "@alice",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    isFollowing: false,
  },
  {
    id: "2",
    name: "David Kim",
    username: "@david",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    isFollowing: true,
  },
  {
    id: "3",
    name: "Sophia Lee",
    username: "@sophia",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    isFollowing: false,
  },
];

const MembersScreen = () => {
  const [members, setMembers] = useState(initialMembers);

  const toggleFollow = (id: string) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === id
          ? { ...member, isFollowing: !member.isFollowing }
          : member
      )
    );
  };

  const renderMember = ({ item }: any) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 14,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      {/* Left side: avatar + text */}
      <View style={styles.userInfo}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.username}>{item.username}</Text>
        </View>
      </View>

      {/* Right side: button */}
      <TouchableOpacity
        style={[
          styles.button,
          item.isFollowing ? styles.unfollowBtn : styles.followBtn,
        ]}
        onPress={() => toggleFollow(item.id)}
      >
        <Text
          style={[item.isFollowing ? styles.unfollowText : styles.followText]}
        >
          {item.isFollowing ? "Unfollow" : "Follow"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text className="text-xl text-center font-bold mb-15">
        Members ({members?.length})
      </Text>
      <FlatList
        data={members}
        renderItem={renderMember}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </SafeAreaView>
  );
};

export default MembersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    padding: 16,
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  username: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  followBtn: {
    borderColor: "#1DA1F2",
    backgroundColor: "#1DA1F2",
  },
  unfollowBtn: {
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  followText: {
    color: "#fff",
    fontWeight: "600",
  },
  unfollowText: {
    color: "#333",
    fontWeight: "600",
  },
});
