import React, { useEffect, useState, useRef, useCallback } from "react";
import { useQuery } from "@apollo/client";
import "./ChatRoom.css";
import { GET_CHAT_ROOM_DATA } from "../../../graphql/queries";
import { useChatRoomWebSocket } from "../../../context/WebSocketContext/ChatRoomWebSocketContext";
import ChatDetails from "./chatDetails/ChatDetails";
import Message from "./message/Message";

const ChatRoom = ({ activeChatRoomId, activeChatRoomName }) => {
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
      <ChatDetails key={activeChatRoomId}></ChatDetails>
      <div>
        {messages.length > 0 &&
          messages.map((message) => <Message message={message}></Message>)}
      </div>
    </div>
  );
};

export default ChatRoom;
