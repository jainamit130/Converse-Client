import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useChatRoom } from "./ChatRoomContext";
import { useUser } from "./UserContext";
import { usePageActivity } from "./PageActivityContext";
import { sortChatRooms } from "../util/chatUtil";
import config from "../config/environment";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);
  const {
    addMessageToRoom,
    updateDeletedMessage,
    exitGroup,
    memberLeft,
    mergeChatRooms,
    messages,
    setMessages,
    chatRooms,
    setChatRooms,
  } = useChatRoom();

  const { userId, activeChatRoomId } = useUser();
  const { isInactive } = usePageActivity();
  const [connected, setConnected] = useState(false);
  const subscriptions = useRef({});

  const typingTimeoutRef = useRef(null);

  const initializeWebSocket = () => {
    const token = localStorage.getItem("authenticationToken");
    const socket = new SockJS(`${config.CHAT_BASE_URL}/ws?token=${token}`);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      setStompClient(client);
      setConnected(true);
    });

    return client;
  };

  useEffect(() => {
    if (!isInactive && !connected) {
      const client = initializeWebSocket();
      setStompClient(client);
    }
  }, [isInactive]);

  const resetWebSocketContext = () => {
    subscriptions.current = {};
    setMessages({});
    setChatRooms(new Map());
    setConnected(false);
    if (stompClient) {
      stompClient.disconnect();
      setStompClient(null);
    }
  };

  const handleTyping = (chatRoomId, event) => {
    clearTimeout(typingTimeoutRef.current);

    const isCharacterKey =
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.metaKey;

    if (isCharacterKey) {
      const username = localStorage.getItem("username");
      stompClient.send(`/app/typing/${chatRoomId}`, {}, username);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping(chatRoomId);
    }, 1000);
  };

  const handleStopTyping = (chatRoomId) => {
    const username = localStorage.getItem("username");
    stompClient.send(`/app/stopTyping/${chatRoomId}`, {}, username);
  };

  useEffect(() => {
    return () => {
      clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (stompClient && connected) {
      const userId = localStorage.getItem("userId");
      if (userId) {
        subscribeToUser(userId, (message) => {
          mergeChatRooms(message);
        });
      }
    }
  }, [stompClient, connected]);

  useEffect(() => {
    if (stompClient && connected) {
      let unsubscribeFromOnlineStatus;
      if (activeChatRoomId) {
        unsubscribeFromOnlineStatus = subscribeToOnlineStatus(activeChatRoomId);
      }

      return () => {
        if (unsubscribeFromOnlineStatus) {
          unsubscribeFromOnlineStatus();
        }
      };
    }
  }, [stompClient, connected, activeChatRoomId]);

  const subscribeToOnlineStatus = (chatRoomId) => {
    const onlineStatusSubscription = stompClient.subscribe(
      `/topic/online/${chatRoomId}`,
      (message) => {
        const onlineUsers = JSON.parse(message.body);
        setChatRooms((prevChatRooms) => {
          const updatedChatRooms = new Map(prevChatRooms);
          const chatRoom = updatedChatRooms.get(chatRoomId);

          if (chatRoom) {
            const updatedOnlineUsers = chatRoom.onlineUsers || new Set();
            if (onlineUsers.status === "ONLINE") {
              updatedOnlineUsers.add(onlineUsers.username);
            } else if (onlineUsers.status === "OFFLINE") {
              updatedOnlineUsers.delete(onlineUsers.username);
            }
            updatedChatRooms.set(chatRoomId, {
              ...chatRoom,
              onlineUsers: updatedOnlineUsers,
              ...(chatRoom.chatRoomType === "INDIVIDUAL" && { lastSeen: null }),
            });
          }

          return updatedChatRooms;
        });
      }
    );

    return () => {
      onlineStatusSubscription.unsubscribe();
    };
  };

  useEffect(() => {
    if (stompClient && connected) {
      chatRooms.forEach((chatRoom) => {
        if (!chatRoom?.isExited) subscribeToChatRoom(chatRoom.id);
      });
    }
  }, [stompClient, connected, chatRooms]);

  const subscribeToUser = (userId) => {
    stompClient.subscribe(`/topic/user/${userId}`, (message) => {
      const chatRoom = JSON.parse(message.body);
      const updatedChatRoom =
        chatRoom.latestMessage?.senderId === userId &&
        chatRoom.unreadMessageCount === 1
          ? { ...chatRoom, unreadMessageCount: 0 }
          : chatRoom;
      mergeChatRooms(updatedChatRoom);
    });
  };

  const subscribeToChatRoom = (chatRoomId) => {
    if (!subscriptions.current[chatRoomId]) {
      subscriptions.current[chatRoomId] = {
        count: 0,
        unsubscribeChat: null,
        unsubscribeTyping: null,
        unsubscribeMessageStatus: null,
      };
    }

    const subscriptionData = subscriptions.current[chatRoomId];
    subscriptionData.count += 1;

    if (!subscriptionData.unsubscribeChat) {
      const chatSubscription = stompClient.subscribe(
        `/topic/chat/${chatRoomId}`,
        (message) => {
          const parsedMessage = JSON.parse(message.body);
          const chatMessage = parsedMessage.message;
          const elementId = parsedMessage.id;
          const messageType = parsedMessage.type;

          if (messageType === "MESSAGE") {
            addMessageToRoom(chatRoomId, chatMessage);

            setChatRooms((prevChatRooms) => {
              const updatedRooms = new Map(prevChatRooms);
              const existingRoom = updatedRooms.get(chatRoomId);
              const activeChatRoom = localStorage.getItem("activeChatRoom");

              if (existingRoom) {
                const unreadMessageCount =
                  (chatMessage.type === "MESSAGE" &&
                    activeChatRoom !== chatRoomId &&
                    userId !== chatMessage.senderId) ||
                  isInactive
                    ? existingRoom.unreadMessageCount + 1
                    : 0;

                const updatedRoom = {
                  ...existingRoom,
                  latestMessage: chatMessage,
                  unreadMessageCount: unreadMessageCount,
                };

                updatedRooms.set(chatRoomId, updatedRoom);
              }
              const sortedRooms = sortChatRooms(updatedRooms);
              return sortedRooms;
            });
          } else if (messageType === "DELETE") {
            updateDeletedMessage(chatRoomId, elementId, false);
          } else if (messageType === "EXIT") {
            if (userId === elementId) {
              if (subscriptionData.unsubscribeChat) {
                subscriptionData.unsubscribeChat();
                subscriptionData.unsubscribeChat = null;
              }
              if (subscriptionData.unsubscribeTyping) {
                subscriptionData.unsubscribeTyping();
                subscriptionData.unsubscribeTyping = null;
              }
              if (subscriptionData.unsubscribeMessageStatus) {
                subscriptionData.unsubscribeMessageStatus();
                subscriptionData.unsubscribeMessageStatus = null;
              }

              delete subscriptions.current[chatRoomId];
              exitGroup(chatRoomId);
            }
            memberLeft(chatRoomId, elementId);
          }
        }
      );

      subscriptionData.unsubscribeChat = () => chatSubscription.unsubscribe();
    }

    if (!subscriptionData.unsubscribeTyping) {
      const typingSubscription = stompClient.subscribe(
        `/topic/typing/${chatRoomId}`,
        (message) => {
          const listOfTypingUsers = JSON.parse(message.body);

          setChatRooms((prevChatRooms) => {
            const updatedChatRooms = new Map(prevChatRooms);
            const chatRoom = updatedChatRooms.get(chatRoomId);

            if (chatRoom) {
              updatedChatRooms.set(chatRoomId, {
                ...chatRoom,
                typingUsers: listOfTypingUsers,
              });
            }

            return updatedChatRooms;
          });
        }
      );

      subscriptionData.unsubscribeTyping = () =>
        typingSubscription.unsubscribe();
    }

    if (!subscriptionData.unsubscribeMessageStatus) {
      const messageStatusSubscription = stompClient.subscribe(
        `/topic/message/${userId}`,
        (message) => {
          const statusUpdate = JSON.parse(message.body);
          const messageIdsToUpdate = new Set(statusUpdate.messageIds);

          setChatRooms((prevChatRooms) => {
            const updatedChatRooms = new Map(prevChatRooms);
            const chatRoom = updatedChatRooms.get(statusUpdate.chatRoomId);

            if (
              chatRoom &&
              chatRoom.latestMessage &&
              messageIdsToUpdate.has(chatRoom.latestMessage.id)
            ) {
              updatedChatRooms.set(statusUpdate.chatRoomId, {
                ...chatRoom,
                latestMessage: {
                  ...chatRoom.latestMessage,
                  status: statusUpdate.isDelivered ? "DELIVERED" : "READ",
                },
              });
            }

            return updatedChatRooms;
          });

          setMessages((prevMessages) => {
            const updatedMessages = { ...prevMessages };

            const chatRoomMessages =
              updatedMessages[statusUpdate.chatRoomId] || [];

            const updatedChatRoomMessages = chatRoomMessages.map((msg) => {
              if (messageIdsToUpdate.size === 0) {
                return msg;
              }

              if (messageIdsToUpdate.has(msg.id)) {
                messageIdsToUpdate.delete(msg.id);
                return {
                  ...msg,
                  status: statusUpdate.isDelivered ? "DELIVERED" : "READ",
                };
              }

              return msg;
            });

            updatedMessages[statusUpdate.chatRoomId] = updatedChatRoomMessages;

            return updatedMessages;
          });
        }
      );

      subscriptionData.unsubscribeMessageStatus = () =>
        messageStatusSubscription.unsubscribe();
    }

    return () => {
      subscriptionData.count -= 1;
      if (subscriptionData.count === 0) {
        if (subscriptionData.unsubscribeChat) {
          subscriptionData.unsubscribeChat();
          subscriptionData.unsubscribeChat = null;
        }
        if (subscriptionData.unsubscribeTyping) {
          subscriptionData.unsubscribeTyping();
          subscriptionData.unsubscribeTyping = null;
        }
      }
    };
  };

  const unsubscribeChatRoom = (chatRoomId) => {
    const subscriptionData = subscriptions.current[chatRoomId];

    if (subscriptionData) {
      if (subscriptionData.unsubscribeChat) {
        subscriptionData.unsubscribeChat();
        subscriptionData.unsubscribeChat = null;
      }
      if (subscriptionData.unsubscribeTyping) {
        subscriptionData.unsubscribeTyping();
        subscriptionData.unsubscribeTyping = null;
      }
      if (subscriptionData.unsubscribeMessageStatus) {
        subscriptionData.unsubscribeMessageStatus();
        subscriptionData.unsubscribeMessageStatus = null;
      }

      delete subscriptions.current[chatRoomId];
    }
  };

  const sendMessage = (destination, body) => {
    if (stompClient && connected) {
      stompClient.send(destination, {}, JSON.stringify(body));
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        subscribeToChatRoom,
        sendMessage,
        subscribeToUser,
        connected,
        handleStopTyping,
        handleTyping,
        unsubscribeChatRoom,
        typingTimeoutRef,
        resetWebSocketContext,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
