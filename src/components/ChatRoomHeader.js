import TypingIndicator from "./TypingIndicator";
import profileIcon from "../assets/profileIcon.webp";
import { formatLastSeen } from "../util/dateUtil";
import groupOptionsIcon from "../assets/groupOptionsIcon.png";
import OptionsDropdown from "./reusableComponents/OptionsDropdown";
import { useState } from "react";
import useDelete from "../hooks/useDelete";
import { useChatRoom } from "../context/ChatRoomContext";

const ChatRoomHeader = ({
  chatRoomId,
  chatRoomName,
  typingUsers,
  onlineUsers,
  chatRoomType,
  lastSeen,
}) => {
  const { handleClearChat } = useDelete();
  const lastSeenFormat = lastSeen ? formatLastSeen(lastSeen) : null;
  const { clearChat } = useChatRoom();
  const [isOpen, setIsOpen] = useState(null);
  const [options, setOptions] = useState(["Clear Chat"]);

  const toggleDropdown = (chatRoomId) => {
    if (isOpen) {
      setIsOpen(null);
    } else {
      setIsOpen(chatRoomId);
    }
  };

  const handleSelectOption = async (option, chatRoomId) => {
    if (option === "Clear Chat") {
      const isSuccess = handleClearChat(chatRoomId);
      if (isSuccess) {
        clearChat(chatRoomId);
      }
    } else if (option === "***") {
    }
    setIsOpen(null);
  };

  return (
    <div className="chat-details">
      <img src={profileIcon} className="chatRoomIcon" />
      <div>
        <div className="chat-room-name">{chatRoomName}</div>
        <div className="typing-status">
          <TypingIndicator typingUsers={typingUsers} />
        </div>
        {!typingUsers.length && (
          <div className="online-status">
            {chatRoomType === "SELF" ? (
              <span>online</span>
            ) : chatRoomType === "INDIVIDUAL" ? (
              onlineUsers.size === 1 ? (
                <span>online</span>
              ) : (
                lastSeenFormat
              )
            ) : chatRoomType === "GROUP" ? (
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
          onClick={() => toggleDropdown(chatRoomId)}
        />
        {isOpen === chatRoomId && (
          <OptionsDropdown
            options={options}
            onSelect={handleSelectOption}
            isOpen={isOpen}
            toggleDropdown={toggleDropdown}
            parameter={chatRoomId}
            parentButtonRef={"groupOptionsIcon"}
          />
        )}
      </div>
    </div>
  );
};

export default ChatRoomHeader;
