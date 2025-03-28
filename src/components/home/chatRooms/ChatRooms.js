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

  const openChatRoom = ({ chatRoomId, chatRoomName }) => {
    localStorage.setItem("activeChatRoomId", chatRoomId);
    localStorage.setItem("activeChatRoomName", chatRoomName);
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
      setChatRooms(data.getChatRoomsOfUser || []);
    }
  }, [data, userId, setChatRooms]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="chatRooms">
      <h2>Chats</h2>
      {chatRooms.length > 0 ? (
        chatRooms.map((room) => (
          <Tile
            key={room.id}
            tileClick={() => onChatRoomSelect(room.id, room.chatRoomName)}
            id={room.id}
            name={room.chatRoomName}
            titleSubInfo={room.latestMessage.name}
            primarySubInfo={room.latestMessage.content}
            unreadMessageCount={room.unreadMessageCount}
            timestamp={room.latestMessage.timestamp}
            icon={iconType(room.chatRoomType)}
          ></Tile>
        ))
      ) : (
        <p>No chat rooms available</p>
      )}
    </div>
  );
};

export default ChatRooms;
