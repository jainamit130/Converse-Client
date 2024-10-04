import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_CHAT_ROOMS_OF_USER } from "../graphql/queries";
import ChatRoom from "./ChatRoom";
import { useUser } from "../context/UserContext";
import newChat from "../assets/newChat.png";
import { useChatRoom } from "../context/ChatRoomContext";
import "./ChatRooms.css";
import Tile from "./reusableComponents/Tile";
import AddUser from "./AddUser";
import GroupIcon from "../assets/GroupIcon.png";
import ProfileIcon from "../assets/profileIcon.webp";

const ChatRooms = () => {
  const {
    userId,
    activeChatRoomId,
    setActiveChatRoomId,
    activeChatRoomName,
    setActiveChatRoomName,
  } = useUser();
  const { loading, error, data } = useQuery(GET_CHAT_ROOMS_OF_USER, {
    variables: { userId },
  });
  const [showTempChatRoom, setShowTempChatRoom] = useState(false);
  const [temporaryChatRoom, setTempChatRoom] = useState({});
  const { chatRooms, messages, mergeChatRooms } = useChatRoom();
  const [showAddUserPanel, setShowAddUserPanel] = useState(false);

  const handleCloseAddUser = (
    chatRoomId,
    chatRoomName,
    tempChatRoom = null
  ) => {
    setShowAddUserPanel(false);
    if (chatRoomId) handleChatRoomClick(chatRoomId, chatRoomName);
    else {
      setShowTempChatRoom(true);
      setTempChatRoom(tempChatRoom);
    }
  };

  useEffect(() => {
    if (data) {
      mergeChatRooms(data.getChatRoomsOfUser);
    }
  }, [data, mergeChatRooms]);

  const handleCreateGroup = () => {
    setShowAddUserPanel(true);
  };

  const handleChatRoomClick = (chatRoomId, chatRoomName) => {
    setActiveChatRoomId(chatRoomId);
    setActiveChatRoomName(chatRoomName);
    setShowTempChatRoom(false);
    setTempChatRoom(null);
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
        {Array.from(chatRooms.values()).map((room) => (
          <Tile
            id={room.id}
            name={room.name}
            latestMessageTimestamp={room.latestMessage?.timestamp}
            smallerInfo={
              <div className="latestMessage">
                {room.latestMessage?.user.username &&
                  `${room.latestMessage?.user.username}: `}
                {room.latestMessage?.content || "No messages yet"}
              </div>
            }
            icon={GroupIcon}
            typingUsers={room.typingUsers}
            unreadMessageCount={room.unreadMessageCount}
            activeChatRoomId={activeChatRoomId}
            onChatRoomClick={handleChatRoomClick}
          />
        ))}

        {showTempChatRoom && (
          <Tile
            id="temp"
            name={temporaryChatRoom.name}
            smallerInfo={<div>No messages yet</div>}
            icon={ProfileIcon}
            onChatRoomClick={() =>
              handleChatRoomClick(null, temporaryChatRoom.name)
            }
          />
        )}
      </div>

      <div className="chat-section">
        {showTempChatRoom && <ChatRoom initialMessages={[]} />}
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
      {showAddUserPanel && <AddUser onClose={handleCloseAddUser} />}
    </div>
  );
};

export default ChatRooms;
