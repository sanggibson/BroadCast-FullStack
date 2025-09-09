import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { RootStackParamList, Product } from "../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type MarketNavProp = NativeStackNavigationProp<RootStackParamList, "Market">;

const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 3500,
    image: "https://images.unsplash.com/photo-1580894894513-541f1a64d1da?w=600",
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 5200,
    image: "https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=600",
  },
  {
    id: "3",
    name: "Running Shoes",
    price: 4500,
    image: "https://images.unsplash.com/photo-1606813909355-1389a7981c6b?w=600",
  },
  {
    id: "4",
    name: "Backpack",
    price: 2800,
    image: "https://images.unsplash.com/photo-1612817159949-0a1d9d14bcbb?w=600",
  },
];

const MarketScreen = () => {
  const navigation = useNavigation<MarketNavProp>();

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("ProductDetail", { product: item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.price}>KES {item.price}</Text>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="cart" size={20} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View className="flex-row items-center justify-between">
        <Text></Text>
        <Text style={styles.header}>Marketplace</Text>
        <TouchableOpacity
          className="bg-blue-500 rounded-lg px-4 py-2"
          onPress={() => navigation.navigate("Sell")}
        >
          <Text className="font-bold text-xl text-white">Sell</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sampleProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default MarketScreen;

// Styles same as before
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", paddingHorizontal: 12 },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    paddingVertical: 16,
    textAlign: "center",
    color: "#222",
  },
  list: { paddingBottom: 20 },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 8,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    position: "relative",
  },
  image: { height: 120, width: "100%" },
  info: { padding: 10 },
  name: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  price: { fontSize: 14, fontWeight: "bold", color: "#4caf50" },
  addButton: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: "#4caf50",
    borderRadius: 20,
    padding: 6,
  },
});
