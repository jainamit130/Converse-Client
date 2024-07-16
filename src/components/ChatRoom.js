import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_MESSAGES_OF_CHAT_ROOM } from "../graphql/queries";
import { useWebSocket } from "../context/WebSocketContext";

const ChatRoom = ({ chatRoomId, initialMessages = [] }) => {
  const { subscribeToChatRoom, sendMessage } = useWebSocket();
  const [messages, setMessages] = useState(initialMessages);

  const { loading, error, data } = useQuery(GET_MESSAGES_OF_CHAT_ROOM, {
    variables: { chatRoomId },
  });

  useEffect(() => {
    if (data) {
      const { getMessagesOfChatRoom: chatMessages } = data;
      setMessages(chatMessages);
    }

    const unsubscribe = subscribeToChatRoom(chatRoomId, (receivedMessage) => {
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [chatRoomId, data, subscribeToChatRoom]);

  const handleSendMessage = (messageContent) => {
    const newMessage = {
      id: `${Math.random()}`, // Generate a unique ID (replace with actual ID logic)
      content: messageContent,
      senderId: "668bbb44d834f25303f35c39",
      chatRoomId,
      timestamp: new Date().toISOString(), // Ensure timestamp is included
    };

    // Send message via WebSocket
    sendMessage(`/app/chat/sendMessage/${chatRoomId}`, newMessage);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Chat Room: {chatRoomId}</h2>
      <div>
        {messages && messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.id}>
              <p>{message.content}</p>
            </div>
          ))
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
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatRoom;
