import React, { useEffect, useState, useRef } from "react";
import { useQuery } from "@apollo/client";
import { GET_MESSAGES_OF_CHAT_ROOM } from "../graphql/queries";
import { useWebSocket } from "../context/WebSocketContext";
import { useUser } from "../context/UserContext";
import { useChatRoom } from "../context/ChatRoomContext";
import { parseDate, formatMessageDate, formatTime } from "../util/dateUtil.js";
import "./ChatRoom.css";
import ScrollToBottom from "../util/ScrollToBottom.js";
import { useMarkAllMessagesRead } from "../hooks/useMarkAllMessages.js";
import MessageInfoPanel from "./MessageInfoPanel";
import { useNavigate } from "react-router-dom";
import ChatRoomHeader from "./ChatRoomHeader.js";
import MessageStatusIcon from "./MessageStatusIcon.js";

const groupMessagesByDate = (messages, unreadMessageCount) => {
  return messages.reduce((acc, message, index) => {
    const messageDate = formatMessageDate(parseDate(message.timestamp));

    if (!acc[messageDate]) {
      acc[messageDate] = [];
    }

    // Insert the marker before the first of the last few unread messages
    const markerIndex = messages.length - unreadMessageCount;
    if (index === markerIndex) {
      acc[messageDate].push({ unreadMarker: true });
    }

    acc[messageDate].push(message);
    return acc;
  }, {});
};

const ChatRoom = () => {
  const { userId, username, activeChatRoomId, activeChatRoomName } = useUser();
  const chatRoomId = activeChatRoomId;
  const chatRoomName = activeChatRoomName;
  const { sendMessage, connected, handleStopTyping, handleTyping } =
    useWebSocket();
  const [message, setMessage] = useState("");
  const { messages, addMessageToRoom, chatRooms, markChatRoomRead } =
    useChatRoom();
  const [chatRoomMessages, setChatRoomMessages] = useState(
    messages[chatRoomId] || []
  );
  const [chatRoomType, setChatRoomType] = useState(() => {
    return chatRooms.get(chatRoomId)?.chatRoomType;
  });
  const [recipientUsername, setRecipientUsername] = useState(() => {
    return chatRooms.get(chatRoomId)?.recipientUsername;
  });
  const [creatorUsername, setCreatorUsername] = useState(() => {
    return chatRooms.get(chatRoomId)?.creatorUsername;
  });
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const handleMarkAllMessagesRead = useMarkAllMessagesRead(chatRoomId, userId);
  const chatMessagesRef = useRef(null);
  const unreadMessageCount = chatRooms.get(chatRoomId)?.unreadMessageCount || 0;
  const groupedMessages = groupMessagesByDate(
    chatRoomMessages,
    unreadMessageCount
  );
  const navigate = useNavigate();

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  useEffect(() => {
    if (activeChatRoomId === null) {
      navigate("/chat-rooms");
    }
  }, [activeChatRoomId]);

  useEffect(() => {
    if (chatRoomId) {
      setChatRoomMessages(messages[chatRoomId] || []);
      handleMarkAllMessagesRead();
    }
  }, [messages[chatRoomId], chatRoomId]);

  useEffect(() => {
    if (chatRoomId) {
      const chatRoom = chatRooms.get(chatRoomId);
      if (chatRoom) {
        setTypingUsers(chatRoom.typingUsers || []);
        const filteredOnlineUsers = chatRoom.onlineUsers || new Set();
        filteredOnlineUsers.delete(username);
        setOnlineUsers(filteredOnlineUsers);
      }
    }
  }, [chatRooms, chatRoomId, userId]);

  const chatRoom = chatRooms.get(chatRoomId);
  const messagesLoaded = chatRoom?.messagesLoaded || false;
  const fromCount = messages[chatRoomId]?.length || 0;

  const { loading, error, data } = useQuery(GET_MESSAGES_OF_CHAT_ROOM, {
    variables: { chatRoomId, fromCount },
    skip: !chatRoomId || !connected || messagesLoaded,
    fetchPolicy: "network-only",
  });

  const handleSendMessage = (messageContent) => {
    if (!chatRoomId) return;
    const newMessage = {
      id: `${Math.random()}`,
      content: messageContent,
      senderId: userId,
      chatRoomId,
    };

    if (sendMessage) {
      sendMessage(`/app/chat/sendMessage/${chatRoomId}`, newMessage);
      setMessage("");
      markChatRoomRead(chatRoomId);
    }
  };

  useEffect(() => {
    if (chatRoomId && data && connected) {
      addMessageToRoom(chatRoomId, data.getMessagesOfChatRoom, true);
    }
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
    <div
      className="chat-messages-section"
      style={{ width: isPanelOpen ? "60.8%" : "100%" }}
    >
      <ChatRoomHeader
        key={chatRoomId}
        chatRoomName={
          chatRoomType === "INDIVIDUAL"
            ? recipientUsername === username
              ? creatorUsername
              : recipientUsername
            : chatRoomName
        }
        typingUsers={typingUsers}
        onlineUsers={onlineUsers}
        chatRoomType={chatRoomType}
      />

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
                  {
                    <MessageStatusIcon
                      key={message.id}
                      isSender={message.senderId === userId}
                      status={message.status}
                      formattedTime={formattedTime}
                    />
                  }
                </div>
              );
            })}
          </div>
        ))}
        <ScrollToBottom chatRoomId={chatRoomId} messages={chatRoomMessages} />
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
