import React, { useState, useEffect } from "react";
import ChatRoom from "./chatRoom/ChatRoom";
import ChatRooms from "./chatRooms/ChatRooms";
import backgroundImage from "../../assets/LoginBackground.png";
import "./Home.css";
import NewGroup from "./Users/NewGroup/NewGroup";
import NewChat from "./Users/NewChat/NewChat";
import { useChatRoomContext } from "../../context/ChatRoomContext";

const Home = () => {
  const {
    activeChatRoomId,
    activeChatRoomName,
    activeChatRoomType,
    setActiveChatRoomId,
    setActiveChatRoomName,
    setActiveChatRoomType,
  } = useChatRoomContext();
  const [view, setView] = useState("chatRooms");

  const handleChatRoomSelect = ({ id, name, type }) => {
    if (id !== "temp") localStorage.removeItem("newDirectChatUserId");
    setActiveChatRoomId(id);
    setActiveChatRoomName(name);
    setActiveChatRoomType(type);
  };

  return (
    <div className="homePage">
      <div className="chatRooms">
        {view === "chatRooms" && (
          <ChatRooms
            openNewChat={() => setView("newChat")}
            onChatRoomSelect={handleChatRoomSelect}
          />
        )}
        {view === "newChat" && (
          <NewChat
            handleNewChat={handleChatRoomSelect}
            goBack={() => setView("chatRooms")}
            openNewGroup={() => setView("newGroup")}
          />
        )}
        {view === "newGroup" && (
          <NewGroup
            goBack={() => setView("newChat")}
            goBackTwice={() => setView("chatRooms")}
            handleNewGroup={handleChatRoomSelect}
          />
        )}
      </div>
      <div className="chatRoom">
        {activeChatRoomId ? (
          <ChatRoom handleChatRoomSelect={handleChatRoomSelect} />
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
