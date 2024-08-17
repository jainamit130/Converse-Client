import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_MESSAGES_OF_CHAT_ROOM } from "../graphql/queries";
import { useWebSocket } from "../context/WebSocketContext";

const ChatRoom = ({ chatRoomId, initialMessages = [] }) => {
  const { subscribeToChatRoom, sendMessage, connected } = useWebSocket();
  const [messages, setMessages] = useState(initialMessages);

  const { loading, error, data } = useQuery(GET_MESSAGES_OF_CHAT_ROOM, {
    variables: { chatRoomId },
    skip: !connected,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    setMessages((prevMessages) => {
      const newMessages = initialMessages.filter(
        (msg) => !prevMessages.some((prevMsg) => prevMsg.id === msg.id)
      );
      return [...prevMessages, ...newMessages];
    });
  }, [initialMessages]);

  useEffect(() => {
    if (!connected) return;

    const unsubscribe = subscribeToChatRoom(chatRoomId, (receivedMessage) => {
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [chatRoomId, subscribeToChatRoom, connected]);

  const handleSendMessage = (messageContent) => {
    const newMessage = {
      id: `${Math.random()}`,
      content: messageContent,
      senderId: "668bbb44d834f25303f35c39",
      chatRoomId,
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    sendMessage(`/app/chat/sendMessage/${chatRoomId}`, newMessage);
  };

  useEffect(() => {
    if (data) {
      const { getMessagesOfChatRoom: chatMessages } = data;
      setMessages((prevMessages) => {
        const newMessages = chatMessages.filter(
          (msg) => !prevMessages.some((prevMsg) => prevMsg.id === msg.id)
        );
        return [...prevMessages, ...newMessages];
      });
    }
  }, [data]);

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
