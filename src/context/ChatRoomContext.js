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
  const [usernameToChatRoomMap, setUsernameToChatRoomMap] = useState(new Map());
  const {
    removeUserFromRedis,
    saveUserToRedis,
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

  const resetChatRoomContext = useCallback(() => {
    setChatRooms(new Map());
    setMessages({});
    setUsernameToChatRoomMap(new Map());
    setActiveChatRoomId(null);
  }, []);

  const updateChatRoomWithOnlineUsers = (chatRoomId, onlineUsers, lastSeen) => {
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
            ...(prevRoom.chatRoomType === "INDIVIDUAL" && { lastSeen }),
          });
        }
      }

      const updatedRoom = updatedChatRooms.get(chatRoomId);
      if (updatedRoom) {
        updatedChatRooms.set(chatRoomId, {
          ...updatedRoom,
          onlineUsers: onlineUsers,
          ...(updatedRoom.chatRoomType === "INDIVIDUAL" && { lastSeen }),
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

    if (!isInactive) {
      saveUserToRedis(userId, activeChatRoomId);
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
      removeUserFromRedis(userId, activeChatRoomId);
      setActiveChatRoomId(null);
      deliveredRef.current = false;
    }
  }, [isInactive, isLogin]);

  useEffect(() => {
    if (prevChatRoomIdRef.current === null) {
      return;
    }
    markChatRoomRead(prevChatRoomIdRef.current);
  }, [activeChatRoomId]);

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

  useEffect(() => {
    if (activeChatRoomId !== null) {
      if (
        chatRooms &&
        chatRooms.get(activeChatRoomId)?.unreadMessageCount > 0
      ) {
        handleMarkAllMessagesRead();
      }

      (async () => {
        const { onlineUsers, lastSeen } = await markChatRoomActive(
          activeChatRoomId,
          userId,
          prevChatRoomIdRef.current
        );
        updateChatRoomWithOnlineUsers(activeChatRoomId, onlineUsers, lastSeen);
      })();
    }

    prevChatRoomIdRef.current = activeChatRoomId;
  }, [activeChatRoomId, userId]);

  const mergeChatRooms = useCallback((newChatRooms) => {
    let chatRoomsArray = [];

    if (Array.isArray(newChatRooms)) {
      chatRoomsArray = newChatRooms.map((room) => ({
        ...room,
        typingUsers: [],
        lastSeen: null,
      }));
    } else {
      chatRoomsArray = [
        {
          ...newChatRooms,
          typingUsers: [],
          lastSeen: null,
        },
      ];
    }

    setChatRooms((prevChatRooms) => {
      const updatedRooms = new Map(prevChatRooms);
      const updatedUsernameMap = { ...usernameToChatRoomMap };

      chatRoomsArray.forEach((newRoom) => {
        const existingRoom = updatedRooms.get(newRoom.id);

        if (existingRoom) {
          updatedRooms.set(newRoom.id, { ...existingRoom, ...newRoom });
        } else {
          updatedRooms.set(newRoom.id, newRoom);
        }

        if (
          newRoom.chatRoomType === "INDIVIDUAL" ||
          newRoom.chatRoomType === "SELF"
        ) {
          newRoom.userIds.forEach((userId) => {
            if (!updatedUsernameMap[userId]) {
              updatedUsernameMap[userId] = newRoom.id;
            }
          });
        }
      });

      setUsernameToChatRoomMap(updatedUsernameMap);

      const sortedRooms = sortChatRooms(updatedRooms);
      return sortedRooms;
    });
  }, []);

  const updateDeletedMessage = (chatRoomId, messageId, isDeleted) => {
    setMessages((prevMessages) => {
      const currentMessages = prevMessages[chatRoomId] || [];

      if (isDeleted) {
        const updatedMessages = currentMessages.filter(
          (message) => message.id !== messageId
        );

        setChatRooms((prevChatRooms) => {
          const updatedChatRooms = new Map(prevChatRooms);
          const chatRoom = updatedChatRooms.get(chatRoomId);
          if (chatRoom && chatRoom?.latestMessage.id === messageId) {
            const nextLatestMessage = updatedMessages.length
              ? updatedMessages[updatedMessages.length - 1]
              : null;
            updatedChatRooms.set(chatRoomId, {
              ...chatRoom,
              latestMessage: nextLatestMessage,
            });
          }
          return updatedChatRooms;
        });

        return {
          ...prevMessages,
          [chatRoomId]: updatedMessages,
        };
      } else {
        const updatedMessages = currentMessages.map((message) => {
          if (message.id === messageId) {
            const newContent =
              message.senderId === userId
                ? "You deleted this message."
                : "This message has been deleted.";

            setChatRooms((prevChatRooms) => {
              const updatedChatRooms = new Map(prevChatRooms);
              const chatRoom = updatedChatRooms.get(chatRoomId);
              if (chatRoom && chatRoom.latestMessage?.id === messageId) {
                updatedChatRooms.set(chatRoomId, {
                  ...chatRoom,
                  latestMessage: {
                    ...chatRoom.latestMessage,
                    content:
                      userId === chatRoom.latestMessage.senderId
                        ? "You deleted this message."
                        : "This message has been deleted.",
                    deletedForEveryone: true,
                  },
                });
              }
              return updatedChatRooms;
            });

            return {
              ...message,
              content: newContent,
              deletedForEveryone: true,
            };
          }
          return message;
        });

        return {
          ...prevMessages,
          [chatRoomId]: updatedMessages,
        };
      }
    });
  };

  const addMessageToRoom = useCallback(
    (chatRoomId, messageOrMessages, base = false) => {
      setMessages((prevMessages) => {
        const currentMessages = prevMessages[chatRoomId] || [];
        let updatedMessages;
        const chatRoom = chatRooms.get(chatRoomId);
        const messagesLoaded = chatRoom?.messagesLoaded;

        if (Array.isArray(messageOrMessages) && base && !messagesLoaded) {
          updatedMessages = {
            ...prevMessages,
            [chatRoomId]: [...messageOrMessages, ...currentMessages],
          };

          setChatRooms((prevChatRooms) => {
            const updatedChatRoom = prevChatRooms.get(chatRoomId) || {};
            updatedChatRoom.messagesLoaded = true;

            const newChatRooms = new Map(prevChatRooms);
            newChatRooms.set(chatRoomId, updatedChatRoom);

            return newChatRooms;
          });
        } else if (!Array.isArray(messageOrMessages)) {
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
        setMessages,
        addMessageToRoom,
        updateDeletedMessage,
        usernameToChatRoomMap,
        mergeChatRooms,
        resetChatRoomContext,
      }}
    >
      {children}
    </ChatRoomContext.Provider>
  );
};

export const useChatRoom = () => useContext(ChatRoomContext);
