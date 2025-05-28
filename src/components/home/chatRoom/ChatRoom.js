import React, { useEffect, useState, useRef, useCallback } from "react";
import { useQuery } from "@apollo/client";
import "./ChatRoom.css";
import { GET_CHAT_ROOM_DATA } from "../../../graphql/queries";
import ChatDetails from "./chatDetails/ChatDetails";
import Message from "./message/Message";
import ChatInput from "./chatInput/ChatInput";
import { useChatRoomContext } from "../../../context/ChatRoomContext";
import { readChatRoom } from "./../chatRoom/util/ReadChatRoom";
import { handleClearChat } from "../chatRooms/util/HandleClearChat";
import { handleDeleteMessages } from "../chatRooms/util/HandleDeleteMessages";
import useClear from "./hook/useClear";
import { normalizeOnlineStatus } from "./util/OnlineUsersTransformation";
import useDeleteChat from "../chatRooms/hook/useDeleteChat";
import { handleDeleteChat } from "../chatRooms/util/HandleDeleteChat";
import MessageInfoPanel from "./message/MessageInfo/MessageInfoPanel";

const ChatRoom = ({ activeChatRoomId, setActiveChatRoomId }) => {
  const {
    messages,
    setMessages,
    chatRooms,
    setChatRooms,
    lastSeen,
    setLastSeen,
    onlineUsers,
    setOnlineUsers,
    directSelfChats,
    setDirectSelfChats,
  } = useChatRoomContext();
  const chatRoom =
    activeChatRoomId === "temp"
      ? {
          chatRoomName: localStorage.getItem("activeChatRoomName"),
          chatRoomType: localStorage.getItem("activeChatRoomType"),
        }
      : chatRooms.get(activeChatRoomId);
  const { loading, error, data } = useQuery(GET_CHAT_ROOM_DATA, {
    variables: { chatRoomId: activeChatRoomId },
    skip: !activeChatRoomId || activeChatRoomId === "temp",
    fetchPolicy: "network-only",
  });

  const { clearChat } = useClear();
  const { deleteChat } = useDeleteChat();
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
  const [infoPanelMessage, setInfoPanelMessage] = useState(null);

  const hanldeCloseInfoPanel = () => {
    setIsInfoPanelOpen(false);
    setInfoPanelMessage(null);
  };

  const handleInfoPanelOpen = (message) => {
    setIsInfoPanelOpen(true);
    setInfoPanelMessage(message);
  };

  const clearChatMessageHanlder = async () => {
    try {
      const response = await clearChat({ chatRoomId: activeChatRoomId });

      if (response && !response.error) {
        handleClearChat({
          chatRoomId: activeChatRoomId,
          setMessages,
          setChatRooms,
        });
      }
    } catch (error) {
      console.error("Failed to clear messages:", error);
    }
  };

  const deleteChatHandler = async () => {
    try {
      const response = await deleteChat({ chatRoomId: activeChatRoomId });

      if (response && !response.error) {
        handleDeleteChat({
          chatRoomId: activeChatRoomId,
          setChatRooms,
          setActiveChatRoomId,
          setDirectSelfChats,
        });
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

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
    if (data && activeChatRoomId && activeChatRoomId !== "temp") {
      setMessages((prevMap) => {
        const updatedMap = new Map(prevMap);
        const newMessagesArray = data.getChatRoomData.messages || [];
        updatedMap.set(activeChatRoomId, newMessagesArray);
        return updatedMap;
      });
      readChatRoom(setChatRooms, activeChatRoomId);
      const chatRoom = chatRooms.get(activeChatRoomId);
      if (chatRoom && data) {
        normalizeOnlineStatus({
          chatRoomName: chatRoom.chatRoomName,
          onlineUsersDTO: data.getChatRoomData.onlineUsersDTO,
          setOnlineUsers,
          setLastSeen,
        });
      }
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
      <ChatDetails
        chatRoomType={chatRoom?.chatRoomType}
        chatRoomName={chatRoom?.chatRoomName}
        chatRoomId={activeChatRoomId}
        handleClearChat={clearChatMessageHanlder}
        handleDeleteChat={deleteChatHandler}
      />
      <div className="chatContainer">
        <div className="messagePlusInfoContainer">
          <div className="messagesContainer">
            {chatRoomMessages.map((message) => (
              <Message
                onOpenInfoPanel={handleInfoPanelOpen}
                chatRooms={chatRooms}
                message={message}
                key={message.id}
                handleDeleteMessages={deleteMessageHandler}
              />
            ))}
          </div>
          {isInfoPanelOpen && (
            <MessageInfoPanel
              message={infoPanelMessage}
              onClose={hanldeCloseInfoPanel}
            ></MessageInfoPanel>
          )}
        </div>
        <div ref={bottomRef} />
        <ChatInput
          chatRoomId={activeChatRoomId}
          setActiveChatRoomId={setActiveChatRoomId}
        />
      </div>
    </div>
  );
};

export default ChatRoom;
