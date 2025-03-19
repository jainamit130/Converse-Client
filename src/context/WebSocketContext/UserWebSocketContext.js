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
  const [userId, setUserId] = useState(null);

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

  const useWebSooketHook = () => {
    useWebSocket(`/topic/user/${userId}`, onMessage);
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      useWebSooketHook();
    }
  }, []);

  return (
    <UserWebSocketContext.Provider value={{ userId }}>
      {children}
    </UserWebSocketContext.Provider>
  );
};
