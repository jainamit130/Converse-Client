import React, { useEffect, useState, useRef } from "react";
import { useQuery } from "@apollo/client";
import { GET_MESSAGES_OF_CHAT_ROOM } from "../graphql/queries";
import { useWebSocket } from "../context/WebSocketContext";
import { useUser } from "../context/UserContext";
import { useChatRoom } from "../context/ChatRoomContext";
import {
  parseDate,
  formatMessageDate,
  formatTime,
  isMessageOlderThan15Minutes,
} from "../util/dateUtil.js";
import "./ChatRoom.css";
import ScrollToBottom from "../util/ScrollToBottom.js";
import { useMarkAllMessagesRead } from "../hooks/useMarkAllMessages.js";
import MessageInfoPanel from "./MessageInfoPanel";
import { useNavigate } from "react-router-dom";
import ChatRoomHeader from "./ChatRoomHeader.js";
import messageOptionsIcon from "../assets/messageOptions.png";
import MessageStatusIcon from "./MessageStatusIcon.js";
import OptionsDropdown from "./reusableComponents/OptionsDropdown.js";
import useDelete from "../hooks/useDelete.js";
import DeletedMessageStyle from "./reusableComponents/DeletedMessageStyle.js";

const groupMessagesByDate = (messages, unreadMessageCount) => {
  return messages.reduce((acc, message, index) => {
    const messageDate = formatMessageDate(parseDate(message.timestamp));

    if (!acc[messageDate]) {
      acc[messageDate] = [];
    }

    const markerIndex = messages.length - unreadMessageCount;
    if (index === markerIndex) {
      acc[messageDate].push({ unreadMarker: true });
    }

    acc[messageDate].push(message);
    return acc;
  }, {});
};

const ChatRoom = ({ handleCreateGroup, tempChatRoom, handleChatRoomClick }) => {
  const { userId, username, activeChatRoomId } = useUser();
  const [chatRoomId, setChatRoomId] = useState(activeChatRoomId);
  const { sendMessage, connected, handleStopTyping, handleTyping } =
    useWebSocket();
  const [message, setMessage] = useState("");
  const {
    messages,
    addMessageToRoom,
    chatRooms,
    markChatRoomRead,
    updateDeletedMessage,
  } = useChatRoom();
  const [chatRoomMessages, setChatRoomMessages] = useState(
    messages[chatRoomId] || []
  );
  const { handleDeleteMessageForEveryone, handleDeleteMessageForMe } =
    useDelete();
  const [isOpen, setIsOpen] = useState(null);
  const [options, setOptions] = useState(["Delete for me", "Message info"]);

  const toggleDropdown = (message) => {
    if (isOpen) {
      setIsOpen(null);
    } else {
      if (
        message.senderId === userId &&
        !message.deletedForEveryone &&
        !isMessageOlderThan15Minutes(message)
      ) {
        setOptions(["Delete for everyone", "Delete for me", "Message info"]);
      } else {
        setOptions(["Delete for me", "Message info"]);
      }
      setIsOpen(message.id);
    }
  };

  const handleSelectOption = async (option, message) => {
    if (option === "Message info") {
      openMessageInfoPanel(message);
    } else if (option === "Delete for everyone") {
      const isSuccess = await handleDeleteMessageForEveryone(message.id);
    } else if (option === "Delete for me") {
      const isSuccess = await handleDeleteMessageForMe(message.id);
      if (isSuccess) {
        updateDeletedMessage(chatRoomId, message.id, true);
      }
    }
    setIsOpen(null);
  };

  const [chatRoomType, setChatRoomType] = useState(() => {
    return chatRoomId
      ? chatRooms.get(chatRoomId)?.chatRoomType
      : tempChatRoom.chatRoomType;
  });

  const [chatRoomName, setChatRoomName] = useState(() => {
    return chatRoomId ? chatRooms.get(chatRoomId)?.name : tempChatRoom.name;
  });

  const [recipientUsername, setRecipientUsername] = useState(() => {
    return chatRooms.get(chatRoomId)?.recipientUsername;
  });
  const [creatorUsername, setCreatorUsername] = useState(() => {
    return chatRooms.get(chatRoomId)?.creatorUsername;
  });
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [lastSeen, setLastSeen] = useState(null);

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
    } else {
      setChatRoomId(activeChatRoomId);
    }
  }, [activeChatRoomId]);

  useEffect(() => {
    if (chatRoomId) {
      setChatRoomMessages(messages[chatRoomId] || []);
      handleMarkAllMessagesRead();
    }
  }, [messages[chatRoomId], chatRoomId]);

  const [chatRoom, setChatRoom] = useState(chatRooms.get(chatRoomId));

  useEffect(() => {
    setChatRoom(chatRooms.get(chatRoomId));
  }, [chatRooms, chatRoomId]);

  useEffect(() => {
    if (chatRoomId) {
      if (chatRoom) {
        setTypingUsers(chatRoom.typingUsers || []);
        setLastSeen(chatRoom.lastSeen || null);
        const filteredOnlineUsers = chatRoom.onlineUsers || new Set();
        filteredOnlineUsers.delete(username);
        setOnlineUsers(filteredOnlineUsers);
      }
    }
  }, [chatRooms, chatRoomId, userId]);

  const messagesLoaded = chatRoom?.messagesLoaded || false;
  const fromCount = messages[chatRoomId]?.length || 0;

  const { loading, error, data } = useQuery(GET_MESSAGES_OF_CHAT_ROOM, {
    variables: { chatRoomId, userId, fromCount },
    skip: !chatRoomId || !connected || messagesLoaded,
    fetchPolicy: "network-only",
  });

  const handleSendMessage = async (messageContent) => {
    const newMessage = {
      id: `${Math.random()}`,
      content: messageContent,
      senderId: userId,
      chatRoomId,
    };

    if (sendMessage) {
      // For first time individual chat rooms, creation happens when you first send the message
      if (chatRoomId === null) {
        const response = await handleCreateGroup(
          null,
          tempChatRoom.members,
          tempChatRoom.chatRoomType,
          newMessage
        );
        handleChatRoomClick(response.chatRoomId);
        return {
          chatRoomId: response.chatRoomId,
        };
      } else {
        sendMessage(`/app/chat/sendMessage/${chatRoomId}`, newMessage);
      }
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
        chatRoom={chatRoomId ? chatRoom : tempChatRoom}
        isExited={chatRoomId ? chatRoom?.isExited : false}
        chatRoomName={
          chatRoomType === "INDIVIDUAL" && chatRoomId !== null
            ? recipientUsername === username
              ? creatorUsername
              : recipientUsername
            : chatRoomType === "SELF"
            ? `${chatRoomName} (You)`
            : chatRoomName
        }
        typingUsers={typingUsers}
        onlineUsers={onlineUsers}
        lastSeen={lastSeen}
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
                >
                  <div>
                    {!message?.deletedForEveryone ? (
                      <div className="messageContent">{message.content}</div>
                    ) : (
                      <DeletedMessageStyle
                        senderId={message.senderId}
                        userId={userId}
                      />
                    )}

                    <img
                      src={messageOptionsIcon}
                      className="messageOptionsIcon"
                      style={{
                        backgroundColor:
                          message.senderId !== userId
                            ? "white"
                            : "rgb(210, 255, 160)",
                      }}
                      onClick={() => toggleDropdown(message)}
                    />
                    {isOpen === message.id && (
                      <OptionsDropdown
                        options={options}
                        onSelect={handleSelectOption}
                        isOpen={isOpen}
                        toggleDropdown={toggleDropdown}
                        parameter={message}
                        parentButtonRef={"messageOptionsIcon"}
                      />
                    )}
                  </div>
                  {
                    <MessageStatusIcon
                      key={message.id}
                      deletedForEveryone={message.deletedForEveryone}
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
