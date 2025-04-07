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
  chatRooms: new Map(),
  messages: new Map(),
  setChatRooms: () => {},
  setMessages: () => {},
});

export const useChatRoomWebSocket = () => useContext(ChatRoomWebSocketContext);

export const ChatRoomWebSocketProvider = ({ children }) => {
  const [baseTopic] = useState("/app/chat/");
  const [chatRooms, setChatRooms] = useState(new Map());
  const [messages, setMessages] = useState(new Map());
  const { initWebSocket, closeWebSocket, sendMessage } = useWebSocket();

  const send = (subTopic, message) => {
    const activeChatRoomId = localStorage.getItem("activeChatRoomId");
    if (activeChatRoomId) {
      const topic = baseTopic + subTopic + activeChatRoomId;
      sendMessage(topic, message);
    }
  };

  const onMessage = (messageData) => {
    switch (messageData.notificationType) {
      case NotificationType.MESSAGE:
        handleMessageNotification(
          messageData,
          chatRooms,
          setChatRooms,
          setMessages
        );
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
        console.error("Unknown message type:", messageData);
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
  }, [chatRooms]);

  return (
    <ChatRoomWebSocketContext.Provider
      value={{ chatRooms, messages, setChatRooms, setMessages, send }}
    >
      {children}
    </ChatRoomWebSocketContext.Provider>
  );
};
