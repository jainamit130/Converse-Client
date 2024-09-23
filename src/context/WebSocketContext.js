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

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);
  const {
    addMessageToRoom,
    mergeChatRooms,
    chatRooms,
    setChatRooms,
    selectedChatRoomId,
  } = useChatRoom();
  const { userId } = useUser();
  const { isInactive } = usePageActivity();
  const [connected, setConnected] = useState(false);
  const subscriptions = useRef({});

  const typingTimeoutRef = useRef(null);

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
    const token = localStorage.getItem("authenticationToken");
    const socket = new SockJS(`http://localhost:8080/ws?token=${token}`);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      setStompClient(client);
      setConnected(true);
    });

    return () => {
      if (client) {
        client.disconnect();
      }
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
      chatRooms.forEach((chatRoom) => {
        subscribeToChatRoom(chatRoom.id);
      });
    }
  }, [stompClient, connected, chatRooms]);

  const subscribeToUser = (userId) => {
    stompClient.subscribe(`/topic/user/${userId}`, (message) => {
      const chatRoom = JSON.parse(message.body);
      mergeChatRooms(chatRoom);
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
          addMessageToRoom(chatRoomId, parsedMessage);

          setChatRooms((prevChatRooms) => {
            const updatedRooms = new Map(prevChatRooms);
            const existingRoom = updatedRooms.get(chatRoomId);

            if (existingRoom) {
              const unreadMessageCount =
                (selectedChatRoomId !== chatRoomId &&
                  userId !== parsedMessage.senderId) ||
                isInactive
                  ? existingRoom.unreadMessageCount + 1
                  : existingRoom.unreadMessageCount;

              const updatedRoom = {
                ...existingRoom,
                latestMessage: parsedMessage,
                unreadMessageCount: unreadMessageCount,
              };

              updatedRooms.set(chatRoomId, updatedRoom);
            }
            const sortedRooms = sortChatRooms(updatedRooms);
            console.log(sortedRooms);
            return sortedRooms;
          });
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
        typingTimeoutRef,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
