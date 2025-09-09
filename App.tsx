// import { NavigationContainer } from "@react-navigation/native";
// import "./global.css";
// import { StyleSheet, Text, View } from "react-native";
// // import DrawerNavigator from './navigation/DrawerNavigator';
// import RootNavigator from "./navigation/RootNavigator";
// import { ClerkProvider } from "@clerk/clerk-expo";
// import * as SecureStore from "expo-secure-store";
// import { UserOnboardingProvider } from "./contexts/UserOnBoardingContext";
// import { LevelProvider } from "./context/LevelContext";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { ThemeProvider } from "./context/ThemContext";

// export default function App() {
//   const tokenCache = {
//     async getToken(key: string) {
//       try {
//         return await SecureStore.getItemAsync(key);
//       } catch (error) {
//         return null;
//       }
//     },

//     async saveToken(key: string, value: string) {
//       try {
//         return await SecureStore.setItemAsync(key, value);
//       } catch (error) {
//         return;
//       }
//     },
//   };

//   const AppContent: React.FC = () => {
//     return (
//       <GestureHandlerRootView style={{ flex: 1 }}>
//         <UserOnboardingProvider>
//           <LevelProvider>
//             <ThemeProvider>
//               <NavigationContainer>
//                 <RootNavigator />
//               </NavigationContainer>
//             </ThemeProvider>
//           </LevelProvider>
//         </UserOnboardingProvider>
//       </GestureHandlerRootView>
//     );
//   };
//   return (
//     <ClerkProvider
//       tokenCache={tokenCache}
//       publishableKey="pk_test_YXNzdXJlZC13aWxkY2F0LTcxLmNsZXJrLmFjY291bnRzLmRldiQ"
//     >
//       <AppContent />
//     </ClerkProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });


import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { ClerkProvider } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "./global.css";
import RootNavigator from "./navigation/RootNavigator";
import { UserOnboardingProvider } from "./contexts/UserOnBoardingContext";
import { LevelProvider } from "./context/LevelContext";
import { ThemeProvider, useTheme } from "./context/ThemContext";

// ✅ Wrap Navigation with theme from ThemeContext
function AppNavigation() {
  const { navTheme } = useTheme();
  return (
    <NavigationContainer theme={navTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  // Clerk secure storage
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

  // AppContent includes all context providers
  const AppContent: React.FC = () => {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <UserOnboardingProvider>
          <LevelProvider>
            <ThemeProvider>
              <AppNavigation />
            </ThemeProvider>
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
