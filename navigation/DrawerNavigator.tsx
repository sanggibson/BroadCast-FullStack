import { View, Text, TouchableOpacity, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import AppNavigator from "./AppNavigator";
import SettingsScreen from "@/screens/SettingsScreen";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Avatar } from "react-native-paper";
import { useLevel } from "@/context/LevelContext";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-expo";
import TrendScreen from "@/screens/TrendScreen";
import MediaScreen from "@/screens/MediaScreen";
import MembersScreen from "@/screens/MembersScreen";

interface IconProps {
  size: number;
  color: string;
}

export const drawerScreens = [
  {
    name: "Trends",
    component: TrendScreen,
    options: {
      title: "Trends",
      drawerIcon: ({ size, color }: IconProps) => (
        <Ionicons name="trending-up-outline" size={size} color={color} />
      ),
    },
  },
  {
    name: "Members",
    component: MembersScreen,
    options: {
      title: "Members",
      drawerIcon: ({ size, color }: IconProps) => (
        <Feather name="users" size={size} color={color} />
      ),
    },
  },
  {
    name: "Media",
    component: MediaScreen,
    options: {
      title: "Media",
      drawerIcon: ({ size, color }: IconProps) => (
        <Ionicons name="images-outline" size={size} color={color} />
      ),
    },
  },

  {
    name: "Settings",
    component: SettingsScreen,
    options: {
      title: "Settings",
      drawerIcon: ({ size, color }: IconProps) => (
        <Ionicons name="settings-outline" size={size} color={color} />
      ),
    },
  },
];

const Drawer = createDrawerNavigator();

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const { userDetails, refreshUserDetails, isLoadingUser } = useLevel();

  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          marginBottom: 12,
        }}
      >
        <Pressable
          onPress={() => props.navigation.navigate("ProfileScreen")}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Avatar.Image
            size={40}
            source={{
              uri: userDetails?.image || user?.imageUrl, // fallback to Clerk image
            }}
            style={{ borderRadius: 20 }}
          />
          <View>
            <Text
              style={{
                fontWeight: "bold",
                marginLeft: 16,
                fontSize: 20,
                maxWidth: 112,
              }}
              numberOfLines={1}
            >
              {userDetails?.firstName
                ? `${userDetails.firstName} ${userDetails.lastName}`
                : "Anonymous"}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                marginLeft: 16,
                fontSize: 14,
                maxWidth: 112,
              }}
              numberOfLines={1}
            >
              @{userDetails?.nickName || "guest"}
            </Text>
          </View>
        </Pressable>
      </View>

      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  const { currentLevel, setCurrentLevel } = useLevel();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation, route }) => {
        return {
          headerTransparent: true,
          headerTitle: "",
          //   headerTintColor: theme.colors.text,
          //  drawerType: "slide", // 👈 key for smooth slide
          gestureEnabled: true, // 👈 enable swipe gestures
          swipeEdgeWidth: 50, // 👈 adjust for swipe sensitivity
          overlayColor: "rgba(0, 0, 0, 0.2)", // 👈 smooth background overlay
          //   drawerActiveBackgroundColor: theme.colors.card,
          //   drawerActiveTintColor: theme.colors.onPrimary,
          //   drawerInactiveTintColor: theme.colors.text,
          animationTypeForReplace: "push",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.toggleDrawer()}
              style={{
                marginLeft: 16,
                borderRadius: 50,
                padding: 4,
                // backgroundColor: theme.colors.primary,
                backgroundColor: "gray",
                zIndex: 999,
              }}
            >
              <Ionicons name="menu" size={28} color={"white"} />
            </TouchableOpacity>
          ),
        };
      }}
    >
      <Drawer.Screen
        name="Main"
        component={AppNavigator}
        options={{
          title:
            currentLevel?.value && typeof currentLevel.value === "string"
              ? currentLevel.value.charAt(0).toUpperCase() +
                currentLevel.value.slice(1)
              : "Home",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="planet" size={size} color={color} />
          ),
        }}
      />
      {drawerScreens.map((screen) => (
        <Drawer.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={screen.options}
        />
      ))}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
