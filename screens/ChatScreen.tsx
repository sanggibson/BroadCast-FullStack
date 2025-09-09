import { chatClient } from "@/streamClients";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  OverlayProvider,
} from "stream-chat-expo";

const ChatScreen = ({ route }: any) => {
  const { otherUserId } = route.params;

  const channel = chatClient.channel("messaging", {
    members: [chatClient.userID!, otherUserId],
  });

  useEffect(() => {
    channel.watch();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <OverlayProvider>
        <Chat client={chatClient}>
          <Channel channel={channel}>
            <MessageList />
            <MessageInput />
          </Channel>
        </Chat>
      </OverlayProvider>
    </SafeAreaView>
  );
};

export default ChatScreen;
