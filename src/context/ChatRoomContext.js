import React, { createContext, useContext, useState } from "react";

const ChatRoomContext = createContext();

export const ChatRoomProvider = ({ children }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [messages, setMessages] = useState({});

  // Function to merge new chat rooms or update existing ones
  const mergeChatRooms = (newChatRooms) => {
    setChatRooms((prevChatRooms) => {
      const updatedRooms = [...prevChatRooms];

      newChatRooms.forEach((newRoom) => {
        const existingRoomIndex = updatedRooms.findIndex(
          (room) => room.id === newRoom.id
        );

        if (existingRoomIndex !== -1) {
          // Update existing chat room
          updatedRooms[existingRoomIndex] = {
            ...updatedRooms[existingRoomIndex],
            ...newRoom,
          };
        } else {
          // Add new chat room
          updatedRooms.push(newRoom);
        }
      });

      return updatedRooms;
    });
  };

  // Function to update messages for a specific chat room
  const addMessageToRoom = (chatRoomId, message) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [chatRoomId]: [...(prevMessages[chatRoomId] || []), message],
    }));

    // Update the latest message in the chat rooms
    setChatRooms((prevChatRooms) =>
      prevChatRooms.map((chatRoom) =>
        chatRoom.id === chatRoomId
          ? { ...chatRoom, latestMessage: message }
          : chatRoom
      )
    );
  };

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
