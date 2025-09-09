import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LiveStreamScreen from "@/screens/LiveStreamScreen";
import PostScreen from "@/screens/PostScreen";
import InputScreen from "@/screens/InputScreen";
import PostDetailScreen from "@/screens/PostDetailScreen";
import CommentScreen from "@/screens/CommentScreen";

const HomeNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Posts" component={PostScreen} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
