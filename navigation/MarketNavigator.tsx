import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MarketScreen from "@/screens/MarketScreen";
import ProductDetailScreen from "@/screens/ProductDetail";
import SellFormScreen from "@/screens/SellFormScreen";

const MarketNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Market" component={MarketScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Sell" component={SellFormScreen} />
    </Stack.Navigator>
  );
};

export default MarketNavigator;
