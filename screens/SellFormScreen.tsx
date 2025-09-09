import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

const SellFormScreen = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  // const [error, setError] = useState("");

  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]); // store multiple images
  const navigation = useNavigation();

   const [titleError, setTitleError] = useState("");
   const [priceError, setPriceError] = useState("");
   const [descriptionError, setDescriptionError] = useState("");
   const [imagesError, setImagesError] = useState("");

  // Pick image(s) from gallery
  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      // map assets to uri array
      const uris = result.assets.map((asset) => asset.uri);
      setImages(uris);
      setImagesError("");
    }
  };

 const handleSubmit = () => {
   let hasError = false;

   if (!title) {
     setTitleError("Product name is required");
     hasError = true;
   } else {
     setTitleError("");
   }

   if (!price) {
     setPriceError("Price is required");
     hasError = true;
   } else {
     setPriceError("");
   }

   if (!description) {
     setDescriptionError("Description is required");
     hasError = true;
   } else {
     setDescriptionError("");
   }

   if (images.length === 0) {
     setImagesError("At least one image is required");
     hasError = true;
   } else {
     setImagesError("");
   }

   if (hasError) return;

   const newProduct = {
     id: Date.now().toString(),
     title,
     price,
     description,
     images,
   };

   console.log("Product submitted:", newProduct);

   // Reset form
   setTitle("");
   setPrice("");
   setDescription("");
   setImages([]);
   alert("Your product has been listed!");
 };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.form}>
        {/* Header */}
        <View className="flex-row items-center justify-between relative">
          <View style={{ width: 40 }} />
          <Text className="absolute left-0 right-0 text-2xl font-bold text-center">
            Sell Your Product
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Ionicons name="close" size={28} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <Text style={styles.label}>Product Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product name"
          value={title}
          onChangeText={setTitle}
        />
        {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}

        <Text style={styles.label}>Price (KES)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter price"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
        {priceError ? <Text style={styles.errorText}>{priceError}</Text> : null}

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter product description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
        {descriptionError ? (
          <Text style={styles.errorText}>{descriptionError}</Text>
        ) : null}

        {/* Image Upload */}
        <Text style={styles.label}>Product Images</Text>
        {images.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {images.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.imagePreview} />
            ))}
          </ScrollView>
        ) : (
          <TouchableOpacity
            style={styles.imageUpload}
            onPress={handlePickImage}
          >
            <Ionicons name="camera" size={28} color="#666" />
            <Text style={{ color: "#666" }}>Click here to upload Images</Text>
          </TouchableOpacity>
        )}
        {imagesError ? <Text style={styles.errorText}>{imagesError}</Text> : null}

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Post Product</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SellFormScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  form: { padding: 16 },
  label: { fontSize: 14, fontWeight: "600", marginTop: 12, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  textArea: { height: 100, textAlignVertical: "top" },
  imageUpload: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: "#4caf50",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
