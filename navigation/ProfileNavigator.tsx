import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "@/screens/ProfileScreen";
import { useUser } from "@clerk/clerk-expo";
import NameScreen from "@/screens/NamesScreen";
import EditProfile from "@/screens/EditProfile";

const Stack = createNativeStackNavigator();

const ProfileNavigator = () => {
  //  const { user } = useUser();

  //  useEffect(() => {
  //    if (user?.id) {
  //      connectStreamUser(user.id);
  //    }
  //  }, [user]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      {/* <Stack.Screen name="Chat" component={ChatScreen} /> */}
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
