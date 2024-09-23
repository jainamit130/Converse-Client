import React, { createContext, useState, useContext } from "react";

const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {
  const [lastChatRoomId, setLastChatRoomId] = useState(null);

  return (
    <AppStateContext.Provider value={{ lastChatRoomId, setLastChatRoomId }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);
