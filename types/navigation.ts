import { Status } from "./types";

export type RootStackParamList = {
  PostScreen: undefined;
  StatusInput: undefined;
  PostDetail: { post: Post };
  Comments: { post: Post };
  Market: undefined;
  ProductDetail: { product: Product };
  NamesScreen: undefined;
  Location: undefined;
  EditProfile: undefined;
  StatusView: { userStatuses: Status[] }; // ✅ add this
  Input: undefined;
  Notifications: undefined;
  GoLive: { userId: string; username: string };
  Privacy: undefined;
  AboutScreen: undefined;
  Sell: undefined;
  LevelScreen: undefined;
  Chat: { chatId: string; userName: string; userImg: string; userId: string };
  LiveStreamScreen: { userId: string; username: string };
  Drawer: undefined; // ✅ add this
};

interface Post {
  _id: string;
  userId: string;
  userName: string;
  firstName?: string;
  nickname?: string;
  media: string[];
  caption?: string; // ✅ optional because some posts might not have it
  likes?: any[]; // array of likes
  comments?: any[]; // array of comments
  retweets?: string[];
  shares?: number;
  rcast?: number; // if you added recite
  createdAt: string;
  userImg: string;
  nickName?: string;
  originalPostId?: string; // for retweets/recites
  commentsCount?: number; // to show number of comments
}


export type Product = {
  id: string;
  _id: string;
  name?: string;
  price: number;
  images: string;
  title: string;
  description: string;
  userId: string;
  userName: string;
  createdAt: string;
  category: string;
  
};
