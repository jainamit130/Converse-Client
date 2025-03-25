import React, { useEffect, useState, useRef, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { GET_CHAT_ROOM_DATA } from "../../../graphql/queries";
import { useChatRoomWebSocket } from "../../../context/WebSocketContext/ChatRoomWebSocketContext";

const ChatRoom = ({ activeChatRoomId, activeChatRoomName }) => {
  const { messages, setMessages } = useChatRoomWebSocket([]);
  const { loading, error, data } = useQuery(GET_CHAT_ROOM_DATA, {
    skip: !activeChatRoomId,
  });

  useEffect(() => {
    if (data && activeChatRoomId) {
      setMessages(data.GET_CHAT_ROOM_DATA || []);
    }
  }, [data, activeChatRoomId, setMessages]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <ul>
        {messages.length > 0 && messages.map((message) => message.content)}
      </ul>
    </div>
  );
};

export default ChatRoom;
