import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import LinearGradient from "react-native-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation";
import Svg, { Circle } from "react-native-svg";


const STATUS_RADIUS = 30;
const STATUS_RING_GAP = 4; // spacing for the gradient ring

interface Status {
  _id: string;
  userId: string;
  userName: string;
  media: string[];
  createdAt: string;
}

type StatusInputNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "StatusInput"
>;

interface StatusListProps {
  currentLevel: { type: string; value: string };
}

const StatusList: React.FC<StatusListProps> = ({ currentLevel }) => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [seenStatuses, setSeenStatuses] = useState<string[]>([]);
  const navigation = useNavigation<StatusInputNavProp>();

  const fetchStatuses = async () => {
    try {
      let url = "http://192.168.100.4:3000/api/statuses";
      if (currentLevel.type !== "home") {
        url += `?levelType=${currentLevel.type}&levelValue=${currentLevel.value}`;
      }
      const res = await axios.get(url);
      setStatuses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, [currentLevel]);

  useFocusEffect(
    useCallback(() => {
      fetchStatuses();
    }, [currentLevel])
  );

  // Group statuses by user
  const groupedStatuses: Record<string, Status[]> = statuses.reduce(
    (acc, status) => {
      if (!acc[status.userId]) acc[status.userId] = [];
      acc[status.userId].push(status);
      return acc;
    },
    {} as Record<string, Status[]>
  );

  Object.keys(groupedStatuses).forEach((userId) =>
    groupedStatuses[userId].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  );

  const formattedTitle =
    currentLevel.type === "home"
      ? "Home"
      : `${
          currentLevel.value.charAt(0).toUpperCase() +
          currentLevel.value.slice(1)
        } ${
          currentLevel.type.charAt(0).toUpperCase() + currentLevel.type.slice(1)
        }`;

  return (
    <View>
      <Text style={styles.statusHeader}>{formattedTitle}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      >
        {/* Add New Status */}
        <TouchableOpacity
          style={styles.statusWrapper}
          onPress={() => navigation.navigate("StatusInput")}
        >
          <View style={styles.addStatusCircle}>
            <Ionicons name="add" size={28} color="blue" />
          </View>
          <Text style={styles.statusLabel}>Your Story</Text>
        </TouchableOpacity>

        {/* Existing statuses */}
        {Object.keys(groupedStatuses).map((userId) => (
          <StatusItem
            key={userId}
            userStatuses={groupedStatuses[userId]}
            seenStatuses={seenStatuses}
            navigation={navigation}
            setSeenStatuses={setSeenStatuses}
          />
        ))}
      </ScrollView>
    </View>
  );
};

// ---------------- StatusItem Component ----------------
interface StatusItemProps {
  userStatuses: Status[];
  seenStatuses: string[];
  setSeenStatuses: React.Dispatch<React.SetStateAction<string[]>>;
  navigation: any;
}


const StatusItem: React.FC<StatusItemProps> = ({
  userStatuses,
  seenStatuses,
  setSeenStatuses,
  navigation,
}) => {
  const isSeen = userStatuses.every((s) => seenStatuses.includes(s._id));

  const handlePress = () => {
    navigation.navigate("StatusView", { userStatuses });
    const newSeen = userStatuses.map((s) => s._id);
    setSeenStatuses((prev) => [...new Set([...prev, ...newSeen])]);
  };

  const ringCount = userStatuses.length;
  const RADIUS = STATUS_RADIUS;
  const STROKE_WIDTH = 4;

  const circumference = 2 * Math.PI * RADIUS;
  const arcLength = circumference / ringCount - 4; // 4 is gap between arcs
  const gap = 4;

  return (
    <TouchableOpacity onPress={handlePress} style={styles.statusWrapper}>
      <Svg
        width={(RADIUS + STROKE_WIDTH) * 2}
        height={(RADIUS + STROKE_WIDTH) * 2}
        style={{ position: "absolute" }}
      >
        {userStatuses.map((_, index) => {
          const strokeDasharray = `${arcLength} ${gap}`;
          return (
            <Circle
              key={index}
              cx={RADIUS + STROKE_WIDTH}
              cy={RADIUS + STROKE_WIDTH}
              r={RADIUS}
              stroke={isSeen ? "#d3d3d3" : "#F58529"}
              strokeWidth={STROKE_WIDTH}
              fill="transparent"
              strokeDasharray={strokeDasharray}
              rotation={(index * 360) / ringCount}
              originX={RADIUS + STROKE_WIDTH}
              originY={RADIUS + STROKE_WIDTH}
            />
          );
        })}
      </Svg>

      <Image
        source={{
          uri: userStatuses[0].media[0] || "https://via.placeholder.com/60",
        }}
        style={{
          width: RADIUS * 2,
          height: RADIUS * 2,
          borderRadius: RADIUS,
          backgroundColor: "#eee",
        }}
      />

      <Text style={styles.statusLabel} numberOfLines={1}>
        {userStatuses[0].userName || "Anonymous"}
      </Text>
    </TouchableOpacity>
  );
};



// ---------------- Styles ----------------
const styles = StyleSheet.create({
  statusHeader: {
    alignSelf: "center",
    marginTop: 20,
    fontSize: 22,
    fontWeight: "bold",
    padding: 5,
  },
  statusWrapper: {
    marginHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    width: STATUS_RADIUS * 2 + STATUS_RING_GAP * 2,
  },
  addStatusCircle: {
    width: STATUS_RADIUS * 2,
    height: STATUS_RADIUS * 2,
    borderRadius: STATUS_RADIUS,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  statusLabel: {
    marginTop: 6,
    fontSize: 12,
    maxWidth: STATUS_RADIUS * 2 + 12,
    textAlign: "center",
    color: "#333",
    fontWeight: "500",
  },
});

export default StatusList;
