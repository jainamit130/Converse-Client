import React, { createContext, useContext, useEffect, useState } from "react";
import { normalizeOnlineStatus } from "../components/home/chatRoom/util/OnlineUsersTransformation";

const ChatRoomContext = createContext({
  chatRooms: new Map(),
  messages: new Map(),
  typing: [],
  onlineUsers: [],
  lastSeen: null,
  activeChatRoomId: null,
  activeChatRoomName: null,
  activeChatRoomType: null,
  setActiveChatRoomName: () => {},
  setActiveChatRoomType: () => {},
  setActiveChatRoomId: () => {},
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

  const [activeChatRoomId, setActiveChatRoomId] = useState(null);
  const [activeChatRoomType, setActiveChatRoomType] = useState(null);
  const [activeChatRoomName, setActiveChatRoomName] = useState(null);

  const [onlineUsers, setOnlineUsers] = useState([]);

  // online or last seen
  const [lastSeen, setLastSeen] = useState();

  // typing - name or count
  const [typing, setTyping] = useState([]);

  // direct/self chats => name to direct and self chat mappings
  const [directSelfChats, setDirectSelfChats] = useState(new Map());

  const handleNewChatStatus = (chatRoomName, onlineUsersDTO) => {
    normalizeOnlineStatus({
      chatRoomName,
      onlineUsersDTO,
      setOnlineUsers,
      setLastSeen,
    });
  };

  const updateChatRoomUsers = (chatRoomId, updaterFn) => {
    setChatRooms((prev) => {
      const updated = new Map(prev);
      const chatRoom = updated.get(chatRoomId);

      if (chatRoom) {
        updated.set(chatRoomId, {
          ...chatRoom,
          userIds: updaterFn(chatRoom.userIds),
        });
      }

      return updated;
    });
  };

  const handleContextOnMemberTransaction = (transaction) => {
    if (!transaction || !transaction.username || !transaction.id) return;

    setOnlineUsers((prev) => {
      const updated = new Set(prev);

      if (transaction.type === "EXITED_CHAT") {
        updated.delete(transaction.username);
      } else if (
        transaction.type === "NEW_CHAT" &&
        transaction.onlineStatus === "ACTIVE"
      ) {
        updated.add(transaction.username);
      }

      return Array.from(updated);
    });

    if (transaction.type === "EXITED_CHAT") {
      setTyping((prev) => prev.filter((user) => user !== transaction.username));
    }

    if (transaction.type === "EXITED_CHAT") {
      updateChatRoomUsers(transaction.id, (userIds) =>
        userIds?.filter((id) => id !== transaction.id)
      );
    } else if (transaction.type === "NEW_CHAT" && transaction.userId) {
      updateChatRoomUsers(transaction.id, (userIds) => [
        ...new Set([...(userIds || []), transaction.id]),
      ]);
    }
  };

  useEffect(() => {
    if (activeChatRoomId && activeChatRoomId !== "temp") {
      setTyping([]);
      setOnlineUsers([]);
      setLastSeen(null);
    }
  }, [activeChatRoomId]);

  useEffect(() => {
    if (activeChatRoomId && activeChatRoomId !== "temp") {
      const chatRoom = chatRooms.get(activeChatRoomId);
      if (chatRoom?.isExited) {
        setTyping([]);
        setOnlineUsers([]);
        setLastSeen(null);
      }
    }
  }, [chatRooms, activeChatRoomId]);

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

        activeChatRoomId,
        setActiveChatRoomId,

        activeChatRoomName,
        setActiveChatRoomName,

        activeChatRoomType,
        setActiveChatRoomType,

        handleContextOnMemberTransaction,

        updateChatRoomUsers,

        handleNewChatStatus,
      }}
    >
      {children}
    </ChatRoomContext.Provider>
  );
};
