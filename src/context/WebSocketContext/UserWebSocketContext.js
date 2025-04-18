import React, { createContext, useContext, useState, useEffect } from "react";
import {
  handleMessageMarkedNotification,
  handleNewChatNotification,
} from "../../handlers/notification/user/NotificationHandlers";
import { NotificationType } from "../../components/MappingTypes/NotificationTypes";
import useWebSocket from "../../hooks/WebSocketHook";

const UserWebSocketContext = createContext({
  userId: null,
  setUserId: () => {},
});

export const useUserWebSocket = () => useContext(UserWebSocketContext);

export const UserWebSocketProvider = ({ children }) => {
  const [userId, setUserId] = useState();
  const { initWebSocket, closeWebSocket } = useWebSocket();

  const onMessage = (messageData) => {
    switch (messageData.notificationType) {
      case NotificationType.NEW_CHAT:
        handleNewChatNotification(messageData);
        break;
      case NotificationType.MESSAGE_MARKED:
        handleMessageMarkedNotification(messageData);
        break;
      default:
        console.error("Unknown message type:", messageData);
        break;
    }
  };

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
