import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_MESSAGES_OF_CHAT_ROOM } from "../graphql/queries";
import { useWebSocket } from "../context/WebSocketContext";
import { useUser } from "../context/UserContext";
import { useChatRoom } from "../context/ChatRoomContext";
import { parseDate, formatMessageDate, formatTime } from "../util/dateUtil.js";
import "./ChatRoom.css";

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
  const { sendMessage, connected } = useWebSocket();
  const { messages, addMessageToRoom } = useChatRoom();
  const [chatRoomMessages, setChatRoomMessages] = useState(
    messages[chatRoomId] || []
  );
  const groupedMessages = groupMessagesByDate(chatRoomMessages);

  useEffect(() => {
    setChatRoomMessages(messages[chatRoomId] || []);
  }, [messages[chatRoomId]]);

  const { loading, error, data } = useQuery(GET_MESSAGES_OF_CHAT_ROOM, {
    variables: { chatRoomId },
    skip: !connected,
    fetchPolicy: "network-only",
  });

  const handleSendMessage = (messageContent) => {
    if (!userId) {
      console.error("User ID is not available");
      return;
    }

    const newMessage = {
      id: `${Math.random()}`,
      content: messageContent,
      senderId: userId,
      chatRoomId,
      timestamp: new Date().toISOString(),
    };

    if (sendMessage) {
      sendMessage(`/app/chat/sendMessage/${chatRoomId}`, newMessage);
    } else {
      console.error("WebSocket not connected, unable to send message");
    }
  };

  useEffect(() => {
    if (!data || !connected) return;

    data.getMessagesOfChatRoom.forEach((chatMessage) =>
      addMessageToRoom(chatRoomId, chatMessage, true)
    );
  }, [data, connected, chatRoomId, chatRoomMessages, addMessageToRoom]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Chat Room: {chatRoomName}</h2>
      <div>
        {chatRoomMessages && chatRoomMessages.length > 0 ? (
          <div className="chat-room">
            {/* Map over each date group */}
            {Object.entries(groupedMessages).map(([date, messages]) => (
              <div key={date}>
                {/* Date Header */}
                <div className="date-header">{date}</div>

                {/* Messages under this date */}
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
                      <p>
                        {message.user.username}: {message.content}
                      </p>
                      <div className="message-time">{formattedTime}</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          <p>No messages yet.</p>
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const messageContent = e.target.elements.messageContent.value;
          handleSendMessage(messageContent);
          e.target.reset();
        }}
      >
        <input
          type="text"
          name="messageContent"
          placeholder="Type your message..."
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatRoom;
