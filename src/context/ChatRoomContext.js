import React, { createContext, useContext, useEffect, useState } from "react";

const ChatRoomContext = createContext({
  chatRooms: new Map(),
  messages: new Map(),
  typing: [],
  onlineUsers: [],
  lastSeen: null,
  directSelfChats: () => {},
  setChatRooms: () => {},
  setMessages: () => {},
  setTyping: () => {},
  setOnlineUsers: () => {},
  setLastSeen: () => {},
  setDirectSelfChats: () => {},
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

  // direct/self chats => name to direct and self chat mappings
  const [directSelfChats, setDirectSelfChats] = useState(new Map());

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

        directSelfChats,
        setDirectSelfChats,
      }}
    >
      {children}
    </ChatRoomContext.Provider>
  );
};
