import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Animated,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@clerk/clerk-expo";
import axios from "axios";

const { width, height } = Dimensions.get("window");

interface Status {
  _id: string;
  userId: string;
  userName: string;
  media: string[];
  caption?: string;
  createdAt: string;
  type?: "image" | "video" | "text";
}

interface RouteParams {
  userStatuses: Status[];
}

type StatusViewRouteProp = RouteProp<RootStackParamList, "StatusView">;
type StatusViewNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "StatusView"
>;

const STATUS_DURATION = 5000;

const StatusViewScreen = () => {
  const route = useRoute<StatusViewRouteProp>();
  const navigation = useNavigation<StatusViewNavigationProp>();
  const { userStatuses } = route.params as RouteParams;
  const { userId } = useAuth(); // Clerk gives logged-in user id

  const [currentIndex, setCurrentIndex] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;

  const currentStatus = userStatuses[currentIndex];
  const { theme, isDark } = useTheme();

  // Auto-progress
  useEffect(() => {
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: STATUS_DURATION,
      useNativeDriver: false,
    });

    animation.start(({ finished }) => {
      if (finished) nextStatus();
    });

    return () => animation.stop();
  }, [currentIndex]);

  const nextStatus = () => {
    if (currentIndex < userStatuses.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.goBack();
    }
  };

  const prevStatus = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Status",
      "Are you sure you want to delete this status?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(
                `http://192.168.100.4:3000/api/status/${currentStatus._id}`,
                { data: { userId } }
              );
              navigation.goBack(); // close after delete
            } catch (err) {
              console.error("❌ Error deleting status:", err);
              Alert.alert("Error", "Failed to delete status.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDark ? "light-content" : "dark-content"}
      />

      {/* Status content */}
      <View style={styles.content}>
        {currentStatus.media?.length > 0 ? (
          <Image
            source={{ uri: currentStatus.media[0] }}
            style={styles.media}
            resizeMode="cover"
          />
        ) : (
          <Text style={[styles.textStatus, { color: theme.text }]}>
            {currentStatus.caption}
          </Text>
        )}
      </View>

      {/* Top overlay (progress + buttons) */}
      <LinearGradient
        colors={["rgba(0,0,0,0.7)", "transparent"]}
        style={styles.topOverlay}
      >
        {/* Progress bars */}
        <View style={styles.progressBarContainer}>
          {userStatuses.map((_, index) => {
            if (index < currentIndex) {
              return (
                <View
                  key={index}
                  style={[
                    styles.progressBar,
                    { flex: 1, backgroundColor: "#fff" },
                  ]}
                />
              );
            } else if (index === currentIndex) {
              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.progressBar,
                    { flex: progress, backgroundColor: "#fff" },
                  ]}
                />
              );
            } else {
              return (
                <View
                  key={index}
                  style={[
                    styles.progressBar,
                    { flex: 1, backgroundColor: "rgba(255,255,255,0.4)" },
                  ]}
                />
              );
            }
          })}
        </View>

        {/* Close button */}
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Delete button (only if mine) */}
        {currentStatus.userId === userId && (
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Ionicons name="trash" size={24} color="red" />
          </TouchableOpacity>
        )}
      </LinearGradient>

      {/* Bottom caption */}
      {currentStatus.caption ? (
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.bottomOverlay}
        >
          <Text style={styles.caption}>{currentStatus.caption}</Text>
        </LinearGradient>
      ) : null}

      {/* Navigation zones */}
      <View style={styles.nav}>
        <TouchableOpacity style={{ flex: 1 }} onPress={prevStatus} />
        <TouchableOpacity style={{ flex: 1 }} onPress={nextStatus} />
      </View>
    </SafeAreaView>
  );
};

export default StatusViewScreen;

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  media: { width, height },
  textStatus: { fontSize: 24, textAlign: "center", paddingHorizontal: 20 },
  topOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  caption: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontStyle: "italic",
  },
  closeBtn: {
    position: "absolute",
    top: 45,
    right: 20,
    padding: 6,
  },
  deleteBtn: {
    position: "absolute",
    top: 45,
    left: 20,
    padding: 6,
  },
  progressBarContainer: {
    flexDirection: "row",
    height: 2,
    marginBottom: 15,
    flex: 1,
    gap: 2,
  },
  progressBar: { height: 2, borderRadius: 2 },
  nav: {
    flexDirection: "row",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
