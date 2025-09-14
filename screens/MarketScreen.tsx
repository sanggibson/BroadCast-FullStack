import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { RootStackParamList, Product } from "../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";

type MarketNavProp = NativeStackNavigationProp<RootStackParamList, "Market">;

const MarketScreen = () => {
  const navigation = useNavigation<MarketNavProp>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
     const res = await axios.get<Product[]>(
       "http://192.168.100.4:3000/api/products"
     );
     setProducts(res.data);

      // Extract unique categories from products
    const uniqueCategories = Array.from(
      new Set(res.data.map((p) => p.category))
    );
    setCategories(uniqueCategories);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  // Filter products based on selected category
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  // Filter categories based on search input
  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("ProductDetail", { product: item })}
    >
      <Image source={{ uri: item.images[0] }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.price}>
          KES {Number(item.price).toLocaleString("en-KE")}
        </Text>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="cart" size={20} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#4caf50"
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        />
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              {/* Header */}
              <View style={styles.headerRow}>
                <Text></Text>
                <Text style={styles.header}>Marketplace</Text>
                <TouchableOpacity
                  style={styles.sellButton}
                  onPress={() => navigation.navigate("Sell")}
                >
                  <Text style={styles.sellText}>Sell</Text>
                </TouchableOpacity>
              </View>

              {/* Category Search */}
              <View style={styles.categorySearchContainer}>
                <Ionicons name="search" size={20} color="gray" />
                <TextInput
                  placeholder="Search categories..."
                  value={categorySearch}
                  onChangeText={setCategorySearch}
                  style={styles.categorySearchInput}
                />
                {categorySearch ? (
                  <Ionicons
                    name="close"
                    size={20}
                    color="gray"
                    onPress={() => setCategorySearch("")}
                  />
                ) : null}
              </View>

              {/* Categories */}
              {filteredCategories.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginVertical: 10 }}
                  contentContainerStyle={{ paddingHorizontal: 4 }}
                >
                  {/* All category */}
                  <TouchableOpacity
                    style={[
                      styles.categoryButton,
                      selectedCategory === null && styles.categorySelected,
                    ]}
                    onPress={() => setSelectedCategory(null)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        selectedCategory === null &&
                          styles.categoryTextSelected,
                      ]}
                    >
                      All
                    </Text>
                  </TouchableOpacity>

                  {filteredCategories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryButton,
                        selectedCategory === cat && styles.categorySelected,
                      ]}
                      onPress={() =>
                        setSelectedCategory(
                          cat === selectedCategory ? null : cat
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          selectedCategory === cat &&
                            styles.categoryTextSelected,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          }
          ListEmptyComponent={
            <Text
              style={{
                textAlign: "center",
                color: "#888",
                marginTop: 50,
                fontSize: 16,
              }}
            >
              No products available.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default MarketScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", paddingHorizontal: 12 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#222",
  },
  sellButton: {
    backgroundColor: "#4caf50",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  sellText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
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
  categoryButton: {
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  categorySelected: { backgroundColor: "#4caf50" },
  categoryText: { color: "#333", fontWeight: "500" },
  categoryTextSelected: { color: "#fff" },
  categorySearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 8,
    marginHorizontal: 4,
  },
  categorySearchInput: {
    flex: 1,
    paddingHorizontal: 8,
    height: 36,
  },
});
