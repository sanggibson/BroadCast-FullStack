import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

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

const StatusViewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userStatuses } = route.params as RouteParams;

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentStatus = userStatuses[currentIndex];

  const nextStatus = () => {
    if (currentIndex < userStatuses.length - 1)
      setCurrentIndex(currentIndex + 1);
    else navigation.goBack(); // exit after last
  };

  const prevStatus = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <View style={styles.container}>
      {/* Close button */}
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Status content */}
      <View style={styles.content}>
        {currentStatus.media && currentStatus.media.length > 0 ? (
          <>
            <Image
              source={{ uri: currentStatus.media[0] }}
              style={styles.media}
              resizeMode="contain"
            />
            {currentStatus.caption ? (
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  textAlign: "center",
                  marginTop: 10,
                  paddingHorizontal: 20,
                }}
              >
                {currentStatus.caption}
              </Text>
            ) : null}
          </>
        ) : (
          <Text style={styles.textStatus}>{currentStatus.caption}</Text>
        )}
      </View>

      {/* Progress bar (optional) */}
      <View style={styles.progressBarContainer}>
        {userStatuses.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressBar,
              {
                flex: 1,
                marginHorizontal: 2,
                backgroundColor:
                  index <= currentIndex ? "#fff" : "rgba(255,255,255,0.5)",
              },
            ]}
          />
        ))}
      </View>

      {/* Navigation */}
      <View style={styles.nav}>
        <TouchableOpacity style={{ flex: 1 }} onPress={prevStatus} />
        <TouchableOpacity style={{ flex: 1 }} onPress={nextStatus} />
      </View>
    </View>
  );
};

export default StatusViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  closeBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  media: {
    width: width,
    height: height * 0.8,
  },
  textStatus: {
    color: "#fff",
    fontSize: 24,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  progressBarContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 50,
    left: 10,
    right: 10,
  },
  progressBar: {
    height: 2,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  nav: {
    flexDirection: "row",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
