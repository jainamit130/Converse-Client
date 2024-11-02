import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_CHAT_ROOMS_OF_USER } from "../graphql/queries";
import ChatRoom from "./ChatRoom";
import { useUser } from "../context/UserContext";
import newChat from "../assets/newChat.png";
import { useChatRoom } from "../context/ChatRoomContext";
import "./ChatRooms.css";
import Tile from "./reusableComponents/Tile";
import AddUser from "./AddUser";
import GroupIcon from "../assets/GroupIcon.png";
import HomeImage from "../assets/converseHome.png";
import ProfileIcon from "../assets/profileIcon.webp";
import useCreateChat from "../hooks/useCreateChat";
import MessageStatusIcon from "./MessageStatusIcon";
import DeletedMessageStyle from "./reusableComponents/DeletedMessageStyle";

const ChatRooms = () => {
  const { userId, username, activeChatRoomId, setActiveChatRoomId } = useUser();
  const { loading, error, data } = useQuery(GET_CHAT_ROOMS_OF_USER, {
    variables: { userId },
  });
  const [showTempChatRoom, setShowTempChatRoom] = useState(false);
  const { chatRooms, messages, mergeChatRooms } = useChatRoom();
  const { handleCreateGroup } = useCreateChat();
  const [showAddUserPanel, setShowAddUserPanel] = useState(false);
  const [tempChatRoom, setTempChatRoom] = useState({});

  const handleCloseAddUser = (chatRoomId, isNewIndividualChat) => {
    if (isNewIndividualChat) {
      setShowTempChatRoom(true);
    }
    setShowAddUserPanel(false);
    handleChatRoomClick(chatRoomId);
  };

  const createChatRoom = async (name, userIds, type, message) => {
    try {
      const response = await handleCreateGroup(name, userIds, type, message);
      return {
        chatRoomId: response.chatRoomId,
      };
    } catch (err) {
      console.error("Error creating chat room:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (data) {
      mergeChatRooms(data.getChatRoomsOfUser);
    }
  }, [data, mergeChatRooms]);

  const handleChatRoomClick = (chatRoomId) => {
    if (chatRoomId !== null) {
      setShowTempChatRoom(false);
    }
    setActiveChatRoomId(chatRoomId);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="chat-layout">
      <div className="chat-rooms-sidebar">
        <div className="sidebar-header">
          <h2>Chats</h2>
          <img
            onClick={() => setShowAddUserPanel(true)}
            src={newChat}
            className="newChatIcon"
            title="new chat"
          />
        </div>
        {Array.from(chatRooms.values()).map((room) => (
          <Tile
            id={room.id}
            name={
              room.chatRoomType === "SELF"
                ? room.name + " (You)"
                : room.chatRoomType === "INDIVIDUAL"
                ? room.recipientUsername === username
                  ? room.creatorUsername
                  : room.recipientUsername
                : room.name
            }
            latestMessageTimestamp={room.latestMessage?.timestamp}
            smallerInfo={
              <div className="latestMessage">
                <MessageStatusIcon
                  key={room.latestMessage?.id}
                  deletedForEveryone={room.latestMessage?.deletedForEveryone}
                  isSender={room.latestMessage?.senderId === userId}
                  status={room.latestMessage?.status}
                  formattedTime={null}
                />
                {room?.latestMessage?.deletedForEveryone ? (
                  <DeletedMessageStyle
                    content={room?.latestMessage?.content}
                    userId={userId}
                    senderId={room?.latestMessage?.senderId}
                  />
                ) : (
                  <>
                    {room.chatRoomType === "GROUP" &&
                      room.latestMessage?.user?.username && (
                        <span>{`${room.latestMessage.user.username}: `}</span>
                      )}
                    {room.latestMessage?.content || "No messages yet"}
                  </>
                )}
              </div>
            }
            icon={GroupIcon}
            typingUsers={room.typingUsers}
            unreadMessageCount={room.unreadMessageCount}
            activeChatRoomId={activeChatRoomId}
            onChatRoomClick={handleChatRoomClick}
          />
        ))}
        {showTempChatRoom && (
          <Tile
            id={activeChatRoomId}
            name={tempChatRoom.name}
            icon={GroupIcon}
            activeChatRoomId={activeChatRoomId}
            onChatRoomClick={handleChatRoomClick}
          />
        )}
      </div>

      <div className="chat-section">
        {!activeChatRoomId && !showTempChatRoom ? (
          <img src={HomeImage} className="homeImage" />
        ) : (
          <ChatRoom
            key={activeChatRoomId}
            handleCreateGroup={createChatRoom}
            tempChatRoom={tempChatRoom}
            handleChatRoomClick={handleChatRoomClick}
          />
        )}
      </div>
      {showAddUserPanel && (
        <AddUser
          onClose={handleCloseAddUser}
          handleCreateGroup={createChatRoom}
          setTempChatRoom={setTempChatRoom}
        />
      )}
    </div>
  );
};

export default ChatRooms;
