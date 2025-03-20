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
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const { initWebSocket, closeWebSocket } = useWebSocket();

  const onMessage = (messageData) => {
    switch (messageData.type) {
      case NotificationType.NEW_CHAT:
        handleNewChatNotification(messageData);
        break;
      case NotificationType.MESSAGE_MARKED:
        handleMessageMarkedNotification(messageData);
        break;
      default:
        console.error("Unknown message type:", messageData.type);
        break;
    }
  };

  useEffect(() => {
    if (userId) {
      initWebSocket(`/topic/user/${userId}`, onMessage);
    }

    return () => {
      closeWebSocket();
    };
  }, [userId]);

  return (
    <UserWebSocketContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserWebSocketContext.Provider>
  );
};
