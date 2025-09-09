
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
  GoLive: undefined;
  Privacy: undefined;
  AboutScreen: undefined
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
  shares?: number;
  retweets?: number; // if you added retweet
  rcast?: number; // if you added recite
  createdAt: string;
}


export type Product = {
  id: string;
  name?: string;
  price: number;
  image: string;
};
