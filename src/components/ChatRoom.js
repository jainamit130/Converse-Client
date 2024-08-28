import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_MESSAGES_OF_CHAT_ROOM } from "../graphql/queries";
import { useWebSocket } from "../context/WebSocketContext";
import { useUser } from "../context/UserContext";
import { useChatRoom } from "../context/ChatRoomContext";

const ChatRoom = ({ chatRoomId }) => {
  const { userId } = useUser();
  const { sendMessage, connected } = useWebSocket();
  const { messages, addMessageToRoom } = useChatRoom();

  const [chatRoomMessages, setChatRoomMessages] = useState(
    messages[chatRoomId] || []
  );

  useEffect(() => {
    setChatRoomMessages(messages[chatRoomId] || []);
  }, [messages[chatRoomId]]);

  const { loading, error, data } = useQuery(GET_MESSAGES_OF_CHAT_ROOM, {
    variables: { chatRoomId },
    skip: !connected,
    fetchPolicy: "network-only",
  });

  const handleSendMessage = (messageContent) => {
    if (!userId) {
      console.error("User ID is not available");
      return;
    }

    const newMessage = {
      id: `${Math.random()}`,
      content: messageContent,
      senderId: userId,
      chatRoomId,
      timestamp: new Date().toISOString(),
    };

    if (sendMessage) {
      sendMessage(`/app/chat/sendMessage/${chatRoomId}`, newMessage);
    } else {
      console.error("WebSocket not connected, unable to send message");
    }
  };

  useEffect(() => {
    if (!data || !connected) return;

    // Add messages to the room at the start
    data.getMessagesOfChatRoom.forEach((chatMessage) =>
      addMessageToRoom(chatRoomId, chatMessage, true)
    );

    // Any additional logic can follow here
  }, [data, connected, chatRoomId, chatRoomMessages, addMessageToRoom]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Chat Room: {chatRoomId}</h2>
      <div>
        {chatRoomMessages && chatRoomMessages.length > 0 ? (
          chatRoomMessages.map((message) => (
            <div key={message.id}>
              <p>{message.content}</p>
            </div>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const messageContent = e.target.elements.messageContent.value;
          handleSendMessage(messageContent);
          e.target.reset();
        }}
      >
        <input
          type="text"
          name="messageContent"
          placeholder="Type your message..."
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatRoom;
