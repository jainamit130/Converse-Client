import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import "./ChatRooms.css";
import { GET_CHAT_ROOMS_OF_USER } from "../../../graphql/queries";
import { useNavigate } from "react-router-dom";
import { iconType } from "../../MappingTypes/iconFactory";
import Tile from "../../reusableComponents/Tile/Tile";
import { useUserWebSocket } from "../../../context/WebSocketContext/UserWebSocketContext";
import { useChatRoomContext } from "../../../context/ChatRoomContext";
import newChatIcon from "../../../assets/newChat.png";

const ChatRooms = ({ openNewChat, onChatRoomSelect }) => {
  const { userId, setUserId } = useUserWebSocket();
  const { chatRooms, setChatRooms, setDirectSelfChats } = useChatRoomContext();
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

  const { loading, error, data } = useQuery(GET_CHAT_ROOMS_OF_USER, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data && userId) {
      const newChatRooms = new Map();
      const newDirectSelfChats = new Map();

      (data.getChatRoomsOfUser || []).forEach((chatRoom) => {
        newChatRooms.set(chatRoom.id, chatRoom);

        if (
          chatRoom.chatRoomType === "DIRECT" ||
          chatRoom.chatRoomType === "SELF"
        ) {
          newDirectSelfChats.set(chatRoom.chatRoomName, chatRoom.id);
        }
      });

      setChatRooms(newChatRooms);
      setDirectSelfChats(newDirectSelfChats);
    }
  }, [data, userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="chatRooms">
      <div className="chatRoomsHeader">
        <h2>Chats</h2>
        <img src={newChatIcon} className="newChatIcon" onClick={openNewChat} />
      </div>
      {chatRooms.size > 0 ? (
        Array.from(chatRooms.values()).map((room) => (
          <Tile
            key={room.id}
            tileClick={onChatRoomSelect}
            id={room.id}
            name={room.chatRoomName}
            type={room.chatRoomType}
            userId={userId}
            message={room.latestMessage}
            titleSubInfo={room.latestMessage?.name}
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
