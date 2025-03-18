import React, { createContext, useContext, useState, useEffect } from "react";
import { useWebSocket } from "./useWebSocket";
import { handleMessageNotification } from "./messageNotificationHandler";
import { handleUserStatusNotification } from "./userStatusNotificationHandler";
import { handleTypingNotification } from "./typingNotificationHandler";
import { NotificationType } from "./NotificationTypes";

const ChatRoomWebSocketContext = createContext(null);

export const useChatRoomWebSocket = () => useContext(ChatRoomWebSocketContext);

export const ChatRoomWebSocketProvider = ({ children }) => {
  const [chatRooms, setChatRooms] = useState([]);

  const onMessage = (messageData) => {
    switch (messageData.type) {
      case NotificationType.MESSAGE:
        handleMessageNotification(messageData);
        break;
      case NotificationType.USER_STATUS:
        handleUserStatusNotification(messageData);
        break;
      case NotificationType.TYPING:
        handleTypingNotification(messageData);
        break;
      default:
        console.error("Unknown message type:", messageData.type);
        break;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authenticationToken") || "";
    chatRooms.forEach((chatRoomId) => {
      useWebSocket(
        `${config.CHAT_BASE_URL}`,
        `/topic/chat/${chatRoomId}`,
        onMessage
      );
    });
  }, [chatRooms]);

  return (
    <ChatRoomWebSocketContext.Provider value={{ chatRooms, setChatRooms }}>
      {children}
    </ChatRoomWebSocketContext.Provider>
  );
};
