import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import useWebSocket, { clients } from "../../hooks/WebSocketHook";
import {
  handleUserStatusNotification,
  handleTypingNotification,
  handleChatTransactionNotification,
  handleMessageNotification,
  handleMessageDeletedNotification,
} from "../../handlers/notification/chatRoom/NotificationHandlers";
import { NotificationType } from "../../components/MappingTypes/NotificationTypes";
import { useChatRoomContext } from "../ChatRoomContext";

const ChatRoomWebSocketContext = createContext();

export const useChatRoomWebSocket = () => useContext(ChatRoomWebSocketContext);

export const ChatRoomWebSocketProvider = ({ children }) => {
  const [baseTopic] = useState("/app/chat/");
  const { messages, setMessages, chatRooms, setChatRooms, setTyping } =
    useChatRoomContext();
  const [webSockets, setWebSockets] = useState(new Map());
  const { initWebSocket, closeWebSocket, sendMessage } = useWebSocket();

  const send = (subTopic, message) => {
    const activeChatRoomId = localStorage.getItem("activeChatRoomId");
    if (activeChatRoomId) {
      const topic = baseTopic + subTopic + activeChatRoomId;
      sendMessage(topic, message);
    }
  };

  const closeAllWebSockets = () => {
    [...clients.keys()].forEach(closeWebSocket);
    console.log("🧹 All WebSocket connections closed");
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
        handleTypingNotification(messageData, setTyping);
        break;
      case NotificationType.MESSAGE_DELETED:
        handleMessageDeletedNotification(
          messageData,
          chatRooms,
          setChatRooms,
          setMessages
        );
        break;
      case NotificationType.TRANSACTION:
        handleChatTransactionNotification(messageData);
        break;
      default:
        console.error("Unknown message type:", messageData);
        break;
    }
  };

  const prevChatRoomIds = useRef(new Set());

  useEffect(() => {
    const currentIds = new Set(chatRooms.keys());

    const hasChanged =
      currentIds.size !== prevChatRoomIds.current.size ||
      [...currentIds].some((id) => !prevChatRoomIds.current.has(id));

    if (!hasChanged) return;

    const currentTopics = new Set(
      [...currentIds].map((id) => `/topic/chat/${id}`)
    );
    const existingTopics = new Set(clients.keys());

    currentTopics.forEach((topic) => {
      if (!clients.has(topic)) {
        initWebSocket(topic, onMessage);
      }
    });

    existingTopics.forEach((topic) => {
      if (topic.startsWith("/topic/chat/") && !currentTopics.has(topic)) {
        closeWebSocket(topic);
      }
    });

    prevChatRoomIds.current = currentIds;
  }, [chatRooms]);

  return (
    <ChatRoomWebSocketContext.Provider value={{ send }}>
      {children}
    </ChatRoomWebSocketContext.Provider>
  );
};
