// src/components/ChatRooms.js

import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_CHAT_ROOMS_OF_USER } from "../graphql/queries";
import ChatRoom from "./ChatRoom";
import { useWebSocket } from "../context/WebSocketContext";

const ChatRooms = ({ userId }) => {
  const { loading, error, data } = useQuery(GET_CHAT_ROOMS_OF_USER, {
    variables: { userId },
  });

  const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);
  const [messages, setMessages] = useState({});
  const { subscribeToChatRoom, connected } = useWebSocket();

  useEffect(() => {
    if (!data || !connected) return;

    data.getChatRoomsOfUser.forEach((room) => {
      subscribeToChatRoom(room.id, (receivedMessage) => {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [room.id]: [...(prevMessages[room.id] || []), receivedMessage],
        }));
      });
    });
  }, [data, connected, subscribeToChatRoom]);

  const handleChatRoomClick = (chatRoomId) => {
    setSelectedChatRoomId(chatRoomId);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="chat-rooms">
      {data.getChatRoomsOfUser.map((room) => (
        <div
          key={room.id}
          className="chat-room-tile"
          onClick={() => handleChatRoomClick(room.id)}
        >
          <h3>{room.name}</h3>
          <p>{room.latestMessage?.content || "No messages yet"}</p>
          <p>
            <small>{new Date(room.createdAt).toLocaleString()}</small>
          </p>
        </div>
      ))}

      {selectedChatRoomId && (
        <ChatRoom
          key={selectedChatRoomId}
          chatRoomId={selectedChatRoomId}
          messages={messages[selectedChatRoomId] || []}
        />
      )}
    </div>
  );
};

export default ChatRooms;
