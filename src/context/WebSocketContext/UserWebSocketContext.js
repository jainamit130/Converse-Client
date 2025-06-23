import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  handleExitChatNotification,
  handleMessageMarkedNotification,
  handleNewChatNotification,
} from "../../handlers/notification/user/NotificationHandlers";
import { NotificationType } from "../../components/MappingTypes/NotificationTypes";
import useWebSocket from "../../hooks/WebSocketHook";
import { useChatRoomContext } from "../ChatRoomContext";
import { useChatRoomWebSocket } from "./ChatRoomWebSocketContext";

const UserWebSocketContext = createContext({
  userId: null,
  setUserId: () => {},
});

export const useUserWebSocket = () => useContext(UserWebSocketContext);

export const UserWebSocketProvider = ({ children }) => {
  const [userId, setUserId] = useState();
  const { handleIncomingMessage } = useChatRoomWebSocket();
  const { initWebSocket, closeWebSocket } = useWebSocket();
  const {
    messages,
    activeChatRoomId,
    setMessages,
    setChatRooms,
    setDirectSelfChats,
    setActiveChatRoomId,
    setActiveChatRoomName,
    setActiveChatRoomType,
    handleNewChatStatus,
  } = useChatRoomContext();
  const activeChatRoomIdRef = useRef(activeChatRoomId);

  const handleNewChat = (messageData) => {
    handleNewChatNotification(
      messageData,
      setChatRooms,
      setDirectSelfChats,
      setActiveChatRoomId,
      setActiveChatRoomName,
      setActiveChatRoomType,
      handleIncomingMessage,
      handleNewChatStatus,
      handleIncomingMessagesForActiveChat
    );
  };

  useEffect(() => {
    activeChatRoomIdRef.current = activeChatRoomId;
  }, [activeChatRoomId]);

  const handleIncomingMessagesForActiveChat = (messages, chatRoom) => {
    if (
      !chatRoom ||
      !chatRoom.id ||
      chatRoom.id !== activeChatRoomIdRef.current
    )
      return;

    setMessages((prevMessages) => {
      const existingMessages = prevMessages.get(chatRoom.id) || [];

      const lastExistingMessage = existingMessages[existingMessages.length - 1];

      const firstNewMessageIndex = messages.findIndex(
        (msg) => msg.timestamp > (lastExistingMessage?.timestamp ?? 0)
      );

      const nonDuplicateMessages =
        firstNewMessageIndex !== -1 ? messages.slice(firstNewMessageIndex) : [];

      const updatedMessages = [...existingMessages, ...nonDuplicateMessages];

      const newMessagesMap = new Map(prevMessages);
      newMessagesMap.set(chatRoom.id, updatedMessages);

      return newMessagesMap;
    });
  };

  const onMessage = (messageData) => {
    switch (messageData.notificationType) {
      case NotificationType.NEW_CHAT:
        handleNewChat(messageData);
        break;
      case NotificationType.EXITED_CHAT:
        handleExitChatNotification(messageData, handleNewChat);
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
