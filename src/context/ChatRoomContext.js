import React, { createContext, useCallback, useContext, useState } from "react";

const ChatRoomContext = createContext();

export const ChatRoomProvider = ({ children }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [messages, setMessages] = useState({});

  const mergeChatRooms = useCallback((newChatRooms) => {
    const chatRoomsArray = Array.isArray(newChatRooms)
      ? newChatRooms
      : [newChatRooms];

    setChatRooms((prevChatRooms) => {
      const updatedRooms = [...prevChatRooms];

      chatRoomsArray.forEach((newRoom) => {
        const existingRoomIndex = updatedRooms.findIndex(
          (room) => room.id === newRoom.id
        );

        if (existingRoomIndex !== -1) {
          updatedRooms[existingRoomIndex] = {
            ...updatedRooms[existingRoomIndex],
            ...newRoom,
          };
        } else {
          updatedRooms.push(newRoom);
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
