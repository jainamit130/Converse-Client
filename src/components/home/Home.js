import React, { useState, useEffect } from "react";
import ChatRoom from "./chatRoom/ChatRoom";
import ChatRooms from "./chatRooms/ChatRooms";
import backgroundImage from "../../assets/LoginBackground.png";
import "./Home.css";

const Home = () => {
  const [activeChatRoomId, setActiveChatRoomId] = useState(null);
  const [activeChatRoomName, setActiveChatRoomName] = useState(null);
  const [activeChatRoomType, setActiveChatRoomType] = useState(null);

  const handleChatRoomSelect = (chatRoomId, chatRoomName, chatRoomType) => {
    localStorage.setItem("activeChatRoomId", chatRoomId);
    localStorage.setItem("activeChatRoomName", chatRoomName);
    localStorage.setItem("activeChatRoomType", chatRoomType);
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
      <div className="chatRooms">
        <ChatRooms onChatRoomSelect={handleChatRoomSelect} />
      </div>
      <div className="chatRoom">
        {activeChatRoomId ? (
          <ChatRoom
            activeChatRoomId={activeChatRoomId}
            activeChatRoomName={activeChatRoomName}
            activeChatRoomType={activeChatRoomType}
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
    </div>
  );
};

export default Home;
