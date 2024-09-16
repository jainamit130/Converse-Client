import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(
    String(localStorage.getItem("userId")) || null
  );

  const [isLogin, setIsLogin] = useState(false);

  const updateUserId = (id) => {
    const userIdString = String(id);
    localStorage.setItem("userId", userIdString);
    setIsLogin(true);
    setUserId(userIdString);
  };

  return (
    <UserContext.Provider value={{ userId, updateUserId, isLogin, setIsLogin }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
