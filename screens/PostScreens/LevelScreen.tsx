import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { FloatingAction } from "react-native-floating-action";
import { Feather, Ionicons, FontAwesome5, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLevel } from "@/context/LevelContext";
import { useUser } from "@clerk/clerk-expo";
import PostScreen from "./PostScreen";
import { RootStackParamList } from "@/types/navigation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "GoLive">;

const LevelScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { currentLevel, setCurrentLevel, userDetails, refreshUserDetails } =
    useLevel();
  const { user, isLoaded } = useUser();
  const [userReady, setUserReady] = useState(false);

  // Wait for Clerk user to load
  useEffect(() => {
    if (isLoaded && user?.id && user?.firstName) {
      setUserReady(true);
      refreshUserDetails();
    }
  }, [isLoaded, user]);

  const actions = [
    {
      text: "Home",
      icon: <Ionicons name="earth-outline" size={20} color="#fff" />,
      name: "home",
      position: 0,
      color: "#1F2937",
    },
    {
      text: "County",
      icon: <Feather name="map" size={20} color="#fff" />,
      name: "county",
      position: 1,
      color: "#1F2937",
    },
    {
      text: "Constituency",
      icon: <FontAwesome5 name="flag" size={20} color="#fff" />,
      name: "constituency",
      position: 2,
      color: "#1F2937",
    },
    {
      text: "Ward",
      icon: <FontAwesome5 name="map-pin" size={20} color="#fff" />,
      name: "ward",
      position: 3,
      color: "#1F2937",
    },
    {
      text: "Go Live",
      icon: <AntDesign name="videocamera" size={20} color="#fff" />,
      name: "GoLive",
      position: 4,
      color: "#1F2937",
    },
  ];

  const handleActionPress = (name?: string) => {
    switch (name) {
      case "home":
        setCurrentLevel({ type: "home", value: "home" });
        break;
      case "county":
        setCurrentLevel({ type: "county", value: userDetails?.county || null });
        break;
      case "constituency":
        setCurrentLevel({
          type: "constituency",
          value: userDetails?.constituency || null,
        });
        break;
      case "ward":
        setCurrentLevel({ type: "ward", value: userDetails?.ward || null });
        break;
      case "GoLive":
        navigation.navigate("VideoCallScreen", { roomName: user?.id! });
        break;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Pass currentLevel as prop */}
      <PostScreen currentLevel={currentLevel} />

      <FloatingAction
        actions={actions}
        onPressItem={handleActionPress}
        color="#1F2937"
        overlayColor="rgba(0,0,0,0.7)"
        floatingIcon={<Feather name="more-vertical" size={24} color="#fff" />}
        distanceToEdge={{ vertical: 100, horizontal: 10 }}
      />
    </View>
  );
};

export default LevelScreen;
