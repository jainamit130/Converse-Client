import React, { createContext, useContext, useEffect, useState } from "react";

const ChatRoomContext = createContext({
  chatRooms: new Map(),
  messages: new Map(),
  typing: [],
  onlineUsers: [],
  lastSeen: null,
  setChatRooms: () => {},
  setMessages: () => {},
  setTyping: () => {},
  setOnlineUsers: () => {},
  setLastSeen: () => {},
});

export const useChatRoomContext = () => useContext(ChatRoomContext);

export const ChatRoomContextProvider = ({ children }) => {
  const [chatRooms, setChatRooms] = useState(new Map());

  const [messages, setMessages] = useState(new Map());

  const [onlineUsers, setOnlineUsers] = useState([]);

  // online or last seen
  const [lastSeen, setLastSeen] = useState();

  // typing - name or count
  const [typing, setTyping] = useState([]);

  return (
    <ChatRoomContext.Provider
      value={{
        typing,
        setTyping,

        chatRooms,
        setChatRooms,

        onlineUsers,
        setOnlineUsers,

        lastSeen,
        setLastSeen,

        messages,
        setMessages,
      }}
    >
      {children}
    </ChatRoomContext.Provider>
  );
};
