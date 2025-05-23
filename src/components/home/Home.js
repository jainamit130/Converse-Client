import React, { useState, useEffect } from "react";
import ChatRoom from "./chatRoom/ChatRoom";
import ChatRooms from "./chatRooms/ChatRooms";
import backgroundImage from "../../assets/LoginBackground.png";
import "./Home.css";
import NewGroup from "./Users/NewGroup/NewGroup";
import NewChat from "./Users/NewChat/NewChat";

const Home = () => {
  const [activeChatRoomId, setActiveChatRoomId] = useState(null);
  const [activeChatRoomName, setActiveChatRoomName] = useState(null);
  const [activeChatRoomType, setActiveChatRoomType] = useState(null);
  const [view, setView] = useState("chatRooms");

  const handleChatRoomSelect = ({ id, name, type }) => {
    localStorage.setItem("activeChatRoomId", id);
    localStorage.setItem("activeChatRoomName", name);
    localStorage.setItem("activeChatRoomType", type);
    setActiveChatRoomId(id);
    setActiveChatRoomName(name);
    setActiveChatRoomType(type);
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
            handleNewGroup={handleChatRoomSelect}
          />
        )}
      </div>
      <div className="chatRoom">
        {activeChatRoomId ? (
          <ChatRoom
            activeChatRoomId={activeChatRoomId}
            activeChatRoomName={activeChatRoomName}
            activeChatRoomType={activeChatRoomType}
            setActiveChatRoomId={setActiveChatRoomId}
            setActiveChatRoomName={setActiveChatRoomName}
            setActiveChatRoomType={setActiveChatRoomType}
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
