import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_CHAT_ROOMS_OF_USER } from "../graphql/queries";
import ChatRoom from "./ChatRoom";
import { useUser } from "../context/UserContext";
import GroupIcon from "../assets/GroupIcon.png";
import newChat from "../assets/newChat.png";
import { useNavigate } from "react-router-dom";
import { useChatRoom } from "../context/ChatRoomContext";
import "./ChatRooms.css";
import TypingIndicator from "./TypingIndicator";
import { usePageActivity } from "../context/PageActivityContext";

const ChatRooms = () => {
  const { userId, activeChatRoomId, updateActiveChatRoom } = useUser();
  const { loading, error, data } = useQuery(GET_CHAT_ROOMS_OF_USER, {
    variables: { userId },
  });
  const { chatRooms, messages, mergeChatRooms } = useChatRoom();
  const navigate = useNavigate();
  const { isInactive } = usePageActivity();

  useEffect(() => {
    if (data) {
      mergeChatRooms(data.getChatRoomsOfUser);
    }
  }, [data, mergeChatRooms]);

  const handleCreateGroup = () => {
    navigate(`/add-users?userId=${userId}`);
  };

  const handleChatRoomClick = (chatRoomId, chatRoomName) => {
    updateActiveChatRoom(chatRoomId, chatRoomName);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="chat-layout">
      <div className="chat-rooms-sidebar">
        <div className="sidebar-header">
          <h2>Chats</h2>
          <img
            onClick={handleCreateGroup}
            src={newChat}
            className="newChatIcon"
            title="new chat"
          />
        </div>
        <div className="chat-room-list">
          {Array.from(chatRooms.values()).map((room) => {
            const chatRoom = chatRooms.get(room.id);

            return (
              <div
                key={room.id}
                className="chat-room-tile"
                onClick={() => handleChatRoomClick(room.id, room.name)}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={GroupIcon}
                      className="chatRoomIcon"
                      alt="Group Icon"
                    />
                    <div>
                      <div className="chatRoomTitle">{room.name}</div>
                      {chatRoom?.typingUsers.length > 0 ? (
                        <TypingIndicator typingUsers={chatRoom.typingUsers} />
                      ) : (
                        <div className="latestMessage">
                          {room.latestMessage?.content || "No messages yet"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {activeChatRoomId !== room.id &&
                  room.unreadMessageCount > 0 && (
                    <div className="unreadMessages">
                      {room.unreadMessageCount}
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="chat-section">
        {!activeChatRoomId ? (
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
            key={activeChatRoomId}
            initialMessages={messages[activeChatRoomId] || []}
          />
        )}
      </div>
    </div>
  );
};

export default ChatRooms;
