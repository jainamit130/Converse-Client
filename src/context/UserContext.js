import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(
    String(localStorage.getItem("userId")) || null
  );

  const [activeChatRoomId, setActiveChatRoomId] = useState(null);

  const [isLogin, setIsLogin] = useState(false);

  const updateUserId = (id) => {
    const userIdString = String(id);
    setIsLogin(true);
    setUserId(userIdString);
  };

  const updateActiveChatRoom = (chatRoomId) => {
    const chatRoomIdString = String(chatRoomId);
    localStorage.setItem("activeChatRoom", chatRoomIdString);
    setActiveChatRoomId(chatRoomIdString);
  };

  return (
    <UserContext.Provider
      value={{
        userId,
        updateUserId,
        isLogin,
        setIsLogin,
        activeChatRoomId,
        setActiveChatRoomId,
        updateActiveChatRoom,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
