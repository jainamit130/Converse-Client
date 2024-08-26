import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_CHAT_ROOMS_OF_USER } from "../graphql/queries";
import { useWebSocket } from "../context/WebSocketContext";
import ChatRoom from "./ChatRoom";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useChatRoom } from "../context/ChatRoomContext";

const ChatRooms = () => {
  const { userId } = useUser();
  const { loading, error, data } = useQuery(GET_CHAT_ROOMS_OF_USER, {
    variables: { userId },
  });
  const { chatRooms, messages, addMessageToRoom, mergeChatRooms } =
    useChatRoom();
  const navigate = useNavigate();
  const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);
  const { subscribeToChatRoom, subscribeToUser, connected } = useWebSocket();

  // Syncing the data fetched from the query with the global state
  useEffect(() => {
    if (data) {
      mergeChatRooms(data.getChatRoomsOfUser); // Merge with global state
    }
  }, [data]);

  // Subscribing to WebSocket events and handling new messages or rooms
  useEffect(() => {
    if (!data || !connected) return;

    // Subscribe to new chat rooms for the user
    subscribeToUser(userId, (newChatRoom) => {
      mergeChatRooms([newChatRoom]); // Use the merging function to add new rooms
    });

    // Subscribe to each chat room
    chatRooms.forEach((room) => {
      subscribeToChatRoom(room.id, (receivedMessage) => {
        addMessageToRoom(room.id, receivedMessage);
      });
    });
  }, [data, connected, subscribeToChatRoom, subscribeToUser, userId]);

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
