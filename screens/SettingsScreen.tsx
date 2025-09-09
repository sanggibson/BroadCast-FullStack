import React, { ReactNode, useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, useColorScheme, Switch } from "react-native";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation";
import { useTheme } from "@/context/ThemContext";


type RowProps = {
  label: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  destructive?: boolean;
  rightElement?: React.ReactNode;
};

type SectionProps = {
  title?: string;
  children: ReactNode;
};

type NotificationsScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "Notifications"
>;
type PrivacyNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "Privacy"
>;

const Row = ({
  label,
  icon,
  onPress,
  destructive = false,
  rightElement,
}: RowProps) => (
  <Pressable
    onPress={onPress}
    disabled={!onPress}
   className={`flex-row justify-between items-center p-4 ${onPress ? 'opacity-100' : 'opacity-50'}`}
  >
    <View className="flex-row items-center space-x-3 gap-3">
      {icon && <View>{icon}</View>}
      <Text
        style={[ destructive && { color: "red" }]}
        numberOfLines={1}
        className="font-semibold"
      >
        {label}
      </Text>
    </View>
    <View>
      {rightElement ?? <Feather name="chevron-right" size={18} color="#999" />}
    </View>
  </Pressable>
);


const Section = ({ title, children }: SectionProps) => (
  <View className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
    {title && <Text className="text-xl font-bold px-4">{title}</Text>}
    <View className="border-b border-gray-300 my-2" />

    <View>{children}</View>
  </View>
);

type SettingsScreenNavProp = NativeStackNavigationProp<RootStackParamList>;

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavProp>();
  const systemTheme = useColorScheme(); // "light" | "dark"
  const [isDarkMode, setIsDarkMode] = useState(systemTheme === "dark");
  const { theme, isDark, toggleTheme } = useTheme(); // 👈 use context

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 30, paddingTop: 30 }}
      className="flex-1 bg-gray-100 p-4"
    >
      <Text className="text-2xl text-center font-bold pb-5">
        Settings & Activity
      </Text>
      {/* Account */}
      <Section title="Account">
        <Row
          label="Edit Profile"
          icon={<Feather name="user" size={20} color="#333" />}
          onPress={() => navigation.navigate("EditProfile")}
        />
        <Row
          label={isDark ? "Light Mode" : "Dark Mode"} // 👈 toggle text
          icon={
            <Feather
              name="moon"
              size={20}
              color={isDark ? "#fff" : "#333"} // optional: adapt icon color
            />
          }
          rightElement={<Switch value={isDark} onValueChange={toggleTheme} />}
        />
      </Section>

      {/* Notifications */}
      <Section title="Preferences">
        <Row
          label="Notifications"
          icon={
            <Ionicons name="notifications-outline" size={20} color="#333" />
          }
          onPress={() => navigation.navigate("Notifications")}
        />
        <Row
          label="Privacy"
          icon={<Feather name="shield" size={20} color="#333" />}
          onPress={() => navigation.navigate("Privacy")}
        />
      </Section>

      {/* Support */}
      <Section title="Support">
        <Row
          label="Help Center"
          icon={<Feather name="help-circle" size={20} color="#333" />}
          onPress={() => {}}
        />
        <Row
          label="About"
          icon={<Feather name="info" size={20} color="#333" />}
          onPress={() => navigation.navigate("AboutScreen")}
        />
      </Section>

      {/* Logout */}
      <Section>
        <Row
          label="Log Out"
          icon={<MaterialIcons name="logout" size={20} color="red" />}
          destructive
          onPress={() => {
            // add your logout logic here
          }}
        />
      </Section>
    </ScrollView>
  );
};



export default SettingsScreen;
