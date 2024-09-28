import TypingIndicator from "./TypingIndicator";
import profileIcon from "../assets/profileIcon.webp";

const ChatRoomHeader = ({ chatRoomName, typingUsers, onlineUsers }) => {
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
            {onlineUsers.size > 1 ? (
              <span>{onlineUsers.size} people online</span>
            ) : onlineUsers.size === 1 ? (
              <span>{Array.from(onlineUsers)[0]} is online</span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoomHeader;
