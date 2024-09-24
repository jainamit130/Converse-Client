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
import { sortChatRooms } from "../util/chatUtil";

const ChatRoomContext = createContext();

export const ChatRoomProvider = ({ children }) => {
  const { isInactive } = usePageActivity();
  const [chatRooms, setChatRooms] = useState(new Map());
  const [messages, setMessages] = useState({});
  const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);
  const {
    updateLastSeen,
    saveLastSeen,
    markChatRoomActive,
    markChatRoomInactive,
  } = useRedis();
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

    const timestamp = new Date().toISOString();
    if (!isInactive) {
      saveLastSeen(userId, timestamp, selectedChatRoomId);
      if (!deliveredRef.current) {
        handleMarkAllMessagesDelivered();
        deliveredRef.current = true;
      }
    } else {
      updateLastSeen(userId, selectedChatRoomId);
      deliveredRef.current = false;
    }

    if (selectedChatRoomId !== null) {
      markChatRoomActive(selectedChatRoomId, userId);
      const chatRoom = chatRooms.get(selectedChatRoomId);
      if (chatRoom?.unreadMessageCount > 0) {
        handleMarkAllMessagesRead();
      }
    } else if (selectedChatRoomId !== null) {
      markChatRoomInactive(selectedChatRoomId, userId);
    }
  }, [isInactive]);

  useEffect(() => {
    if (prevChatRoomIdRef.current === null) {
      return;
    }
    const chatRoom = chatRooms.get(prevChatRoomIdRef.current);
    markChatRoomRead(setChatRooms, prevChatRoomIdRef.current, chatRoom);
  }, [selectedChatRoomId]);

  const markChatRoomRead = (setChatRooms, prevChatRoomId, chatRoom) => {
    setChatRooms((prevChatRooms) => {
      const newChatRooms = new Map(prevChatRooms);
      newChatRooms.set(prevChatRoomId, {
        ...chatRoom,
        unreadMessageCount: 0,
      });
      return newChatRooms;
    });
  };

  useEffect(() => {
    if (selectedChatRoomId !== null) {
      if (
        chatRooms &&
        chatRooms.get(selectedChatRoomId).unreadMessageCount > 0
      ) {
        handleMarkAllMessagesRead();
      }
      markChatRoomActive(selectedChatRoomId, userId, prevChatRoomIdRef.current);
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

      const sortedRooms = sortChatRooms(updatedRooms);
      return sortedRooms;
    });
  }, []);

  const addMessageToRoom = useCallback(
    (chatRoomId, messageOrMessages, base = false) => {
      setMessages((prevMessages) => {
        const currentMessages = prevMessages[chatRoomId] || [];
        let updatedMessages;
        const chatRoom = chatRooms.get(chatRoomId);
        const messagesLoaded = chatRoom?.messagesLoaded;

        if (Array.isArray(messageOrMessages) && base && !messagesLoaded) {
          // If it's an array and base is true, append to the bottom
          updatedMessages = {
            ...prevMessages,
            [chatRoomId]: [...messageOrMessages, ...currentMessages],
          };

          // Set messages as loaded for this chat room
          setChatRooms((prevChatRooms) => {
            const updatedChatRoom = prevChatRooms.get(chatRoomId) || {};
            updatedChatRoom.messagesLoaded = true;

            const newChatRooms = new Map(prevChatRooms);
            newChatRooms.set(chatRoomId, updatedChatRoom);

            return newChatRooms;
          });
        } else if (!Array.isArray(messageOrMessages)) {
          // If it's a single message, prepend it to the top
          updatedMessages = {
            ...prevMessages,
            [chatRoomId]: [...currentMessages, messageOrMessages],
          };
        }

        return updatedMessages;
      });
    },
    [chatRooms]
  );

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
