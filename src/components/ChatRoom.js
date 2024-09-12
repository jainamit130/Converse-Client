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
import useRedis from "../hooks/useRedis.js";

const groupMessagesByDate = (messages) => {
  return messages.reduce((acc, message) => {
    const messageDate = formatMessageDate(parseDate(message.timestamp));

    if (!acc[messageDate]) {
      acc[messageDate] = [];
    }

    acc[messageDate].push(message);
    return acc;
  }, {});
};

const ChatRoom = ({ chatRoomId, chatRoomName }) => {
  const { userId } = useUser();
  const { sendMessage, connected, handleStopTyping, handleTyping } =
    useWebSocket();
  const [message, setMessage] = useState("");
  const { messages, addMessageToRoom, chatRooms, selectedChatRoomId } =
    useChatRoom();
  const [chatRoomMessages, setChatRoomMessages] = useState(
    messages[chatRoomId] || []
  );
  const [typingUsers, setTypingUsers] = useState([]);
  const handleMarkAllMessagesRead = useMarkAllMessagesRead(chatRoomId, userId);
  const chatMessagesRef = useRef(null);
  const groupedMessages = groupMessagesByDate(chatRoomMessages);
  const unreadMessageCount = chatRooms.get(chatRoomId)?.unreadMessageCount || 0;

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  useEffect(() => {
    setChatRoomMessages(messages[chatRoomId] || []);
    if (chatRooms && chatRooms.get(selectedChatRoomId).unreadMessageCount > 0)
      handleMarkAllMessagesRead();
  }, [messages[chatRoomId]]);

  useEffect(() => {
    const chatRoom = chatRooms.get(chatRoomId);
    if (chatRoom) {
      setTypingUsers(chatRoom.typingUsers || []);
    }
  }, [chatRooms, chatRoomId]);

  const { loading, error, data } = useQuery(GET_MESSAGES_OF_CHAT_ROOM, {
    variables: { chatRoomId },
    skip: !connected,
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
    data.getMessagesOfChatRoom.forEach((chatMessage) =>
      addMessageToRoom(chatRoomId, chatMessage, true)
    );
  }, [data, connected, chatRoomId, addMessageToRoom]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="chat-section">
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
        {/* Display unread message count */}
        {unreadMessageCount > 0 && (
          <div className="unread-message-count">
            {unreadMessageCount} Unread Messages
          </div>
        )}

        {Object.entries(groupedMessages).map(([date, messages]) => (
          <div key={date}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="date-header">{date}</div>
            </div>
            {messages.map((message) => {
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
    </div>
  );
};

export default ChatRoom;
