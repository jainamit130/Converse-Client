import React, { useEffect, useState, useRef } from "react";
import { useQuery } from "@apollo/client";
import { GET_MESSAGES_OF_CHAT_ROOM } from "../graphql/queries";
import { useWebSocket } from "../context/WebSocketContext";
import { useUser } from "../context/UserContext";
import { useChatRoom } from "../context/ChatRoomContext";
import profileIcon from "../assets/profileIcon.webp";
import { parseDate, formatMessageDate, formatTime } from "../util/dateUtil.js";
import "./ChatRoom.css";
import TypingIndicator from "./TypingIndicator.js";
import ScrollToBottom from "../util/ScrollToBottom.js";
import { useMarkAllMessagesRead } from "../hooks/useMarkAllMessages.js";
import MessageInfoPanel from "./MessageInfoPanel";

const groupMessagesByDate = (messages, unreadMessageCount) => {
  let remainingMessages = messages.length - unreadMessageCount;
  return messages.reduce((acc, message) => {
    const messageDate = formatMessageDate(parseDate(message.timestamp));

    if (!acc[messageDate]) {
      acc[messageDate] = [];
    }

    if (remainingMessages === 0) {
      acc[messageDate].push({ unreadMarker: true });
    }
    remainingMessages--;
    acc[messageDate].push(message);
    return acc;
  }, {});
};

const ChatRoom = ({ chatRoomId, chatRoomName }) => {
  const { userId } = useUser();
  const { sendMessage, connected, handleStopTyping, handleTyping } =
    useWebSocket();
  const [message, setMessage] = useState("");
  const { messages, addMessageToRoom, chatRooms } = useChatRoom();
  const [chatRoomMessages, setChatRoomMessages] = useState(
    messages[chatRoomId] || []
  );
  const [typingUsers, setTypingUsers] = useState([]);
  const handleMarkAllMessagesRead = useMarkAllMessagesRead(chatRoomId, userId);
  const chatMessagesRef = useRef(null);
  const unreadMessageCount = chatRooms.get(chatRoomId)?.unreadMessageCount || 0;
  const groupedMessages = groupMessagesByDate(
    chatRoomMessages,
    unreadMessageCount
  );

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  useEffect(() => {
    setChatRoomMessages(messages[chatRoomId] || []);
    handleMarkAllMessagesRead();
  }, [messages[chatRoomId]]);

  useEffect(() => {
    const chatRoom = chatRooms.get(chatRoomId);
    if (chatRoom) {
      setTypingUsers(chatRoom.typingUsers || []);
    }
  }, [chatRooms, chatRoomId]);

  const chatRoom = chatRooms.get(chatRoomId);
  const messagesLoaded = chatRoom?.messagesLoaded || false;
  const fromCount = messages[chatRoomId]?.length || 0;
  const { loading, error, data } = useQuery(GET_MESSAGES_OF_CHAT_ROOM, {
    variables: { chatRoomId, fromCount },
    skip: !connected || messagesLoaded,
    fetchPolicy: "network-only",
  });

  const handleSendMessage = (messageContent) => {
    const newMessage = {
      id: `${Math.random()}`,
      content: messageContent,
      senderId: userId,
      chatRoomId,
      timestamp: new Date().toISOString(),
    };

    if (sendMessage) {
      sendMessage(`/app/chat/sendMessage/${chatRoomId}`, newMessage);
      setMessage("");
    }
  };

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [chatRoomId]);

  useEffect(() => {
    if (!data || !connected) return;
    addMessageToRoom(chatRoomId, data.getMessagesOfChatRoom, true);
  }, [data, connected, chatRoomId, addMessageToRoom]);

  const openMessageInfoPanel = (message) => {
    setSelectedMessage(message);
    setIsPanelOpen(true);
  };

  const closeMessageInfoPanel = () => {
    setIsPanelOpen(false);
    setSelectedMessage(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="chat-messages-section">
      <div className="chat-details">
        <img src={profileIcon} className="chatRoomIcon" />
        <div>
          <div className="chat-room-name">{chatRoomName}</div>
          <div className="typing-status">
            <TypingIndicator typingUsers={typingUsers} />
          </div>
        </div>
      </div>

      <div className="chat-messages" ref={chatMessagesRef}>
        {Object.entries(groupedMessages).map(([date, messages]) => (
          <div key={date}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="date-header">{date}</div>
            </div>
            {messages.map((message, index) => {
              if (message.unreadMarker) {
                return (
                  <div key={`unread-${date}-${index}`}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <div className="unread-message-marker">
                        {unreadMessageCount} Unread Messages
                      </div>
                    </div>
                    <div className="unread-message-line"></div>
                  </div>
                );
              }

              const messageDate = parseDate(message.timestamp);
              const formattedTime = formatTime(messageDate);

              return (
                <div
                  key={message.id}
                  className={`message ${
                    message.senderId === userId
                      ? "message-right"
                      : "message-left"
                  }`}
                  onClick={() => openMessageInfoPanel(message)}
                >
                  <div className="messageContent">{message.content}</div>
                  <div className="message-time">{formattedTime}</div>
                </div>
              );
            })}
          </div>
        ))}
        <ScrollToBottom />
      </div>
      <form
        onSubmit={(e) => {
          handleStopTyping(chatRoomId);
          e.preventDefault();
          const messageContent = e.target.elements.messageContent.value;
          handleSendMessage(messageContent);
          e.target.reset();
        }}
        className="chat-input"
      >
        <input
          onKeyDown={(event) => handleTyping(chatRoomId, event)}
          type="text"
          value={message}
          onChange={handleChange}
          style={{ outline: "None", border: "None" }}
          name="messageContent"
          placeholder="Type your message..."
          required
        />
        {message.trim().length > 0 && <button type="submit">Send</button>}
      </form>

      {isPanelOpen && (
        <MessageInfoPanel
          message={selectedMessage}
          onClose={closeMessageInfoPanel}
        />
      )}
    </div>
  );
};

export default ChatRoom;
