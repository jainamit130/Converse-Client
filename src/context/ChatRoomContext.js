import React, { createContext, useContext, useState } from "react";

const ChatRoomContext = createContext({
  chatRooms: new Map(),
  messages: new Map(),
  setChatRooms: () => {},
  setMessages: () => {},
});

export const useChatRoomContext = () => useContext(ChatRoomContext);

export const ChatRoomContextProvider = ({ children }) => {
  const [chatRooms, setChatRooms] = useState(new Map());
  const [messages, setMessages] = useState(new Map());

  return (
    <ChatRoomContext.Provider
      value={{
        chatRooms,
        setChatRooms,
        messages,
        setMessages,
      }}
    >
      {children}
    </ChatRoomContext.Provider>
  );
};
