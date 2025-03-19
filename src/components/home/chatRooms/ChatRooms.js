import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_CHAT_ROOMS_OF_USER } from "../../../graphql/queries";
import { useNavigate } from "react-router-dom";
import { iconType } from "../../MappingTypes/iconFactory";
import Tile from "../../reusableComponents/Tile/Tile";
import { useChatRoomWebSocket } from "../../../context/WebSocketContext/ChatRoomWebSocketContext";
import { useUserWebSocket } from "../../../context/WebSocketContext/UserWebSocketContext";

const ChatRooms = () => {
  const { userId, setUserId } = useUserWebSocket();
  const { chatRooms, setChatRooms } = useChatRoomWebSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      const storedUserId = localStorage.getItem("userId");
      if (!storedUserId) {
        navigate("/");
      } else {
        setUserId(storedUserId);
      }
    }
  }, [navigate, userId, setUserId]);

  const { loading, error, data } = useQuery(GET_CHAT_ROOMS_OF_USER);

  useEffect(() => {
    if (data) {
      setChatRooms(data.getChatRoomsOfUser);
    }
  }, [data, setChatRooms]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Chats</h2>
      <ul>
        {data.getChatRoomsOfUser.map((room) => (
          <Tile
            id={room.id}
            name={room.chatRoomName}
            titleSubInfo={room.latestMessage.name}
            primarySubInfo={room.latestMessage.content}
            unreadMessageCount={room.unreadMessageCount}
            timestamp={room.latestMessage.timestamp}
            icon={iconType(room.chatRoomType)}
          ></Tile>
        ))}
      </ul>
    </div>
  );
};

export default ChatRooms;
