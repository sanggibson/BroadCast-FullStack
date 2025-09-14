import { View, Text, Pressable, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker"; // expo install @react-native-picker/picker
import iebc from "@/assets/data/iebc.json";
import { SafeAreaView } from "react-native-safe-area-context";
import TypeWriter from "react-native-typewriter";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation";

const LocationSelection = () => {
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [loading, setloading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Get county object
  const county = iebc.counties.find((c) => c.name === selectedCounty) || null;

  // Constituencies inside selected county
  const constituencies = county ? county.constituencies : [];

  // Get constituency object
  const constituency =
    constituencies.find((c) => c.name === selectedConstituency) || null;

  // Wards inside selected constituency
  const wards = constituency ? constituency.wards : [];

  const { user } = useUser(); // Clerk user

  const saveLocation = async () => {
    setloading(true);
    try {
      // ✅ Save location to MongoDB
      await axios.post("http://192.168.100.4:3000/api/users/update-location", {
        clerkId: user?.id,
        county: selectedCounty,
        constituency: selectedConstituency,
        ward: selectedWard,
      });

      // ✅ Update Clerk metadata so RootNavigator knows onboarding is done
      await user?.update({
        unsafeMetadata: {
          ...user?.unsafeMetadata, // keep existing flags
          hasLocation: true,
          onboarded: true,
        },
      });

      // ✅ Navigate to Drawer (main app)
      navigation.replace("Drawer");
    } catch (err) {
      console.error("❌ Error saving location:", err);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (user?.unsafeMetadata?.onboarded) {
      navigation.replace("Drawer");
    }
  }, [user]);

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <View className="h-32">
        <TypeWriter
          typing={1}
          className="m-5 text-2xl font-bold  text-center"
          numberOfLines={2}
        >
          Welcome to BroadCast, In pursuit of a perfect nation.
        </TypeWriter>
      </View>
      {/* County Picker */}
      <Text className="font-bold text-2xl">County</Text>
      <Picker
        selectedValue={selectedCounty}
        onValueChange={(val) => {
          setSelectedCounty(val);
          setSelectedConstituency("");
          setSelectedWard("");
        }}
      >
        <Picker.Item label="Select County" value="" />
        {iebc.counties.map((c, idx) => (
          <Picker.Item key={idx} label={c.name} value={c.name} />
        ))}
      </Picker>

      {/* Constituency Picker */}
      {selectedCounty ? (
        <>
          <Text className="font-bold text-2xl">Constituency</Text>
          <Picker
            selectedValue={selectedConstituency}
            onValueChange={(val) => {
              setSelectedConstituency(val);
              setSelectedWard("");
            }}
          >
            <Picker.Item label="Select Constituency" value="" />
            {constituencies.map((c, idx) => (
              <Picker.Item key={idx} label={c.name} value={c.name} />
            ))}
          </Picker>
        </>
      ) : null}

      {/* Ward Picker */}
      {selectedConstituency ? (
        <>
          <Text className="font-bold text-2xl">Ward</Text>
          <Picker
            selectedValue={selectedWard}
            onValueChange={(val) => setSelectedWard(val)}
          >
            <Picker.Item label="Select Ward" value="" />
            {wards.map((w, idx) => (
              <Picker.Item key={idx} label={w.name} value={w.name} />
            ))}
          </Picker>
        </>
      ) : null}

      {/* Show Selection */}
      {selectedWard ? (
        <Text style={{ marginTop: 20, fontWeight: "bold" }}>
          ✅ Selected: {selectedCounty} → {selectedConstituency} →{" "}
          {selectedWard}
        </Text>
      ) : null}

      {selectedCounty && selectedConstituency && selectedWard && (
        <Pressable
          onPress={saveLocation}
          className="bg-black py-4 rounded-xl flex-row justify-center items-center mt-10"
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
        </Pressable>
      )}
    </SafeAreaView>
  );
};

export default LocationSelection;
