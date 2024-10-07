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
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img src={icon} className="chatRoomIcon" alt="Group Icon" />
        <div>
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
            }}
          >
            <div className="chatRoomTitle">{name}</div>
            {formattedTime && (
              <div
                className="latestMessageTime"
                style={{ marginLeft: "218px" }}
              >
                {formattedTime}
              </div>
            )}
          </div>
          <div style={{ display: "flex" }}>
            {typingUsers && typingUsers.length > 0 ? (
              <TypingIndicator typingUsers={typingUsers} />
            ) : (
              smallerInfo
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
