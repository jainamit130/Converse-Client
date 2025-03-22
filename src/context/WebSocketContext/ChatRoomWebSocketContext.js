import React, { createContext, useContext, useState, useEffect } from "react";
import useWebSocket from "../../hooks/WebSocketHook";
import {
  handleUserStatusNotification,
  handleTypingNotification,
  handleChatTransactionNotification,
  handleMessageNotification,
  handleMessageDeletedNotification,
} from "../../handlers/notification/chatRoom/NotificationHandlers";
import { NotificationType } from "../../components/MappingTypes/NotificationTypes";

const ChatRoomWebSocketContext = createContext({
  chatRooms: [],
  setChatRooms: () => {},
});

export const useChatRoomWebSocket = () => useContext(ChatRoomWebSocketContext);

export const ChatRoomWebSocketProvider = ({ children }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const { initWebSocket, closeWebSocket } = useWebSocket();

  const onMessage = (messageData) => {
    switch (messageData.type) {
      case NotificationType.MESSAGE:
        handleMessageNotification(messageData);
        break;
      case NotificationType.STATUS:
        handleUserStatusNotification(messageData);
        break;
      case NotificationType.TYPING:
        handleTypingNotification(messageData);
        break;
      case NotificationType.MESSAGE_DELETED:
        handleMessageDeletedNotification(messageData);
        break;
      case NotificationType.TRANSACTION:
        handleChatTransactionNotification(messageData);
        break;
      default:
        console.error("Unknown message type:", messageData.type);
        break;
    }
  };

  useEffect(() => {
    chatRooms.forEach((chatRoom) => {
      initWebSocket(`/topic/chat/${chatRoom.id}`, onMessage);
    });

    return () => {
      chatRooms.forEach((chatRoom) => {
        closeWebSocket(`/topic/chat/${chatRoom.id}`);
      });
    };
  }, [chatRooms, initWebSocket, closeWebSocket]);

  return (
    <ChatRoomWebSocketContext.Provider value={{ chatRooms, setChatRooms }}>
      {children}
    </ChatRoomWebSocketContext.Provider>
  );
};
