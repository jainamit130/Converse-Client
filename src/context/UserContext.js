import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(
    String(localStorage.getItem("userId")) || null
  );

  const updateUserId = (id) => {
    const userIdString = String(id);
    setUserId(userIdString);
    localStorage.setItem("userId", userIdString);
  };

  return (
    <UserContext.Provider value={{ userId, updateUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
