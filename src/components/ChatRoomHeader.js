import TypingIndicator from "./TypingIndicator";
import profileIcon from "../assets/profileIcon.webp";
import { formatLastSeen } from "../util/dateUtil";

const ChatRoomHeader = ({
  chatRoomName,
  typingUsers,
  onlineUsers,
  chatRoomType,
  lastSeen,
}) => {
  const lastSeenFormat = lastSeen ? formatLastSeen(lastSeen) : null;

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
    </div>
  );
};

export default ChatRoomHeader;
