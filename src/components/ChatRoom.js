import React from "react";
import { useQuery } from "@apollo/client";
import { GET_MESSAGES_OF_CHAT_ROOM } from "../graphql/queries";

const ChatRoom = ({ chatRoomId }) => {
  const { loading, error, data } = useQuery(GET_MESSAGES_OF_CHAT_ROOM, {
    variables: { chatRoomId },
  });

  const handleSendMessage = (messageContent) => {
    // sendMessage({
    //   variables: { chatRoomId, content: messageContent },
    //   // Optionally update cache or refetch queries
    // });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { getMessagesOfChatRoom: messages } = data;

  return (
    <div>
      <h2>Chat Room: {chatRoomId}</h2>
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <p>{message.content}</p>
            {/* Display other message details as needed */}
          </div>
        ))}
      </div>
      {/* Form to send messages */}
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
