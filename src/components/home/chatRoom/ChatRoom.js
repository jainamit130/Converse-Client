// ChatRoom.jsx (updated)
import React, { useEffect, useState, useRef } from "react";
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
import MessageSkeleton from "./message/util/MessageLoading/MessageSkeleton";
import { insertDateSeparators } from "./message/util/DateSeperator/insertDateSeparators";
import InfoPanel from "./util/infoPanel/InfoPanel";
import GroupInfoPanel from "./GroupInfo/GroupInfoPanel";
import useGroupTransaction from "./hook/useGroupTransaction";
import ProfileInfo from "./profileInfo/ProfileInfo";
import useIsMobile from "./util/infoPanel/useIsMobile";
import useKeyboardGap from "./util/useKeyboardGap";

const ChatRoom = ({ handleChatRoomSelect, handleAddUsers, chatRoom }) => {
  useKeyboardGap();
  const {
    activeChatRoomId,
    messages,
    setMessages,
    setChatRooms,
    setLastSeen,
    setOnlineUsers,
    setDirectSelfChats,
    updateChatRoomUsers,
  } = useChatRoomContext();
  const userId = localStorage.getItem("userId");
  const isMobile = useIsMobile();
  const { loading, error, data } = useQuery(GET_CHAT_ROOM_DATA, {
    variables: { chatRoomId: activeChatRoomId },
    skip: !activeChatRoomId || activeChatRoomId === "temp",
    fetchPolicy: "network-only",
  });

  const { exitChat, removeUsers } = useGroupTransaction();
  const { clearChat } = useClear();
  const { deleteChat } = useDeleteChat();
  const [panelView, setPanelView] = useState("NONE");
  const [infoPanelMessage, setInfoPanelMessage] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [profileOpenedFromGroupInfo, setProfileOpenedFromGroupInfo] =
    useState(false);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  };

  const bottomRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (chatRoom) {
      setUnreadMessageCount(chatRoom.unreadMessageCount || 0);
    } else {
      setUnreadMessageCount(0);
    }
  }, [activeChatRoomId]);

  useEffect(() => {
    if (data && activeChatRoomId && activeChatRoomId !== "temp") {
      setMessages((prevMap) => {
        const updatedMap = new Map(prevMap);
        const newMessagesArray = data.getChatRoomData.messages || [];
        updatedMap.set(activeChatRoomId, newMessagesArray);
        return updatedMap;
      });
      readChatRoom(setChatRooms, activeChatRoomId);

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

  const openMessageInfo = (message) => {
    setInfoPanelMessage(message);
    setPanelView("MESSAGE_INFO");
  };

  const openGroupInfo = () => {
    setPanelView("GROUP_INFO");
    setSelectedUserId(null);
  };

  const openProfileInfo = (userId, fromGroupInfo = false) => {
    setSelectedUserId(userId);
    setPanelView("PROFILE_INFO");
    setProfileOpenedFromGroupInfo(fromGroupInfo);
  };

  const closePanel = () => {
    setPanelView("NONE");
    setInfoPanelMessage(null);
    setSelectedUserId(null);
  };

  const clearChatMessageHandler = async () => {
    try {
      const response = await clearChat({ chatRoomId: activeChatRoomId });
      if (response?.status === 204) {
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

  const handleChatDetailsPanel = () => {
    if (chatRoom.chatRoomType === "GROUP") {
      openGroupInfo();
    } else if (chatRoom.chatRoomType === "DIRECT") {
      openProfileInfo(chatRoom?.counterPartUserId);
    } else if (chatRoom.chatRoomType === "SELF") {
      openProfileInfo(userId);
    }
  };

  const deleteChatHandler = async () => {
    try {
      const response = await deleteChat({ chatRoomId: activeChatRoomId });
      if (response?.status === 204) {
        handleDeleteChat({
          chatRoomId: activeChatRoomId,
          setChatRooms,
          setDirectSelfChats,
          handleChatRoomSelect,
        });
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  const removeUsersHandler = async (users) => {
    try {
      const response = await removeUsers({
        chatRoomId: activeChatRoomId,
        users,
      });

      if (response?.status === 204) {
        setChatRooms((prev) => {
          const updated = new Map(prev);
          const chatRoom = updated.get(activeChatRoomId);

          if (chatRoom) {
            const updatedUserIds = chatRoom.userIds?.filter(
              (id) => !users.includes(id)
            );
            updated.set(activeChatRoomId, {
              ...chatRoom,
              userIds: updatedUserIds,
            });
          }

          return updated;
        });
      }

      return response;
    } catch (error) {
      console.error("Failed to remove users:", error);
    }
  };

  const exitChatHandler = async () => {
    try {
      const response = await exitChat({ chatRoomId: activeChatRoomId });

      if (response?.status === 204) {
        updateChatRoomUsers(activeChatRoomId, (userIdsList) =>
          userIdsList.filter((id) => id !== userId)
        );
      }

      return response;
    } catch (error) {
      console.error("Failed to exit chat:", error);
    }
  };

  const addUserHandler = () => {
    handleAddUsers();
  };

  const deleteMessageHandler = async ({ messageIds, deleteMessages }) => {
    try {
      const response = await deleteMessages({
        chatRoomId: activeChatRoomId,
        messageIds,
      });
      if (response?.status === 204) {
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

  const chatRoomMessages =
    messages instanceof Map && messages.get(activeChatRoomId)
      ? messages.get(activeChatRoomId)
      : [];

  if (loading) {
    return (
      <div className="chatRoom">
        <ChatDetails />
        <div className="chatContainer">
          <div className="messagesContainer">
            {Array.from({ length: 8 }).map((_, i) => (
              <MessageSkeleton
                key={i}
                senderType={i % 2 === 0 ? "left" : "right"}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chatRoom">
      {(!isMobile || panelView === "NONE") && (
        <div className="chatDetailsHeader">
          <ChatDetails
            handleChatDetailsPanel={handleChatDetailsPanel}
            handleClearChat={clearChatMessageHandler}
            handleDeleteChat={deleteChatHandler}
            handleBack={() =>
              handleChatRoomSelect({ id: null, name: "", type: "" })
            }
          />
        </div>
      )}
      <div className="chatContainer">
        <div className="messagePlusInfoContainer">
          <div
            className={`messagesContainer ${
              panelView !== "NONE" ? "hideOnMobile" : ""
            }`}
          >
            {insertDateSeparators(
              chatRoomMessages,
              unreadMessageCount,
              (message) => (
                <Message
                  key={message.id}
                  message={message}
                  onOpenInfoPanel={openMessageInfo}
                  handleDeleteMessages={deleteMessageHandler}
                />
              )
            )}
            <div ref={bottomRef} />
          </div>

          {panelView !== "NONE" && (
            <InfoPanel
              panelName={
                panelView === "MESSAGE_INFO"
                  ? "Message Info"
                  : panelView === "GROUP_INFO"
                  ? "Group Info"
                  : "Profile Info"
              }
              onClose={closePanel}
              onBack={
                panelView === "PROFILE_INFO" && profileOpenedFromGroupInfo
                  ? () => setPanelView("GROUP_INFO")
                  : null
              }
            >
              {panelView === "MESSAGE_INFO" && (
                <MessageInfoPanel message={infoPanelMessage} />
              )}
              {panelView === "GROUP_INFO" && (
                <GroupInfoPanel
                  chatRoom={chatRoom}
                  handleDeletChat={deleteChatHandler}
                  handleExitChat={exitChatHandler}
                  handleRemoveUsers={removeUsersHandler}
                  handleAddUsers={addUserHandler}
                  openProfileInfo={(userId) => openProfileInfo(userId, true)}
                />
              )}
              {panelView === "PROFILE_INFO" && selectedUserId && (
                <ProfileInfo
                  myId={userId}
                  userId={selectedUserId}
                  handleChatRoomSelect={handleChatRoomSelect}
                  onClose={closePanel}
                />
              )}
            </InfoPanel>
          )}
        </div>
        {(!isMobile || panelView === "NONE") && (
          <ChatInput
            chatRoom={chatRoom}
            chatRoomId={activeChatRoomId}
            handleChatRoomSelect={handleChatRoomSelect}
          />
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
