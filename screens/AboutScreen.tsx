import React from "react";
import { View, Text, ScrollView, StyleSheet, Linking } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Image } from "react-native";

const AboutScreen = () => {
  const appVersion = "1.0.0"; // you can fetch dynamically

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/icon.jpg")}
          className="h-20 w-20 rounded-full"
        />
        <Text style={styles.title}>BroadCast</Text>
        <Text style={styles.subtitle}>Your Voice. Your Platform.</Text>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About BroadCast</Text>
        <Text style={styles.paragraph}>
          BroadCast is a political engagement platform designed to connect
          citizens, leaders, and communities. Our mission is to empower people
          to share their voices, access verified information, and engage in
          meaningful conversations that shape the future.
        </Text>
      </View>

      {/* Mission */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.paragraph}>
          To promote transparency, accountability, and civic participation by
          providing a space where political discourse is accessible, respectful,
          and impactful.
        </Text>
      </View>

      {/* Contact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact & Support</Text>
        <Text
          style={styles.link}
          onPress={() => Linking.openURL("mailto:techredant@gmail.com")}
        >
          techredant@gmail.com
        </Text>
        <Text
          style={styles.link}
          onPress={() => Linking.openURL("https://broadcastKe.com")}
        >
          www.broadcastKe.com
        </Text>
      </View>

      {/* Version Info */}
      <View style={styles.footer}>
        <Text style={styles.version}>Version {appVersion}</Text>
        <Text style={styles.copyright}>
          © {new Date().getFullYear()} BroadCast
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginVertical: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 10,
    color: "#111",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
    textAlign: "center",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
  link: {
    fontSize: 15,
    color: "#2563eb",
    marginTop: 6,
  },
  footer: {
    alignItems: "center",
    marginTop: 40,
  },
  version: {
    fontSize: 13,
    color: "#666",
  },
  copyright: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
});

export default AboutScreen;
