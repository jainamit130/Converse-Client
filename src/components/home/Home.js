import React, { useState, useEffect } from "react";
import ChatRoom from "./chatRoom/ChatRoom";
import ChatRooms from "./chatRooms/ChatRooms";
import backgroundImage from "../../assets/LoginBackground.png";
import "./Home.css";

const Home = () => {
  const [activeChatRoomId, setActiveChatRoomId] = useState(null);
  const [activeChatRoomName, setActiveChatRoomName] = useState(null);

  const handleChatRoomSelect = (chatRoomId, chatRoomName) => {
    localStorage.setItem("activeChatRoomId", chatRoomId);
    localStorage.setItem("activeChatRoomName", chatRoomName);
    setActiveChatRoomId(chatRoomId);
    setActiveChatRoomName(chatRoomName);
  };

  useEffect(() => {
    const storedChatRoomId = localStorage.getItem("activeChatRoomId");
    if (storedChatRoomId) {
      setActiveChatRoomId(storedChatRoomId);
    }
  }, []);

  return (
    <div className="homePage">
      <ChatRooms onChatRoomSelect={handleChatRoomSelect} />
      {activeChatRoomId ? (
        <ChatRoom
          activeChatRoomId={activeChatRoomId}
          activeChatRoomName={activeChatRoomName}
        />
      ) : (
        <div
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            height: "100vh",
          }}
        ></div>
      )}
    </div>
  );
};

export default Home;
