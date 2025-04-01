import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import "./ChatRooms.css";
import { GET_CHAT_ROOMS_OF_USER } from "../../../graphql/queries";
import { useNavigate } from "react-router-dom";
import { iconType } from "../../MappingTypes/iconFactory";
import Tile from "../../reusableComponents/Tile/Tile";
import { useChatRoomWebSocket } from "../../../context/WebSocketContext/ChatRoomWebSocketContext";
import { useUserWebSocket } from "../../../context/WebSocketContext/UserWebSocketContext";

const ChatRooms = ({ onChatRoomSelect }) => {
  const { userId, setUserId } = useUserWebSocket();
  const { chatRooms, setChatRooms } = useChatRoomWebSocket();
  const navigate = useNavigate();

  const openChatRoom = ({ chatRoomId, chatRoomName, chatRoomType }) => {
    localStorage.setItem("activeChatRoomId", chatRoomId);
    localStorage.setItem("activeChatRoomName", chatRoomName);
    localStorage.setItem("activeChatRoomType", chatRoomType);
  };

  useEffect(() => {
    if (!userId) {
      const storedUserId = localStorage.getItem("userId");
      if (!storedUserId) {
        navigate("/");
      } else {
        setUserId(storedUserId);
      }
    }
  }, [userId, setUserId]);

  const { loading, error, data } = useQuery(GET_CHAT_ROOMS_OF_USER);

  useEffect(() => {
    if (data && userId) {
      const newChatRooms = new Map();
      (data.getChatRoomsOfUser || []).forEach((chatRoom) => {
        newChatRooms.set(chatRoom.id, chatRoom);
      });

      setChatRooms(newChatRooms);
    }
  }, [data, userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="chatRooms">
      <h2>Chats</h2>
      {chatRooms.size > 0 ? (
        // Convert the Map to an array to use map()
        Array.from(chatRooms.values()).map((room) => (
          <Tile
            key={room.id}
            tileClick={() =>
              onChatRoomSelect(room.id, room.chatRoomName, room.chatRoomType)
            }
            id={room.id}
            name={room.chatRoomName}
            type={room.chatRoomType}
            titleSubInfo={room.latestMessage.name}
            primarySubInfo={room.latestMessage.content}
            unreadMessageCount={room.unreadMessageCount}
            timestamp={room.latestMessage.timestamp}
            icon={iconType(room.chatRoomType)}
          />
        ))
      ) : (
        <p>No chat rooms available</p>
      )}
    </div>
  );
};

export default ChatRooms;
