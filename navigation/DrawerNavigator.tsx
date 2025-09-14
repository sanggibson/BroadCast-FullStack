import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Avatar } from "react-native-paper";
import { useLevel } from "@/context/LevelContext";
import { useUser } from "@clerk/clerk-expo";

import AppNavigator from "./AppNavigator";
import SettingsScreen from "@/screens/SettingsScreen";
import TrendScreen from "@/screens/TrendScreen";
import MediaScreen from "@/screens/MediaScreen";
import MembersScreen from "@/screens/MembersScreen";
import { StreamChat } from "stream-chat";

const client = StreamChat.getInstance(process.env.STREAM_API_KEY);

interface IconProps {
  size: number;
  color: string;
}

const Drawer = createDrawerNavigator();

// ✅ Custom Drawer Content
const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { user } = useUser();
  const { userDetails, isLoadingUser } = useLevel();

  return (
    <DrawerContentScrollView {...props}>
      <Pressable
        onPress={() => props.navigation.navigate("ProfileScreen")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          marginBottom: 12,
        }}
      >
        <Avatar.Image
          size={40}
          source={{ uri: userDetails?.image || user?.imageUrl || undefined }}
        />
        <View style={{ marginLeft: 12, flex: 1 }}>
          {isLoadingUser ? (
            <>
              <ActivityIndicator size="small" color="gray" />
              <Text style={{ fontSize: 14, color: "gray" }}>Loading...</Text>
            </>
          ) : (
            <>
              <Text
                style={{ fontWeight: "bold", fontSize: 16 }}
                numberOfLines={1}
              >
                {userDetails?.firstName
                  ? `${userDetails.firstName} ${userDetails.lastName}`
                  : "Anonymous"}
              </Text>
              <Text style={{ fontSize: 14, color: "gray" }} numberOfLines={1}>
                @{userDetails?.nickName || "guest"}
              </Text>
            </>
          )}
        </View>
      </Pressable>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

// ✅ Drawer Screens Array
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

const DrawerNavigator = () => {
  const { currentLevel, isLoadingUser } = useLevel();
    const [cachedLevel, setCachedLevel] = React.useState<string | null>(null);

    React.useEffect(() => {
      if (currentLevel?.value) {
        setCachedLevel(currentLevel.value);
      }
    }, [currentLevel]);


  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerTransparent: true,
        headerTitle: "",
        gestureEnabled: true,
        swipeEdgeWidth: 50,
        overlayColor: "rgba(0,0,0,0.2)",
        backgroundColor: "transparent",
        animationTypeForReplace: "push",
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            style={{
              marginLeft: 16,
              borderRadius: 50,
              padding: 4,
              backgroundColor: "gray",
              zIndex: 999,
            }}
          >
            <Ionicons name="menu" size={28} color="white" />
          </TouchableOpacity>
        ),
      })}
    >
      {/* Main App Navigator */}
      <Drawer.Screen
        name="Main"
        component={AppNavigator}
        options={{
          title: !isLoadingUser
            ? currentLevel?.value &&
              typeof currentLevel.value === "string" &&
              currentLevel.value.trim() !== ""
              ? currentLevel.value.charAt(0).toUpperCase() +
                currentLevel.value.slice(1)
              : "Home"
            : "Loading...",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="planet" size={size} color={color} />
          ),
        }}
      />

      {/* Other drawer screens */}
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
