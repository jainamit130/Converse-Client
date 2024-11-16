import TypingIndicator from "./TypingIndicator";
import profileIcon from "../assets/profileIcon.webp";
import { formatLastSeen } from "../util/dateUtil";
import groupOptionsIcon from "../assets/groupOptionsIcon.png";
import OptionsDropdown from "./reusableComponents/OptionsDropdown";
import { useState } from "react";
import useDelete from "../hooks/useDelete";
import { useChatRoom } from "../context/ChatRoomContext";
import { useWebSocket } from "../context/WebSocketContext";

const ChatRoomHeader = ({
  chatRoom,
  chatRoomName,
  typingUsers,
  onlineUsers,
  lastSeen,
  openInfo,
}) => {
  const { handleClearChat, handleDeleteChat, handleLeaveChat } = useDelete();
  const lastSeenFormat = lastSeen ? formatLastSeen(lastSeen) : null;
  const { clearChat, deleteChat, exitGroup } = useChatRoom();
  const { unsubscribeChatRoom } = useWebSocket();
  const [isOpen, setIsOpen] = useState(null);
  const [options, setOptions] = useState(() => {
    let defaultOptions = ["Clear Chat"];

    if (chatRoom === null || chatRoom?.chatRoomType === "INDIVIDUAL") {
      defaultOptions = [...defaultOptions, "Delete Chat"];
    } else if (chatRoom?.chatRoomType === "GROUP") {
      if (chatRoom.isExited) {
        defaultOptions = [...defaultOptions, "Delete Group"];
      } else {
        defaultOptions = [...defaultOptions, "Exit Group"];
      }
    }

    return defaultOptions;
  });

  const toggleDropdown = (event, chatRoomId) => {
    if (isOpen) {
      setIsOpen(null);
    } else {
      event.stopPropagation();
      setIsOpen(chatRoomId);
    }
  };

  const handleSelectOption = async (option) => {
    if (option === "Clear Chat") {
      const isSuccess = handleClearChat(chatRoom.id);
      if (isSuccess) {
        clearChat(chatRoom?.id);
      }
    } else if (option === "Delete Chat" || option === "Delete Group") {
      const isSuccess = handleDeleteChat(chatRoom.id);
      if (isSuccess) {
        if (chatRoom?.id) unsubscribeChatRoom(chatRoom?.id);
        deleteChat(chatRoom?.id);
      }
    } else if (option === "Exit Group") {
      const isSuccess = handleLeaveChat(chatRoom.id);
      if (isSuccess) {
        exitGroup(chatRoom.id);
        let defaultOptions = ["Clear Chat", "Delete Group"];
        setOptions(defaultOptions);
      }
    }
    setIsOpen(null);
  };

  return (
    <div className="chat-details" onClick={openInfo}>
      <img src={profileIcon} className="chatRoomIcon" />
      <div style={{ cursor: "pointer" }}>
        <div className="chat-room-name">{chatRoomName}</div>
        <div className="typing-status">
          <TypingIndicator typingUsers={typingUsers} />
        </div>
        {!typingUsers.length && (
          <div className="online-status">
            {chatRoom?.chatRoomType === "SELF" ? (
              <span>online</span>
            ) : chatRoom?.chatRoomType === "INDIVIDUAL" ? (
              onlineUsers.size === 1 ? (
                <span>online</span>
              ) : (
                lastSeenFormat
              )
            ) : chatRoom?.chatRoomType === "GROUP" ? (
              onlineUsers.size > 0 ? (
                <span>{onlineUsers.size} online</span>
              ) : null
            ) : null}
          </div>
        )}
      </div>
      <div className="groupOptions">
        <img
          src={groupOptionsIcon}
          className="groupOptionsIcon"
          onClick={(event) => toggleDropdown(event, chatRoom?.id)}
        />
        {isOpen === chatRoom?.id && (
          <OptionsDropdown
            options={options}
            onSelect={handleSelectOption}
            isOpen={isOpen}
            toggleDropdown={toggleDropdown}
            parameter={chatRoom?.id}
            parentButtonRef={"groupOptionsIcon"}
          />
        )}
      </div>
    </div>
  );
};

export default ChatRoomHeader;
