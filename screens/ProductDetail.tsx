import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { RootStackParamList } from "../types/navigation";
import { Ionicons } from "@expo/vector-icons";

type ProductDetailRoute = RouteProp<RootStackParamList, "ProductDetail">;

const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailRoute>();
  const { product } = route.params;
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View className="flex-row items-center mb-4">
        <View style={{ width: 40 }} />

        <Text style={styles.name}>{product.name}</Text>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="ml-auto p-2"
        >
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>
      </View>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.price}>KES {product.price}</Text>
      <TouchableOpacity style={styles.buyButton}>
        <Text style={styles.buyText}>Add to Cart</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  image: { width: "100%", height: 300, borderRadius: 12, marginBottom: 16 },
  name: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  price: { fontSize: 18, color: "#4caf50", marginBottom: 16 },
  buyButton: {
    backgroundColor: "#4caf50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buyText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
