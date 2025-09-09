import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather, Ionicons } from "@expo/vector-icons";
import HomeNavigator from "./HomeNavigator";
import MarketNavigator from "./MarketNavigator";
import NewsNavigator from "./NewsNavigator";
import ProfileNavigator from "./ProfileNavigator";
import LevelScreen from "@/screens/LevelScreen";
import InputScreen from "@/screens/InputScreen";
import { useLevel } from "@/context/LevelContext";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation";

const Tab = createBottomTabNavigator();


type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Input"
>;


const AppNavigator: React.FC = () => {
  const { currentLevel, userDetails } = useLevel();
  const navigation = useNavigation<NavigationProp>()

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          // tabBarShowLabel: false,
          tabBarStyle: {
            position: "absolute",
            height: 80,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 5,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={LevelScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="planet-outline" size={size} color={color} />
            ),
            tabBarLabel: currentLevel?.value
              ? currentLevel.value.charAt(0).toUpperCase() +
                currentLevel.value.slice(1)
              : "Home",
          }}
        />
        <Tab.Screen
          name="Market"
          component={MarketNavigator}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cart-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Input"
          component={InputScreen}
          options={{
            tabBarButton: () => null, // hide default tab button
          }}
        />
        <Tab.Screen
          name="News"
          component={NewsNavigator}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="newspaper-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="You"
          component={ProfileNavigator}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Avatar.Image
                size={32}
                source={{
                  uri: userDetails?.image,
                }}
                style={{ borderRadius: 50 }}
              />
            ),
          }}
        />
      </Tab.Navigator>

      {/* Floating Plus Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          // navigate to InputScreen or open modal
          navigation.navigate("Input");
        }}
      >
        <Feather name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 40, // ⬅️ push it higher
    alignSelf: "center",
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "#1F2937",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});
