import TypingIndicator from "./TypingIndicator";
import profileIcon from "../assets/profileIcon.webp";
import { formatLastSeen } from "../util/dateUtil";

const ChatRoomHeader = ({
  chatRoomName,
  typingUsers,
  onlineUsersCount,
  lastSeen,
  chatRoomType,
}) => {
  const lastSeenFormat = formatLastSeen(lastSeen);

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
            {chatRoomType === "SELF" && <span>online</span>}
            {chatRoomType === "INDIVIDUAL" ? (
              onlineUsersCount === 1 ? (
                <span>online</span>
              ) : lastSeen ? (
                <span>{lastSeenFormat}</span>
              ) : null
            ) : chatRoomType === "GROUP" ? (
              onlineUsersCount > 0 ? (
                <span>{onlineUsersCount + " online"}</span>
              ) : null
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoomHeader;
