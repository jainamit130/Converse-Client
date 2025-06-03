import React, { createContext, useContext, useState, useEffect } from "react";
import {
  handleMessageMarkedNotification,
  handleNewChatNotification,
} from "../../handlers/notification/user/NotificationHandlers";
import { NotificationType } from "../../components/MappingTypes/NotificationTypes";
import useWebSocket from "../../hooks/WebSocketHook";
import { useChatRoomContext } from "../ChatRoomContext";

const UserWebSocketContext = createContext({
  userId: null,
  setUserId: () => {},
});

export const useUserWebSocket = () => useContext(UserWebSocketContext);

export const UserWebSocketProvider = ({ children }) => {
  const [userId, setUserId] = useState();
  const { initWebSocket, closeWebSocket } = useWebSocket();
  const {
    messages,
    setMessages,
    setChatRooms,
    setDirectSelfChats,
    setActiveChatRoomId,
    setActiveChatRoomName,
    setActiveChatRoomType,
  } = useChatRoomContext();

  const onMessage = (messageData) => {
    switch (messageData.notificationType) {
      case NotificationType.NEW_CHAT:
        handleNewChatNotification(
          messageData,
          setChatRooms,
          setDirectSelfChats,
          setActiveChatRoomId,
          setActiveChatRoomName,
          setActiveChatRoomType
        );
        break;
      case NotificationType.MESSAGE_DELIVERED:
      case NotificationType.MESSAGE_READ:
        handleMessageMarkedNotification(messageData, setMessages, setChatRooms);
        break;
      default:
        console.error("Unknown message type:", messageData);
        break;
    }
  };

  useEffect(() => {
    console.log("messages in UserWebSocketProvider:", messages);
    console.log("setMessages in UserWebSocketProvider:", setMessages);
  }, []);

  useEffect(() => {
    const topic = `/topic/user/${userId}`;
    if (userId) initWebSocket(topic, onMessage);

    return () => closeWebSocket(topic);
  }, [userId]);

  return (
    <UserWebSocketContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserWebSocketContext.Provider>
  );
};
