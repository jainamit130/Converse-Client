import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(
    String(localStorage.getItem("userId")) || null
  );

  const [activeChatRoomId, setActiveChatRoomId] = useState(() => {
    const storedData = localStorage.getItem("activeChatRoom");
    return storedData ? storedData : null;
  });

  const [activeChatRoomName, setActiveChatRoomName] = useState(() => {
    const storedData = localStorage.getItem("activeChatRoomName");
    return storedData ? storedData : null;
  });

  const [isLogin, setIsLogin] = useState(() => {
    const savedLoginStatus = localStorage.getItem("isLogin");
    return savedLoginStatus === "true";
  });

  useEffect(() => {
    if (activeChatRoomId) {
      localStorage.setItem("activeChatRoom", activeChatRoomId);
    } else {
      localStorage.removeItem("activeChatRoom");
    }
  }, [activeChatRoomId]);

  useEffect(() => {
    if (activeChatRoomName) {
      localStorage.setItem("activeChatRoomName", activeChatRoomName);
    } else {
      localStorage.removeItem("activeChatRoomName");
    }
  }, [activeChatRoomName]);

  const updateUserId = (id) => {
    const userIdString = String(id);
    setIsLogin(true);
    setUserId(userIdString);
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
        activeChatRoomName,
        setActiveChatRoomName,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
