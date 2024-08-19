// src/components/ChatRooms.js
import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_CHAT_ROOMS_OF_USER } from "../graphql/queries";
import ChatRoom from "./ChatRoom";
import { useWebSocket } from "../context/WebSocketContext";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const ChatRooms = () => {
  const { userId } = useUser();
  const { loading, error, data } = useQuery(GET_CHAT_ROOMS_OF_USER, {
    variables: { userId },
  });

  const navigate = useNavigate();
  const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);
  const [messages, setMessages] = useState({});
  const [chatRooms, setChatRooms] = useState([]);
  const { subscribeToChatRoom, connected } = useWebSocket();

  useEffect(() => {
    if (data) {
      setChatRooms(data.getChatRoomsOfUser);
    }
  }, [data]);

  useEffect(() => {
    if (!data || !connected) return;

    data.getChatRoomsOfUser.forEach((room) => {
      subscribeToChatRoom(room.id, (receivedMessage) => {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [room.id]: [...(prevMessages[room.id] || []), receivedMessage],
        }));

        setChatRooms((prevChatRooms) =>
          prevChatRooms.map((chatRoom) =>
            chatRoom.id === room.id
              ? { ...chatRoom, latestMessage: receivedMessage }
              : chatRoom
          )
        );
      });
    });
  }, [data, connected, subscribeToChatRoom]);

  const handleCreateGroup = () => {
    navigate("/add-users");
  };

  const handleChatRoomClick = (chatRoomId) => {
    setSelectedChatRoomId(chatRoomId);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="chat-rooms">
      <div>
        <h1>Chat Rooms</h1>
        <button onClick={handleCreateGroup}>+ Create Group</button>
      </div>
      {chatRooms.map((room) => (
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
          initialMessages={messages[selectedChatRoomId] || []}
        />
      )}
    </div>
  );
};

export default ChatRooms;
