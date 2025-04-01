import React, { useEffect, useState, useRef, useCallback } from "react";
import { useQuery } from "@apollo/client";
import "./ChatRoom.css";
import { GET_CHAT_ROOM_DATA } from "../../../graphql/queries";
import { useChatRoomWebSocket } from "../../../context/WebSocketContext/ChatRoomWebSocketContext";
import ChatDetails from "./chatDetails/ChatDetails";
import Message from "./message/Message";
import ChatInput from "./chatInput/ChatInput";

const ChatRoom = ({ activeChatRoomId }) => {
  const { messages, setMessages } = useChatRoomWebSocket([]);
  const { loading, error, data } = useQuery(GET_CHAT_ROOM_DATA, {
    variables: { chatRoomId: activeChatRoomId },
    skip: !activeChatRoomId,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data && activeChatRoomId) {
      setMessages(data.getChatRoomData.messages || []);
    }
  }, [data, activeChatRoomId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="chatRoom">
      <div>
        <ChatDetails></ChatDetails>
        {messages.length > 0 && (
          <div className="messagesContainer">
            {messages.map((message) => (
              <Message message={message} key={message.id} />
            ))}
          </div>
        )}
        <ChatInput></ChatInput>
      </div>
    </div>
  );
};

export default ChatRoom;
