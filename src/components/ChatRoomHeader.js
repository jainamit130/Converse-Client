import TypingIndicator from "./TypingIndicator";
import profileIcon from "../assets/profileIcon.webp";
import { formatLastSeen } from "../util/dateUtil";
import groupOptionsIcon from "../assets/groupOptionsIcon.png";
import OptionsDropdown from "./reusableComponents/OptionsDropdown";
import { useEffect, useState } from "react";
import useDelete from "../hooks/useDelete";
import { useChatRoom } from "../context/ChatRoomContext";
import { useWebSocket } from "../context/WebSocketContext";
import { useUser } from "../context/UserContext";

const ChatRoomHeader = ({
  chatRoom,
  chatRoomName,
  typingUsers,
  onlineUsers,
  lastSeen,
  openInfo,
  handleExitGroup,
  handleDeleteGroup,
  handleClearChat,
}) => {
  const lastSeenFormat = lastSeen ? formatLastSeen(lastSeen) : null;
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

  const handleSelectOption = async (event, option, message) => {
    if (option === "Clear Chat") {
      handleClearChat(chatRoom.id);
    } else if (option === "Delete Chat" || option === "Delete Group") {
      handleDeleteGroup(chatRoom.id);
    } else if (option === "Exit Group") {
      handleExitGroup();
    }
    setIsOpen(null);
  };

  useEffect(() => {
    if (chatRoom?.isExited) {
      setOptions(["Clear Chat", "Delete Group"]);
    }
  }, [chatRoom]);

  return (
    <div className="chat-details">
      <div
        style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        onClick={openInfo}
      >
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
      </div>
      <div className="groupOptions">
        <img
          src={groupOptionsIcon}
          className="groupOptionsIcon"
          onClick={(event) => toggleDropdown(event, chatRoom?.id)}
        />
        <div style={{ position: "absolute", right: "200px" }}>
          {isOpen === chatRoom?.id && (
            <OptionsDropdown
              options={options}
              onSelect={handleSelectOption}
              toggleDropdown={toggleDropdown}
              parameter={chatRoom?.id}
              parentButtonRef={"groupOptionsIcon"}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatRoomHeader;
