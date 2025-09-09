import { StreamChat } from "stream-chat";
import axios from "axios";

export const chatClient = StreamChat.getInstance(
  process.env.EXPO_PUBLIC_STREAM_KEY!
);

export async function connectStreamUser(clerkId: string) {
  try {
    // Replace with your backend URL
    const res = await axios.post(
      "http://192.168.100.4:3000/api/users/stream-token",
      {
        clerkId,
      }
    );

    const { token, user } = res.data;

    await chatClient.connectUser(user, token);

    console.log("✅ Stream user connected:", user.id);
  } catch (err) {
    console.error("Stream connect failed:", err);
  }
}
