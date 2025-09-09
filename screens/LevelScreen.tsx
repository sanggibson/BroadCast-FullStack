import React, { useEffect } from "react";
import { View } from "react-native";
import { FloatingAction } from "react-native-floating-action";
import { Feather, Ionicons, FontAwesome5, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLevel } from "@/context/LevelContext";
import { useUser } from "@clerk/clerk-expo"; // To get logged-in user
import PostScreen from "./PostScreen";

const LevelScreen = () => {
  const navigation = useNavigation();
  const { currentLevel, setCurrentLevel, userDetails, refreshUserDetails } =
    useLevel();
  const { user } = useUser();

  // Fetch user details when screen mounts
  useEffect(() => {
    if (user?.id) {
      refreshUserDetails(user.id); // user.id = clerkId
    }
  }, [user]);

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

  const handleActionPress = (name: string) => {
    switch (name) {
      case "home":
        setCurrentLevel({ type: "home", value: "home" });
        break;
      case "county":
        setCurrentLevel({ type: "county", value: userDetails?.county });
        break;
      case "constituency":
        setCurrentLevel({
          type: "constituency",
          value: userDetails?.constituency,
        });
        break;
      case "ward":
        setCurrentLevel({ type: "ward", value: userDetails?.ward });
        break;
      case "GoLive":
        navigation.navigate("GoLive"); // Make sure this screen exists
        break;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <PostScreen key={`${currentLevel.type}-${currentLevel.value}`} />

      <FloatingAction
        actions={actions}
        onPressItem={handleActionPress}
        color="#1F2937"
        overlayColor="rgba(0,0,0,0.7)"
        floatingIcon={<Feather name="more-vertical" size={24} color="#fff" />}
        distanceToEdge={{ vertical: 90, horizontal: 20 }} // ⬅️ pushed higher
      />
    </View>
  );
};

export default LevelScreen;
