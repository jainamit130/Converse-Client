import TypingIndicator from "./TypingIndicator";
import profileIcon from "../assets/profileIcon.webp";

const ChatRoomHeader = ({ chatRoomName, typingUsers, onlineUsers, userId }) => {
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
              <span>
                {onlineUsers.size > 0 &&
                  JSON.parse(Array.from(onlineUsers)[0]).username}{" "}
                is online
              </span>
            ) : (
              <span>No one else is online</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoomHeader;
