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
import { useNavigate } from "react-router-dom";

const ChatRoomContext = createContext();

export const ChatRoomProvider = ({ children }) => {
  const { isInactive } = usePageActivity();
  const [chatRooms, setChatRooms] = useState(new Map());
  const [messages, setMessages] = useState({});
  const {
    updateLastSeen,
    saveLastSeen,
    markChatRoomActive,
    markChatRoomInactive,
  } = useRedis();
  const { userId, username, isLogin, activeChatRoomId, setActiveChatRoomId } =
    useUser();
  const handleMarkAllMessagesRead = useMarkAllMessagesRead(
    activeChatRoomId,
    userId
  );
  const handleMarkAllMessagesDelivered = useMarkAllMessagesDelivered(userId);
  const prevChatRoomIdRef = useRef(null);
  const deliveredRef = useRef(false);

  const updateChatRoomWithOnlineUsers = (chatRoomId, onlineUsers) => {
    setChatRooms((prevChatRooms) => {
      const updatedChatRooms = new Map(prevChatRooms);

      const prevChatRoomId = prevChatRoomIdRef.current;
      if (prevChatRoomId) {
        const prevRoom = updatedChatRooms.get(prevChatRoomId);
        if (prevRoom) {
          const updatedOnlineUsers = new Set();
          updatedOnlineUsers.add(username);
          updatedChatRooms.set(prevChatRoomId, {
            ...prevRoom,
            onlineUsers: updatedOnlineUsers,
          });
        }
      }

      // Update the current chat room
      const updatedRoom = updatedChatRooms.get(chatRoomId);
      if (updatedRoom) {
        updatedChatRooms.set(chatRoomId, {
          ...updatedRoom,
          onlineUsers: onlineUsers,
        });
      }

      return updatedChatRooms;
    });
  };

  useEffect(() => {
    if (!userId || !isLogin) {
      return;
    }

    const activeChatRoomId = localStorage.getItem("activeChatRoom");
    const timestamp = new Date().toISOString();
    if (!isInactive) {
      saveLastSeen(userId, timestamp, activeChatRoomId);
      if (!deliveredRef.current) {
        handleMarkAllMessagesDelivered();
        deliveredRef.current = true;
      }

      if (activeChatRoomId !== null) {
        markChatRoomActive(activeChatRoomId, userId);
        const chatRoom = chatRooms.get(activeChatRoomId);
        if (chatRoom?.unreadMessageCount > 0) {
          handleMarkAllMessagesRead();
        }
      }
    } else {
      updateLastSeen(userId, activeChatRoomId);
      if (activeChatRoomId !== null) {
        markChatRoomInactive(activeChatRoomId, userId);
      }
      setActiveChatRoomId(null);
      deliveredRef.current = false;
    }
  }, [isInactive, isLogin]);

  // Effect for marking a chat room read when switching between rooms
  useEffect(() => {
    if (prevChatRoomIdRef.current === null) {
      return;
    }
    markChatRoomRead(prevChatRoomIdRef.current);
  }, [activeChatRoomId]);

  // Mark a chat room as read
  const markChatRoomRead = (chatRoomId) => {
    const chatRoom = chatRooms.get(chatRoomId);
    setChatRooms((prevChatRooms) => {
      const newChatRooms = new Map(prevChatRooms);
      newChatRooms.set(chatRoomId, {
        ...chatRoom,
        unreadMessageCount: 0,
      });
      return newChatRooms;
    });
  };

  // useEffect for marking active chat rooms and updating online users
  useEffect(() => {
    if (activeChatRoomId !== null) {
      if (
        chatRooms &&
        chatRooms.get(activeChatRoomId)?.unreadMessageCount > 0
      ) {
        handleMarkAllMessagesRead();
      }

      (async () => {
        const onlineUsers = await markChatRoomActive(
          activeChatRoomId,
          userId,
          prevChatRoomIdRef.current
        );
        updateChatRoomWithOnlineUsers(activeChatRoomId, onlineUsers);
      })();
    }

    prevChatRoomIdRef.current = activeChatRoomId;
  }, [activeChatRoomId, userId]);

  // Function to merge new chat rooms with the current list
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

  // Function to add a message to a specific chat room
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
        markChatRoomRead,
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
