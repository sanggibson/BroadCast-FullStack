import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSignUp } from "@clerk/clerk-expo";
// import { LockIcon, Mail } from "lucide-react-native";
import axios from "axios";
import { useUserOnboarding } from "@/contexts/UserOnBoardingContext";
import { SafeAreaView } from "react-native-safe-area-context";
import GoogleSignIn from "@/components/GoogleSignIn";
// import { useUserOnboarding } from "../contexts/UserOnBoardingContext";

const SignUpScreen = () => {
  const navigation = useNavigation();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const onSignUpPress = async () => {
    if (!isLoaded || loading) return;
    setLoading(true);
    setError("");
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.log("Sign up error", err);
      setError(err?.errors?.[0].message);
    } finally {
      setLoading(false);
    }
  };

const onVerifyPress = async () => {
  if (!isLoaded || loading) return;

  setLoading(true);

  try {
    const signUpAttempt = await signUp.attemptEmailAddressVerification({
      code,
    });

    if (signUpAttempt.status === "complete") {
      // ✅ Save Clerk session
      await setActive({ session: signUpAttempt.createdSessionId });

      // ✅ Fetch the user
      const { createdUserId } = signUpAttempt;
      const currentUser = await clerk.user?.getUser(createdUserId);

      // 🔹 Check Clerk metadata flags
      const hasNames = currentUser?.unsafeMetadata?.hasNames;
      const hasLocation = currentUser?.unsafeMetadata?.hasLocation;

      // 🔹 Navigate based on missing data
      if (!hasNames) {
        navigation.replace("Name");
      } else if (!hasLocation) {
        navigation.replace("Location");
      } else {
        navigation.replace("Drawer");
      }
    }
  } catch (err: any) {
    console.log("Verification error", err);
    setError(err?.errors?.[0]?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};



  if (pendingVerification) {
    return (
      <View className="flex-1 justify-center bg-white px-6">
        <Text className="text-center mb-2 font-bold text-2xl">Verify your email</Text>
        <TextInput
          placeholder="Enter verification cose"
          value={code}
          onChangeText={setCode}
          style={{
            width: "100%",
            padding: 12,
            marginVertical: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
          }}
          autoCapitalize="none"
        />

        {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}

        <TouchableOpacity
          onPress={onVerifyPress}
          disabled={loading}
          className="bg-black py-4 rounded-xl flex-row items-center justify-center"
        >
          {loading && <ActivityIndicator size={"small"} color={"white"} />}
          <Text className="text-white font-bold text-base text-center">
            Verify
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 justify-center bg-white px-4">
      <View className="items-center mb-6">
        {/* <Image
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROV_ZedNQKKJPiyU4ior560LpqCJOCR2oFuw&s",
          }}
          className="w-40 h-40 rounded-full"
          resizeMode="cover"
        /> */}
        <Text className="text-lg font-semibold mt-2">Welcome to BroadCast</Text>
        <Text className="text-sm text-gray-500">Create an account to vote</Text>
      </View>


      <View>
        <View className="flex-row items-center gap-3">
          {/* <Mail color={"gray"} size={18} /> */}
          <Text className="font-semibold">Email</Text>
        </View>
        <TextInput
          placeholder="Enter your email"
          style={{
            width: "100%",
            padding: 12,
            marginVertical: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          value={emailAddress}
          onChangeText={setEmailAddress}
        />
      </View>

      <View>
        <View className="flex-row items-center gap-3">
          {/* <LockIcon color={"gray"} size={18} /> */}
          <Text className="font-semibold">Password</Text>
        </View>
        <TextInput
          placeholder="Enter your Password"
          style={{
            width: "100%",
            padding: 12,
            marginVertical: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
          }}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}

      <TouchableOpacity
        onPress={onSignUpPress}
        className="bg-black py-4 rounded-xl flex-row justify-center items-center"
      >
        {loading && (
          <ActivityIndicator
            size={"small"}
            color={"#ffffff"}
            className="mr-2"
          />
        )}
        <Text className="text-white text-center font-bold text-base">
          Continue
        </Text>
      </TouchableOpacity>

      <Pressable className="mt-4">
        <Text className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Text className="font-semibold text-black">Sign In</Text>
        </Text>
      </Pressable>
      <View className="flex-row items-center w-full my-3">
        <View className="flex-1 h-[1px] bg-gray-300" />
        <Text className="mx-2 text-gray-400 text-sm">OR</Text>
        <View className="flex-1 h-[1px] bg-gray-300" />
      </View>

      <View className="w-full">
        <GoogleSignIn />
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({});
