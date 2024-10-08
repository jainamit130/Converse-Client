import TypingIndicator from "./TypingIndicator";
import profileIcon from "../assets/profileIcon.webp";

const ChatRoomHeader = ({
  chatRoomName,
  typingUsers,
  onlineUsers,
  chatRoomType,
}) => {
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
            {chatRoomType === "INDIVIDUAL" ? (
              onlineUsers.size > 0 ? (
                <span>online</span>
              ) : null
            ) : onlineUsers.size > 0 ? (
              <span>{onlineUsers.size} online</span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoomHeader;
