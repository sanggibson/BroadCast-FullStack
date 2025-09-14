import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PostScreen from "@/screens/PostScreen";

const HomeNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Posts" component={PostScreen} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
