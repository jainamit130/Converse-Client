import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(
    String(localStorage.getItem("userId")) || null
  );

  const [token, setToken] = useState(
    localStorage.getItem("authenticationToken") || null
  );

  const [username, setUsername] = useState(
    String(localStorage.getItem("username")) || null
  );

  const [activeChatRoomId, setActiveChatRoomId] = useState(() => {
    const storedData = localStorage.getItem("activeChatRoom");
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

  const updateUserId = (id) => {
    const userIdString = String(id);
    setIsLogin(true);
    setUserId(userIdString);
  };

  const resetUser = () => {
    setUserId(null);
    setToken(null);
    setUsername(null);
    setActiveChatRoomId(null);
    setIsLogin(false);

    localStorage.removeItem("userId");
    localStorage.removeItem("authenticationToken");
    localStorage.removeItem("username");
    localStorage.removeItem("activeChatRoom");
    localStorage.removeItem("isLogin");
  };

  return (
    <UserContext.Provider
      value={{
        userId,
        updateUserId,
        username,
        isLogin,
        setIsLogin,
        activeChatRoomId,
        setActiveChatRoomId,
        token,
        resetUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
