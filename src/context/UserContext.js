import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(
    String(localStorage.getItem("userId")) || null
  );

  const [activeChatRoomId, setActiveChatRoomId] = useState(null);
  const [activeChatRoomName, setActiveChatRoomName] = useState(null);

  const [isLogin, setIsLogin] = useState(false);

  const updateUserId = (id) => {
    const userIdString = String(id);
    setIsLogin(true);
    setUserId(userIdString);
  };

  const updateActiveChatRoom = (chatRoomId, chatRoomName) => {
    const chatRoomIdString = String(chatRoomId);
    localStorage.setItem("activeChatRoom", chatRoomIdString);
    localStorage.setItem("activeChatRoomName", chatRoomName);
    setActiveChatRoomId(chatRoomIdString);
    setActiveChatRoomName(chatRoomName);
  };

  return (
    <UserContext.Provider
      value={{
        userId,
        updateUserId,
        isLogin,
        setIsLogin,
        activeChatRoomId,
        activeChatRoomName,
        updateActiveChatRoom,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
