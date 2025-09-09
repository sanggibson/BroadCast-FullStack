import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useLevel } from "@/context/LevelContext"; // 👈 make sure this matches your context path
import { Feather } from "@expo/vector-icons";

// Mock trend data by level
const trendsByLevel: Record<string, any[]> = {
  Beginner: [
    {
      id: "1",
      title: "Intro to React Native",
      mentions: "12.3K",
      category: "Development",
    },
    {
      id: "2",
      title: "UI Design Basics",
      mentions: "9.4K",
      category: "Design",
    },
    { id: "3", title: "Expo vs CLI", mentions: "7.8K", category: "Tech" },
  ],
  Intermediate: [
    {
      id: "4",
      title: "State Management Wars",
      mentions: "18.2K",
      category: "Development",
    },
    {
      id: "5",
      title: "Dark Mode UI Kits",
      mentions: "15.6K",
      category: "Design",
    },
    {
      id: "6",
      title: "APIs in Production",
      mentions: "13.1K",
      category: "Tech",
    },
  ],
  Pro: [
    {
      id: "7",
      title: "AI x Mobile Apps",
      mentions: "25.4K",
      category: "Innovation",
    },
    {
      id: "8",
      title: "Scaling React Native",
      mentions: "21.9K",
      category: "Development",
    },
    {
      id: "9",
      title: "Design Systems 2.0",
      mentions: "19.7K",
      category: "Design",
    },
  ],
};

const TrendScreen = () => {
  const { currentLevel } = useLevel(); // 👈 get current user level
  const trends = trendsByLevel[currentLevel.value] || [];

  const renderTrend = ({ item }: any) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.category}>{item.category}</Text>
        <Feather name="more-horizontal" size={18} color="#888" />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.mentions}>{item.mentions} mentions</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "700",
          marginBottom: 16,
          color: "#111",
          textAlign: "center",
        marginTop: 15}}
      >
        Trending for {currentLevel?.value}
      </Text>
      <FlatList
        data={trends}
        renderItem={renderTrend}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default TrendScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  category: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1DA1F2",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
  },
  mentions: {
    fontSize: 13,
    color: "#666",
  },
});
