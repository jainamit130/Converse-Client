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
  const {
    messages,
    setMessages,
    chatRooms,
    setChatRooms,
    setTyping,
    setOnlineUsers,
    setLastSeen,
    activeChatRoomId,
  } = useChatRoomContext();
  const { initWebSocket, closeWebSocket, sendMessage } = useWebSocket();

  const activeChatRoomIdRef = useRef(activeChatRoomId);

  const handleIncomingMessage = (messageData) => {
    const currentActiveId = activeChatRoomIdRef.current;
    handleMessageNotification(
      messageData,
      setChatRooms,
      setMessages,
      currentActiveId
    );
  };

  useEffect(() => {
    activeChatRoomIdRef.current = activeChatRoomId;
  }, [activeChatRoomId]);

  const send = (subTopic, message) => {
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
        handleIncomingMessage(messageData);
        break;
      case NotificationType.STATUS:
        handleUserStatusNotification(messageData, setOnlineUsers, setLastSeen);
        break;
      case NotificationType.TYPING:
        handleTypingNotification(messageData, setTyping);
        break;
      case NotificationType.MESSAGE_DELETED:
        handleMessageDeletedNotification(
          messageData,
          setChatRooms,
          setMessages
        );
        break;
      case NotificationType.TRANSACTION:
        handleChatTransactionNotification(messageData, handleIncomingMessage);
        break;
      default:
        console.error("Unknown message type:", messageData);
        break;
    }
  };

  const prevChatRoomIds = useRef(new Set());

  useEffect(() => {
    const filteredChatRooms = new Map(
      [...chatRooms.entries()].filter(
        ([id, room]) => !room.members?.some((member) => member.isExited)
      )
    );

    const currentIds = new Set(filteredChatRooms.keys());

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
    <ChatRoomWebSocketContext.Provider value={{ send, handleIncomingMessage }}>
      {children}
    </ChatRoomWebSocketContext.Provider>
  );
};
