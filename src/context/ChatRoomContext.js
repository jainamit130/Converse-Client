import React, { createContext, useCallback, useContext, useState } from "react";

const ChatRoomContext = createContext();

export const ChatRoomProvider = ({ children }) => {
  const [chatRooms, setChatRooms] = useState(new Map());
  const [messages, setMessages] = useState({});

  const mergeChatRooms = useCallback((newChatRooms) => {
    const chatRoomsArray = Array.isArray(newChatRooms)
      ? newChatRooms
      : [newChatRooms];

    setChatRooms((prevChatRooms) => {
      const updatedRooms = new Map(prevChatRooms); // Convert previous state to a Map

      chatRoomsArray.forEach((newRoom) => {
        const existingRoom = updatedRooms.get(newRoom.id);

        if (existingRoom) {
          updatedRooms.set(newRoom.id, { ...existingRoom, ...newRoom });
        } else {
          updatedRooms.set(newRoom.id, newRoom);
        }
      });

      return updatedRooms;
    });
  }, []);

  const addMessageToRoom = useCallback((chatRoomId, message, base = false) => {
    setMessages((prevMessages) => {
      const currentMessages = prevMessages[chatRoomId] || [];

      const messageExists = currentMessages.some(
        (msg) => msg.id === message.id
      );

      if (messageExists) return prevMessages;

      const updatedMessages = {
        ...prevMessages,
        [chatRoomId]: [...currentMessages, message],
      };

      if (base) {
        const { [chatRoomId]: updatedRoom, ...rest } = updatedMessages;
        return {
          [chatRoomId]: updatedRoom,
          ...rest,
        };
      }

      return updatedMessages;
    });
  }, []);

  return (
    <ChatRoomContext.Provider
      value={{
        chatRooms,
        setChatRooms,
        messages,
        addMessageToRoom,
        mergeChatRooms,
      }}
    >
      {children}
    </ChatRoomContext.Provider>
  );
};

export const useChatRoom = () => useContext(ChatRoomContext);
