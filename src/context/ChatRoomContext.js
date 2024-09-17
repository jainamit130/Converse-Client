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
import {
  useMarkAllMessagesDelivered,
  useMarkAllMessagesRead,
} from "../hooks/useMarkAllMessages";
import { usePageActivity } from "./PageActivityContext";

const ChatRoomContext = createContext();

export const ChatRoomProvider = ({ children }) => {
  const { isInactive } = usePageActivity();
  const [chatRooms, setChatRooms] = useState(new Map());
  const [messages, setMessages] = useState({});
  const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);
  const { markChatRoomActive, markChatRoomInactive } = useRedis();
  const { userId, isLogin } = useUser();
  const handleMarkAllMessagesRead = useMarkAllMessagesRead(
    selectedChatRoomId,
    userId
  );
  const handleMarkAllMessagesDelivered = useMarkAllMessagesDelivered(userId);
  const prevChatRoomIdRef = useRef(null);

  const deliveredRef = useRef(false);

  useEffect(() => {
    if (!userId) {
      return;
    }

    if (!isInactive) {
      if (!deliveredRef.current) {
        handleMarkAllMessagesDelivered();
        deliveredRef.current = true;
      }
    } else {
      deliveredRef.current = false;
    }

    if (selectedChatRoomId !== null) {
      markChatRoomActive(selectedChatRoomId, userId);
      if (chatRooms.get(selectedChatRoomId)?.unreadMessageCount > 0)
        handleMarkAllMessagesRead();
    } else if (selectedChatRoomId !== null) {
      markChatRoomInactive(selectedChatRoomId, userId);
    }
  }, [isInactive]);

  useEffect(() => {
    if (prevChatRoomIdRef.current !== null) {
      markChatRoomInactive(prevChatRoomIdRef.current, userId);
    }

    if (selectedChatRoomId !== null) {
      if (
        chatRooms &&
        chatRooms.get(selectedChatRoomId).unreadMessageCount > 0
      ) {
        handleMarkAllMessagesRead();
      }
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
      const updatedRooms = new Map(prevChatRooms);

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
