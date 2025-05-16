import React, { useEffect, useState, useRef, useCallback } from "react";
import { useQuery } from "@apollo/client";
import "./ChatRoom.css";
import { GET_CHAT_ROOM_DATA } from "../../../graphql/queries";
import ChatDetails from "./chatDetails/ChatDetails";
import Message from "./message/Message";
import ChatInput from "./chatInput/ChatInput";
import { useChatRoomContext } from "../../../context/ChatRoomContext";
import { readChatRoom } from "./util/ChatRoomUtil";
import useDelete from "./message/hook/useDelete";
import { handleDeleteMessages } from "../chatRooms/util/HandleDeleteMessages";

const ChatRoom = ({ activeChatRoomId }) => {
  const { messages, setMessages, setChatRooms } = useChatRoomContext();
  const { loading, error, data } = useQuery(GET_CHAT_ROOM_DATA, {
    variables: { chatRoomId: activeChatRoomId },
    skip: !activeChatRoomId,
    fetchPolicy: "network-only",
  });

  const deleteMessageHandler = async ({ messageIds, deleteMessages }) => {
    try {
      const response = await deleteMessages({
        chatRoomId: activeChatRoomId,
        messageIds,
      });

      if (response && !response.error) {
        handleDeleteMessages({
          chatRoomId: activeChatRoomId,
          setMessages,
          setChatRooms,
          messageIds,
        });
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (data && activeChatRoomId) {
      setMessages((prevMap) => {
        const updatedMap = new Map(prevMap);
        const newMessagesArray = data.getChatRoomData.messages || [];
        updatedMap.set(activeChatRoomId, newMessagesArray);
        readChatRoom(setChatRooms, activeChatRoomId);
        return updatedMap;
      });
    }
  }, [data, activeChatRoomId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const chatRoomMessages =
    messages instanceof Map && messages.get(activeChatRoomId)
      ? messages.get(activeChatRoomId)
      : [];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="chatRoom">
      <ChatDetails />
      <div className="chatContainer">
        <div className="messagesContainer">
          {chatRoomMessages.map((message) => (
            <Message
              message={message}
              key={message.id}
              handleDeleteMessages={deleteMessageHandler}
            />
          ))}
          <div ref={bottomRef} />
        </div>
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatRoom;
