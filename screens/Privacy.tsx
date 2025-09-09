import React from "react";
import { View, Text, ScrollView, StyleSheet, Linking } from "react-native";

const Privacy = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Title */}
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.updated}>
        Last Updated: {new Date().toLocaleDateString()}
      </Text>

      {/* Section 1 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          BroadCast may collect personal information such as your name, email
          address, account details, and activity within the app. We may also
          collect technical information like device type, operating system, and
          usage data.
        </Text>
      </View>

      {/* Section 2 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use this data to improve your experience, provide relevant content,
          ensure platform security, and support civic engagement. Your
          information will never be sold to third parties.
        </Text>
      </View>

      {/* Section 3 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Sharing of Information</Text>
        <Text style={styles.paragraph}>
          We may share limited information with trusted service providers for
          analytics, security, and app performance. We do not share your
          personal information with advertisers or political organizations
          without your consent.
        </Text>
      </View>

      {/* Section 4 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Your Rights</Text>
        <Text style={styles.paragraph}>
          You have the right to access, update, or delete your account and data
          at any time. You may also request to opt out of certain data
          collection practices.
        </Text>
      </View>

      {/* Section 5 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions or concerns regarding your privacy, please
          contact us:
        </Text>
        <Text
          style={styles.link}
          onPress={() => Linking.openURL("mailto:privacy@broadcastapp.com")}
        >
          privacy@broadcastapp.com
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
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 6,
    color: "#111",
  },
  updated: {
    fontSize: 13,
    color: "#777",
    marginBottom: 20,
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
});

export default Privacy;
