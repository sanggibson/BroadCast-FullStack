import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from "react-native";
import {
  Feather,
  MaterialIcons,
  Entypo,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation";

interface PostOptionsProps {
  post: any;
  onDelete?: (postId: string) => void;
}

type PostOptionsNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "PostDetail"
>;

const PostOptionsModal: React.FC<PostOptionsProps> = ({ post, onDelete }) => {
  const navigation = useNavigation<PostOptionsNavProp>();
  const [visible, setVisible] = useState(false);

  const options = [
    {
      label: "Report",
      icon: <MaterialIcons name="report" size={20} color="red" />,
    },
    post.userId === post.currentUserId
      ? {
          label: "Delete",
          icon: <AntDesign name="delete" size={20} color="red" />,
        }
      : {
          label: "Unfollow",
          icon: <Feather name="user-x" size={20} color="gray" />,
        },
    {
      label: "Go to Post",
      icon: <Entypo name="link" size={20} color="gray" />,
    },
    {
      label: "Share Link",
      icon: <Ionicons name="share-social-outline" size={20} color="gray" />,
    },
    {
      label: "Copy Link",
      icon: <Feather name="copy" size={20} color="gray" />,
    },
  ];

  const handleOption = (option: string) => {
    setVisible(false);
    switch (option) {
      case "Report":
        console.log("Reported post", post._id);
        break;
      case "Delete":
        if (onDelete) onDelete(post._id);
        break;
      case "Unfollow":
        console.log("Unfollowed user", post.userId);
        break;
      case "Go to Post":
        navigation.navigate("PostDetail", { post });
        break;
      case "Share Link":
        console.log("Share link tapped");
        break;
      case "Copy Link":
        console.log("Copied link to clipboard");
        break;
    }
  };

  return (
    <>
      <Pressable onPress={() => setVisible(true)} style={{ padding: 6 }}>
        <Feather name="more-vertical" size={20} color="gray" />
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)} />
        <View style={styles.modalContainer}>
          {options.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.optionButton}
              onPress={() => handleOption(opt.label)}
            >
              <View style={styles.optionContent}>
                {opt.icon}
                <Text
                  style={[
                    styles.optionText,
                    opt.label === "Report" || opt.label === "Delete"
                      ? { color: "red" }
                      : {},
                  ]}
                >
                  {opt.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.optionButton, { marginTop: 8 }]}
            onPress={() => setVisible(false)}
          >
            <Text style={[styles.optionText, { fontWeight: "bold" }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

export default PostOptionsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  optionButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionText: {
    fontSize: 16,
  },
});
