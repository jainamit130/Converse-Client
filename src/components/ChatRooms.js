import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_CHAT_ROOMS_OF_USER } from "../graphql/queries";
import ChatRoom from "./ChatRoom";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useChatRoom } from "../context/ChatRoomContext";
import { useWebSocket } from "../context/WebSocketContext";

const ChatRooms = () => {
  const { userId } = useUser();
  const { loading, error, data } = useQuery(GET_CHAT_ROOMS_OF_USER, {
    variables: { userId },
  });
  const { chatRooms, messages, mergeChatRooms } = useChatRoom();
  const { subscribeToUser, subscribeToChatRoom } = useWebSocket();
  const navigate = useNavigate();
  const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);

  useEffect(() => {
    if (data) {
      mergeChatRooms(data.getChatRoomsOfUser);
    }
  }, [data, mergeChatRooms]);

  const handleCreateGroup = () => {
    navigate(`/add-users?userId=${userId}`);
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
