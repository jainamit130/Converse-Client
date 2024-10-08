import React from "react";
import TypingIndicator from "../TypingIndicator";
import { formatTime, parseDate } from "../../util/dateUtil";

const Tile = ({
  id,
  name,
  latestMessageTimestamp,
  smallerInfo,
  typingUsers,
  unreadMessageCount,
  activeChatRoomId,
  onChatRoomClick,
  icon,
}) => {
  const handleChatRoomClick = () => {
    if (onChatRoomClick) {
      onChatRoomClick(id, name);
    }
  };

  const messageDate = latestMessageTimestamp
    ? parseDate(latestMessageTimestamp)
    : null;
  const formattedTime = messageDate ? formatTime(messageDate) : null;

  return (
    <div key={id} className="chat-room-tile" onClick={handleChatRoomClick}>
      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
        }}
      >
        <img src={icon} className="chatRoomIcon" alt="Group Icon" />
        <div style={{ marginLeft: "10px", width: "100%" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div className="chatRoomTitle smallerInfo">{name}</div>
            {formattedTime && (
              <div className="latestMessageTime">{formattedTime}</div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {typingUsers && typingUsers.length > 0 ? (
              <TypingIndicator typingUsers={typingUsers} />
            ) : (
              <div className="smallerInfo">{smallerInfo}</div>
            )}
            {activeChatRoomId !== id && unreadMessageCount > 0 && (
              <div className="unreadMessages">{unreadMessageCount}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tile;
