import { NavigationContainer } from "@react-navigation/native";
import "./global.css";
import { StyleSheet, Text, View } from "react-native";
import RootNavigator from "./navigation/RootNavigator";
import { ClerkProvider } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { UserOnboardingProvider } from "./contexts/UserOnBoardingContext";
import { LevelProvider } from "./context/LevelContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "./context/ThemContext";
import { StripeProvider } from "@stripe/stripe-react-native";

export default function App() {
  const tokenCache = {
    async getToken(key: string) {
      try {
        return await SecureStore.getItemAsync(key);
      } catch (error) {
        return null;
      }
    },

    async saveToken(key: string, value: string) {
      try {
        return await SecureStore.setItemAsync(key, value);
      } catch (error) {
        return;
      }
    },
  };

  const AppContent: React.FC = () => {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <UserOnboardingProvider>
          <LevelProvider>
            {/* <ThemeProvider> */}
              <NavigationContainer>
                <StripeProvider
                  publishableKey={
                    process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!
                  }
                >
                  <RootNavigator />
                </StripeProvider>
              </NavigationContainer>
            {/* </ThemeProvider> */}
          </LevelProvider>
        </UserOnboardingProvider>
      </GestureHandlerRootView>
    );
  };
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey="pk_test_YXNzdXJlZC13aWxkY2F0LTcxLmNsZXJrLmFjY291bnRzLmRldiQ"
    >
      <AppContent />
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
