import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import { GET_MESSAGES_OF_CHAT_ROOM } from "../graphql/queries";
import { useWebSocket } from "../context/WebSocketContext";
import { useUser } from "../context/UserContext";
import { useChatRoom } from "../context/ChatRoomContext";

const ChatRoom = ({ chatRoomId }) => {
  const { userId } = useUser();
  const { subscribeToChatRoom, subscribeToUser, sendMessage, connected } =
    useWebSocket();
  const { chatRooms, messages, addMessageToRoom, mergeChatRooms } =
    useChatRoom();

  const sentMessages = useRef(new Set());

  useEffect(() => {
    const unsubscribe = subscribeToChatRoom(chatRoomId, (message) => {
      if (!sentMessages.current.has(message.id)) {
        addMessageToRoom(chatRoomId, message);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [chatRoomId, subscribeToChatRoom]);

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

    sentMessages.current.add(newMessage.id);

    if (sendMessage) {
      sendMessage(`/app/chat/sendMessage/${chatRoomId}`, newMessage);
    } else {
      console.error("WebSocket not connected, unable to send message");
    }
  };

  useEffect(() => {
    if (!data || !connected) return;

    subscribeToUser(userId, (newChatRoom) => {
      mergeChatRooms([newChatRoom]);
    });

    chatRooms.forEach((room) => {
      subscribeToChatRoom(room.id, (receivedMessage) => {
        addMessageToRoom(room.id, receivedMessage);
      });
    });
  }, [data, connected, subscribeToChatRoom, subscribeToUser, userId]);

  useEffect(() => {
    if (!data || !connected) return;

    const { getMessagesOfChatRoom: chatMessages } = data;

    addMessageToRoom(chatRoomId, chatMessages);
  }, [data, connected, addMessageToRoom, chatRoomId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Chat Room: {chatRoomId}</h2>
      <div>
        {messages && messages.length > 0 ? (
          messages.map((message) => (
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
