import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpScreen from "@/screens/AuthScreens/SignUpScreen";
import LocationSelection from "@/screens/AuthScreens/LocationSelection";
import DrawerNavigator from "./DrawerNavigator";
import { useAuth, useUser } from "@clerk/clerk-expo";
import NamesScreen from "@/screens/AuthScreens/NamesScreen";
import PostDetailScreen from "@/screens/PostScreens/PostDetailScreen";
import InputScreen from "@/screens/PostScreens/InputScreen";
import StatusInput from "@/screens/StatusScreens/StatusInput";
import StatusViewScreen from "@/screens/StatusScreens/StatusViewScreen";
import Notifications from "@/screens/DrawerScreens/Notifications";
import Privacy from "@/screens/DrawerScreens/Privacy";
import AboutScreen from "@/screens/DrawerScreens/AboutScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import LiveStreamScreen from "@/screens/LiveStreamScreen";
import SplashScreen from "@/screens/AuthScreens/SplashScreen";
import VideoCallScreen from "@/screens/VideoCallScreen";
import ChatScreen from "@/screens/ChatScreen";
import CommentsScreen from "@/screens/PostScreens/CommentScreen";

const RootNavigator = () => {
  const Stack = createNativeStackNavigator();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  // Don’t render anything until Clerk is loaded
  if (!isLoaded) {
    return null; // you can swap this with a SplashScreen
  }

  // Normalize metadata (handle "true" string or boolean)
  const hasNames =
    user?.unsafeMetadata?.hasNames === true ||
    user?.unsafeMetadata?.hasNames === "true";
  const hasLocation =
    user?.unsafeMetadata?.hasLocation === true ||
    user?.unsafeMetadata?.hasLocation === "true";
  const hasCompletedOnboarding =
    user?.unsafeMetadata?.onboarded === true ||
    user?.unsafeMetadata?.onboarded === "true";

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isSignedIn ? (
        // Auth flow
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      ) : !hasNames ? (
        <Stack.Screen name="NamesScreen" component={NamesScreen} />
      ) : !hasLocation ? (
        <Stack.Screen name="Location" component={LocationSelection} />
      ) : !hasCompletedOnboarding ? (
        <Stack.Screen name="Location" component={LocationSelection} />
      ) : (
        // Main app
        <Stack.Screen name="Drawer" component={DrawerNavigator} />
      )}

      {/* Secondary screens */}
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="CommentsScreen" component={CommentsScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="GoLive" component={LiveStreamScreen} />
      <Stack.Screen name="Input" component={InputScreen} />
      <Stack.Screen name="StatusInput" component={StatusInput} />
      <Stack.Screen name="StatusView" component={StatusViewScreen} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Privacy" component={Privacy} />
      <Stack.Screen name="AboutScreen" component={AboutScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="VideoCallScreen" component={VideoCallScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
