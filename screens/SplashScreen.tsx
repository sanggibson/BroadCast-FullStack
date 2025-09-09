import { View, Image } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// 🔹 If you have a root navigator, define the type here
type RootStackParamList = {
  Splash: undefined;
  SignUp: undefined;
  // add other routes
};

const SplashScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("SignUp");
    }, 3000);

    return () => clearTimeout(timer); // cleanup
  }, [navigation]);

  return (
    <View className="flex-1 justify-center items-center bg-black">
      <Image source={require("@/assets/icon.jpg")} className="h-20 w-20" />
    </View>
  );
};

export default SplashScreen;
