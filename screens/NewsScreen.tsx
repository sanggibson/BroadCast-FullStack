import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import axios from "axios";

const { width } = Dimensions.get("window");

interface NewsItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  publishedAt: string;
}

const NewsScreen = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get("http://192.168.100.4:3000/api/news");
        setNews(res.data);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const renderItem = ({ item }: { item: NewsItem }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>
          {item.description.length > 100
            ? item.description.slice(0, 100) + "..."
            : item.description}
        </Text>
        <Text style={styles.time}>
          {new Date(item.publishedAt).toLocaleDateString()}{" "}
          {new Date(item.publishedAt).toLocaleTimeString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Latest News</Text>
      <FlatList
        data={news}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default NewsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", paddingHorizontal: 12 },
  header: { fontSize: 24, fontWeight: "bold", marginVertical: 16 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    elevation: 2,
  },
  image: { width: width - 24, height: 180 },
  textContainer: { padding: 12 },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  description: { fontSize: 14, color: "#666", marginBottom: 6 },
  time: { fontSize: 12, color: "#999" },
});
