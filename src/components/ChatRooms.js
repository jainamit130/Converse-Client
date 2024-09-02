import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_CHAT_ROOMS_OF_USER } from "../graphql/queries";
import ChatRoom from "./ChatRoom";
import { useUser } from "../context/UserContext";
import GroupIcon from "../assets/GroupIcon.png";
import { useNavigate } from "react-router-dom";
import { useChatRoom } from "../context/ChatRoomContext";
import "./ChatRooms.css";

const ChatRooms = () => {
  const { userId } = useUser();
  const { loading, error, data } = useQuery(GET_CHAT_ROOMS_OF_USER, {
    variables: { userId },
  });
  const { chatRooms, messages, mergeChatRooms } = useChatRoom();
  const navigate = useNavigate();
  const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);
  const [selectedChatRoomName, setSelectedChatRoomName] = useState(null);

  useEffect(() => {
    if (data) {
      mergeChatRooms(data.getChatRoomsOfUser);
    }
  }, [data, mergeChatRooms]);

  const handleCreateGroup = () => {
    navigate(`/add-users?userId=${userId}`);
  };

  const handleChatRoomClick = (chatRoomId, chatRoomName) => {
    setSelectedChatRoomName(chatRoomName);
    setSelectedChatRoomId(chatRoomId);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="chat-layout">
      <div className="chat-rooms-sidebar">
        <div className="sidebar-header">
          <h2>Chats</h2>
          <button onClick={handleCreateGroup}>+ Create Group</button>
        </div>
        <div className="chat-room-list">
          {Array.from(chatRooms.values()).map((room) => (
            <div
              key={room.id}
              className="chat-room-tile"
              onClick={() => handleChatRoomClick(room.id, room.name)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img src={GroupIcon} className="chatRoomIcon" />
                <div>
                  <div className="chatRoomTitle">{room.name}</div>
                  <div className="latestMessage">
                    {room.latestMessage?.content || "No messages yet"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-section">
        {!selectedChatRoomId ? (
          <div className="chat-header">
            <div className="converse">
              <div style={{ textAlign: "right" }}>
                <h1
                  style={{
                    marginBottom: "0px",
                    fontSize: "80px",
                    fontStyle: "italic",
                    fontFamily: "cursive",
                  }}
                >
                  Converse
                </h1>
                <p
                  style={{
                    marginTop: "0px",
                    fontSize: "13px",
                  }}
                >
                  Made by Amit
                </p>
              </div>
              <h3>Open any chat to see messages here</h3>
            </div>
          </div>
        ) : (
          <ChatRoom
            key={selectedChatRoomId}
            chatRoomId={selectedChatRoomId}
            chatRoomName={selectedChatRoomName}
            initialMessages={messages[selectedChatRoomId] || []}
          />
        )}
      </div>
    </div>
  );
};

export default ChatRooms;
