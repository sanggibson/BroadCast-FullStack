import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { View, Text, ScrollView, StyleSheet, Switch } from "react-native";

const Notifications = () => {
  const [mentions, setMentions] = useState(true);
  const [followers, setFollowers] = useState(true);
  const [messages, setMessages] = useState(true);
  const [updates, setUpdates] = useState(false);
  const navigation = useNavigation();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View className=" flex-row items-center">
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="ml-auto p-2"
        >
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>
        Manage how BroadCast keeps you updated
      </Text>

      {/* Mentions */}
      <View style={styles.row}>
        <Text style={styles.label}>Mentions & Comments</Text>
        <Switch value={mentions} onValueChange={setMentions} />
      </View>

      {/* Followers */}
      <View style={styles.row}>
        <Text style={styles.label}>New Followers</Text>
        <Switch value={followers} onValueChange={setFollowers} />
      </View>

      {/* Direct Messages */}
      <View style={styles.row}>
        <Text style={styles.label}>Direct Messages</Text>
        <Switch value={messages} onValueChange={setMessages} />
      </View>

      {/* App Updates */}
      <View style={styles.row}>
        <Text style={styles.label}>BroadCast Updates</Text>
        <Switch value={updates} onValueChange={setUpdates} />
      </View>

      {/* Info */}
      <Text style={styles.footer}>
        You can turn off notifications anytime in your device settings.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
    color: "#111",
    textAlign: "center"
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  label: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  footer: {
    fontSize: 13,
    color: "#777",
    marginTop: 30,
    lineHeight: 20,
  },
});

export default Notifications;
