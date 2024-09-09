import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useRedis from "../hooks/useRedis";
import { useUser } from "./UserContext";
import { useMarkAllMessagesRead } from "../hooks/useMarkAllMessages";

const ChatRoomContext = createContext();

export const ChatRoomProvider = ({ children }) => {
  const [chatRooms, setChatRooms] = useState(new Map());
  const [messages, setMessages] = useState({});
  const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);
  const { markChatRoomActive, markChatRoomInactive } = useRedis();
  const { userId } = useUser();
  const handleMarkAllMessagesRead = useMarkAllMessagesRead(
    selectedChatRoomId,
    userId
  );
  const prevChatRoomIdRef = useRef(null);

  useEffect(() => {
    console.log(messages);
  }, [messages[selectedChatRoomId]]);

  useEffect(() => {
    if (prevChatRoomIdRef.current !== null) {
      markChatRoomInactive(prevChatRoomIdRef.current, userId);
    }

    if (selectedChatRoomId !== null) {
      markChatRoomActive(selectedChatRoomId, userId);
    }

    prevChatRoomIdRef.current = selectedChatRoomId;
  }, [selectedChatRoomId, userId]);

  const mergeChatRooms = useCallback((newChatRooms) => {
    let chatRoomsArray = [];

    if (Array.isArray(newChatRooms)) {
      chatRoomsArray = newChatRooms.map((room) => ({
        ...room,
        typingUsers: [],
      }));
    } else {
      chatRoomsArray = [
        {
          ...newChatRooms,
          typingUsers: [],
        },
      ];
    }

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
        selectedChatRoomId,
        setSelectedChatRoomId,
      }}
    >
      {children}
    </ChatRoomContext.Provider>
  );
};

export const useChatRoom = () => useContext(ChatRoomContext);
