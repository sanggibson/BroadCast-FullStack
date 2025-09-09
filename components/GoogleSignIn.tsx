import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { useAuth, useOAuth, useUser } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};
WebBrowser.maybeCompleteAuthSession();

const GoogleSignIn = () => {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const { setActive } = useAuth(); // comes from Clerk
  const { user } = useUser(); // gives logged-in user after session is active

  useWarmUpBrowser();

  const onGoogleSignInPress = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { createdSessionId, setActive: setOAuthActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/"),
        });

      if (createdSessionId) {
        // ✅ Activate Clerk session
        await (setOAuthActive ?? setActive)({ session: createdSessionId });

        // ✅ Ensure user is available
        if (user) {
          await axios.post("http://192.168.100.4:3000/api/users/create-user", {
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            image: user.imageUrl,
            provider: "google",
          });
        }

        // ✅ Navigate to Name screen to finish profile
        // navigation.navigate("Name");
      } else {
        setError("Google sign in incomplete");
      }
    } catch (err: any) {
      console.error("Google Sign-In error:", JSON.stringify(err, null, 2));
      setError(err.errors?.[0]?.message || "Google Sign-In failed");
    } finally {
      setLoading(false);
    }
  }, [startOAuthFlow, setActive, user, navigation]);

  return (
    <View className="w-full">
      {error && (
        <Text className="text-red-500 text-sm text-center mb-3">{error}</Text>
      )}

      <TouchableOpacity
        disabled={loading}
        onPress={onGoogleSignInPress}
        className="w-full border border-gray-300 py-3 mt-3 gap-4 rounded-lg flex-row justify-center items-center "
      >
        {loading && <ActivityIndicator color={"red"} size={"small"} />}
        <>
          <FontAwesome name="google" size={20} color="#4285F4" />
          <Text className="text-gray-900 text-base font-semibold">
            Sign In with Google
          </Text>
        </>
      </TouchableOpacity>
    </View>
  );
};

export default GoogleSignIn;
