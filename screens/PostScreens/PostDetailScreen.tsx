import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RootStackParamList } from "../../types/navigation";
import {
  Ionicons,
  AntDesign,
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import moment from "moment";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { useTheme } from "@/context/ThemeContext";

type PostDetailRouteProp = RouteProp<RootStackParamList, "PostDetail">;

const { width } = Dimensions.get("window");

const PostDetailScreen = () => {
  const route = useRoute<PostDetailRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { post } = route.params;
  const { theme, isDark } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleLike = (id: string) => {
    console.log("Liked", id);
  };

  const handleRetweet = (id: string) => {
    console.log("Retweeted", id);
  };

  // ✅ Renders media in Instagram-style grid
  // ✅ Renders ALL media in Instagram-style grid
  // const renderMediaGrid = () => {
  //   if (!post.media || post.media.length === 0) return null;

  //   const media = post.media;
  //   const count = media.length;

  //   if (count === 1) {
  //     return (
  //       <Image
  //         source={{ uri: media[0] }}
  //         style={{ width: "100%", height: 300 }}
  //         resizeMode="cover"
  //       />
  //     );
  //   }

  //   if (count === 2) {
  //     return (
  //       <View style={styles.row}>
  //         {media.map((uri, i) => (
  //           <Image
  //             key={i}
  //             source={{ uri }}
  //             style={styles.twoImg}
  //             resizeMode="cover"
  //           />
  //         ))}
  //       </View>
  //     );
  //   }

  //   if (count === 3) {
  //     return (
  //       <View>
  //         <View style={styles.row}>
  //           {media.slice(0, 2).map((uri, i) => (
  //             <Image
  //               key={i}
  //               source={{ uri }}
  //               style={styles.twoImg}
  //               resizeMode="cover"
  //             />
  //           ))}
  //         </View>
  //         <Image
  //           source={{ uri: media[2] }}
  //           style={{ width: "100%", height: 200 }}
  //           resizeMode="cover"
  //         />
  //       </View>
  //     );
  //   }

  //   // ✅ 4 or more → break into rows of 2
  //   return (
  //     <View style={{ flexDirection: "column", flexWrap: "wrap" }}>
  //       {Array.from({ length: Math.ceil(count / 2) }).map((_, rowIndex) => (
  //         <View key={rowIndex} style={styles.row}>
  //           {media.slice(rowIndex * 2, rowIndex * 2 + 2).map((uri, i) => (
  //             <Image
  //               key={i}
  //               source={{ uri }}
  //               style={styles.twoImg}
  //               resizeMode="cover"
  //             />
  //           ))}
  //         </View>
  //       ))}
  //     </View>
  //   );
  // };

  const renderMediaGrid = () => {
    if (!post.media || post.media.length === 0) return null;

    const media = post.media;
    const count = media.length;

    // ✅ 1 image → full width
    if (count === 1) {
      return (
        <Image
          source={{ uri: media[0] }}
          style={{ width: "100%", height: 300 }}
          resizeMode="cover"
        />
      );
    }

    // ✅ 2 images → side by side
    if (count === 2) {
      return (
        <View style={styles.row}>
          {media.map((uri, i) => (
            <Image
              key={i}
              source={{ uri }}
              style={styles.twoImg}
              resizeMode="cover"
            />
          ))}
        </View>
      );
    }

    // ✅ 3 or more → stack in a column (each full width)
    return (
      <View style={{ flexDirection: "column" }}>
        {media.map((uri, i) => (
          <Image
            key={i}
            source={{ uri }}
            style={{ width: "100%", height: 400, marginBottom: 6 }}
            resizeMode="cover"
          />
        ))}
      </View>
    );
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Transparent StatusBar */}
      <StatusBar
        translucent
        backgroundColor="transparent" // prevent the warning
        barStyle={isDark ? "light-content" : "dark-content"}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userRow}>
            <Image source={{ uri: post?.userImg }} style={styles.userImg} />
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{post.firstName}</Text>
              {post?.nickName && (
                <Text style={styles.nickname}>@{post.nickname}</Text>
              )}
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.time}>
                {moment(post.createdAt).fromNow()}
              </Text>
            </View>
          </View>
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={28} color="#000" />
          </Pressable>
        </View>

        {/* Media Grid */}
        {renderMediaGrid()}

        {/* Caption */}
        {post.caption && <Text style={styles.caption}>{post.caption}</Text>}

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.action}
            onPress={() => handleLike(post._id)}
          >
            <AntDesign
              name={post.likes?.includes(post.userId) ? "heart" : "hearto"}
              size={20}
              color={post.likes?.includes(post.userId) ? "red" : "gray"}
            />
            <Text style={styles.actionText}>{post.likes?.length || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.action}
            onPress={() => navigation.navigate("CommentsScreen", { post })}
          >
            <Feather name="message-circle" size={20} color="gray" />
            <Text style={styles.actionText}>{post.commentsCount || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.action}
            onPress={() => handleRetweet(post._id)}
          >
            <FontAwesome5
              name="retweet"
              size={20}
              color={post.originalPostId ? "green" : "gray"}
            />
            <Text style={styles.actionText}>{post.retweets?.length || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.action}>
            <MaterialCommunityIcons
              name="comment-quote-outline"
              size={20}
              color="gray"
            />
            <Text style={styles.actionText}>{post.rcast || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.action}>
            <Feather name="share" size={20} color="gray" />
            <Text style={styles.actionText}>{post.shares || 0}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#ddd",
  },
  userName: { fontSize: 16, fontWeight: "600", color: "#000" },
  nickname: { fontSize: 13, color: "gray" },
  timeContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: "auto",
  },
  time: { color: "#555", fontSize: 12, fontWeight: "500" },
  caption: { fontSize: 16, color: "#333", paddingHorizontal: 15, marginTop: 8 },

  // ✅ Grid styles
  row: { flexDirection: "row", flexWrap: "wrap" },
  twoImg: { width: "50%", height: 200 },
  gridImg: { width: "50%", height: 150 },
  fourthImg: { width: "50%", height: 150 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: { color: "#fff", fontSize: 22, fontWeight: "bold" },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  action: { flexDirection: "row", alignItems: "center" },
  actionText: { marginLeft: 6, fontSize: 12, color: "#555" },
});
