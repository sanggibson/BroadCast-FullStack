// import React, { useState, useCallback, useMemo } from "react";
// import {
//   View,
//   FlatList,
//   Image,
//   ActivityIndicator,
//   Dimensions,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
// } from "react-native";
// import axios from "axios";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import Video from "react-native-video";

// const { width } = Dimensions.get("window");

// interface MediaItem {
//   _id: string;
//   url: string;
//   type: "image" | "video";
//   nickname?: string;
//   post: any; // keep the full post for navigation
// }

// const POST_MARGIN = 4;
// const NUM_COLUMNS = 3;
// const POST_WIDTH = (width - POST_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

// const MediaScreen = () => {
//   const navigation = useNavigation<any>();
//   const [posts, setPosts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchPosts = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://192.168.100.4:3000/api/posts");
//       setPosts(res.data || []);
//     } catch (err) {
//       console.error("Error fetching posts:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Fetch posts on focus
//   useFocusEffect(
//     useCallback(() => {
//       fetchPosts();
//     }, [fetchPosts])
//   );

//   // Flatten posts → media items
//   const flatMediaItems: MediaItem[] = useMemo(() => {
//     return posts.flatMap((post) => {
//       if (!post.media) return [];
//       return post.media.map((url: string, index: number) => ({
//         _id: post._id + "_" + index,
//         url,
//         type: url.endsWith(".mp4") ? "video" : "image",
//         nickname: post.user?.nickName || "Anonymous",
//         post, // keep reference to original post
//       }));
//     });
//   }, [posts]);

//   const renderItem = ({ item }: { item: MediaItem }) => {
//     return (
//       <TouchableOpacity
//         style={{ margin: POST_MARGIN / 2 }}
//         onPress={() => navigation.navigate("PostDetail", { post: item.post })}
//       >
//         {item.type === "image" ? (
//           <Image
//             source={{ uri: item.url }}
//             style={{ width: POST_WIDTH, height: POST_WIDTH, borderRadius: 8 }}
//           />
//         ) : (
//           <Video
//             source={{ uri: item.url }}
//             style={{ width: POST_WIDTH, height: POST_WIDTH, borderRadius: 8 }}
//             resizeMode="cover"
//             repeat
//             muted
//             paused={false}
//           />
//         )}
//         <Text
//           style={{
//             fontSize: 12,
//             textAlign: "center",
//             marginTop: 4,
//             position: "absolute",
//             bottom: 0,
//             left: 0,
//             right: 0,
//             color: "#fff",
//             backgroundColor: "rgba(0,0,0,0.5)",
//             paddingVertical: 2,
//             borderBottomLeftRadius: 8,
//             borderBottomRightRadius: 8,
//             overflow: "hidden",
//           }}
//           numberOfLines={1}
//           ellipsizeMode="tail"
//         >
//           {item.nickname}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loading}>
//         <ActivityIndicator size="large" color="#4caf50" />
//       </View>
//     );
//   }

//   if (flatMediaItems.length === 0) {
//     return (
//       <View style={styles.loading}>
//         <Text>No media found</Text>
//       </View>
//     );
//   }

//   return (
//     <FlatList
//       data={flatMediaItems}
//       renderItem={renderItem}
//       keyExtractor={(item) => item._id}
//       numColumns={NUM_COLUMNS}
//       contentContainerStyle={{ padding: POST_MARGIN / 2 }}
//       showsVerticalScrollIndicator={false}
//       ListHeaderComponent={
//         <View style={{ paddingVertical: 16, marginTop: 10 }}>
//           <Text
//             style={{ fontWeight: "bold", textAlign: "center", fontSize: 20 }}
//           >
//             Media
//           </Text>
//         </View>
//       }
//     />
//   );
// };

// export default MediaScreen;

// const styles = StyleSheet.create({
//   loading: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Video from "react-native-video";

const { width } = Dimensions.get("window");

interface MediaItem {
  _id: string;
  url: string;
  type: "image" | "video";
  nickname?: string;
  firstName?: string;
  lastName?: string;
  image?: string | null;
  post: any; // keep the full post for navigation
}

const POST_MARGIN = 4;
const NUM_COLUMNS = 3;
const POST_WIDTH = (width - POST_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

const MediaScreen = () => {
  const navigation = useNavigation<any>();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://192.168.100.4:3000/api/posts");
      // postsWithUser from backend now includes `user`
      setPosts(res.data || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );

  // Flatten posts → media items
  const flatMediaItems: MediaItem[] = useMemo(() => {
    return posts.flatMap((post) => {
      if (!post.media) return [];
      return post.media.map((url: string, index: number) => ({
        _id: post._id + "_" + index,
        url,
        type: url.endsWith(".mp4") ? "video" : "image",
        nickname: post.user?.nickName || post.user?.firstName || "Anonymous",
        post, // keep reference to original post
      }));
    });
  }, [posts]);


  const renderItem = ({ item }: { item: MediaItem }) => {
    return (
      <TouchableOpacity
        style={{ margin: POST_MARGIN / 2 }}
        onPress={() => navigation.navigate("PostDetail", { post: item.post })}
      >
        {item.type === "image" ? (
          <Image
            source={{ uri: item.url }}
            style={{ width: POST_WIDTH, height: POST_WIDTH, borderRadius: 8 }}
          />
        ) : (
          <Video
            source={{ uri: item.url }}
            style={{ width: POST_WIDTH, height: POST_WIDTH, borderRadius: 8 }}
            resizeMode="cover"
            repeat
            muted
            paused={false}
          />
        )}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            paddingVertical: 2,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              textAlign: "center",
              marginTop: 4,
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              color: "#fff",
              backgroundColor: "rgba(0,0,0,0.5)",
              paddingVertical: 2,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              overflow: "hidden",
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.nickname}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#4caf50" />
      </View>
    );
  }

  if (flatMediaItems.length === 0) {
    return (
      <View style={styles.loading}>
        <Text>No media found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={flatMediaItems}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      numColumns={NUM_COLUMNS}
      contentContainerStyle={{ padding: POST_MARGIN / 2 }}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={{ paddingVertical: 16, marginTop: 10 }}>
          <Text
            style={{ fontWeight: "bold", textAlign: "center", fontSize: 20 }}
          >
            Media
          </Text>
        </View>
      }
    />
  );
};

export default MediaScreen;

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
