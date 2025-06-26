import React, { useState, useEffect } from "react";
import ChatRoom from "./chatRoom/ChatRoom";
import ChatRooms from "./chatRooms/ChatRooms";
import backgroundImage from "../../assets/LoginBackground.png";
import logoGif from "../../assets/loadinggif.gif";
import "./Home.css";
import NewGroup from "./Users/NewGroup/NewGroup";
import NewChat from "./Users/NewChat/NewChat";
import { useChatRoomContext } from "../../context/ChatRoomContext";
import AddUser from "./Users/AddUser/AddUser";
import useGroupTransaction from "./chatRoom/hook/useGroupTransaction";

const Home = () => {
  const {
    activeChatRoomId,
    activeChatRoomName,
    activeChatRoomType,
    setActiveChatRoomId,
    setActiveChatRoomName,
    setActiveChatRoomType,
    updateChatRoomUsers,
  } = useChatRoomContext();
  const [view, setView] = useState("chatRooms");
  const { chatRooms } = useChatRoomContext();
  const [chatRoom, setChatRoom] = useState(chatRooms.get(activeChatRoomId));
  const { addUsers } = useGroupTransaction();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let homePageClassNames = "homePage";

  if (isMobile) {
    if (activeChatRoomId) {
      homePageClassNames += " chatRoomActive";
    } else {
      homePageClassNames += " mobile-view";
    }
  }

  useEffect(() => {
    setChatRoom(chatRooms.get(activeChatRoomId));
  }, [chatRooms, activeChatRoomId]);

  const handleChatRoomSelect = ({ id, name, type }) => {
    if (id !== "temp") localStorage.removeItem("newDirectChatUserId");
    setActiveChatRoomId(id);
    setActiveChatRoomName(name);
    setActiveChatRoomType(type);
  };

  const addUsersHandler = async (userIds, shareHistory) => {
    try {
      const response = await addUsers({
        chatRoomId: activeChatRoomId,
        users: userIds,
        shareHistory,
      });

      setView("chatRooms");
      if (response?.status === 204) {
        updateChatRoomUsers(activeChatRoomId, (userIdsList) => [
          ...new Set([...userIdsList, ...userIds]),
        ]);
      }
    } catch (error) {
      console.error("Failed to add user:", error);
      return { error };
    }
  };

  return (
    <div className={homePageClassNames}>
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
          <ChatRoom
            chatRoom={chatRoom}
            handleChatRoomSelect={handleChatRoomSelect}
            handleAddUsers={() => setView("addUser")}
          />
        ) : (
          <div className="chatRoomPlaceholder">
            <div
              className="placeholder-bg"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
            <img className="placeholder-logo" src={logoGif} alt="Converse" />
          </div>
        )}
      </div>
      {view === "addUser" && (
        <AddUser
          goBack={() => setView("chatRooms")}
          handleAddUser={addUsersHandler}
          chatRoom={chatRoom}
        />
      )}
    </div>
  );
};

export default Home;
