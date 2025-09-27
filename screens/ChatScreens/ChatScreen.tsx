import { useUser } from "@clerk/clerk-expo";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
} from "stream-chat-react-native";

// ✅ Initialize client
const client = StreamChat.getInstance(process.env.STREAM_CHAT_KEY);

const ChatScreen = () => {
  const [channel, setChannel] = useState<any>(null);
  const { user } = useUser();

  useEffect(() => {
    const setupChat = async () => {
      // ✅ Connect a user
      await client.connectUser(
        {
          id: user?.id,
          name: user?.firstName,
        },
        client.devToken(user?.id) // devToken only for dev mode
      );

      // ✅ Create or get a channel
      const newChannel = client.channel(user.id, "chat-room", {
        name: "My Chat Room",
      });

      await newChannel.watch();

      setChannel(newChannel);
    };

    setupChat();

    // ✅ Cleanup
    return () => {
      client.disconnectUser();
    };
  }, []);

  if (!channel) {
    return <Text>Loading chat...</Text>;
  }

  return (
    <Chat client={client}>
      <Channel channel={channel}>
        <MessageList />
        <MessageInput />
      </Channel>
    </Chat>
  );
};

export default ChatScreen;
