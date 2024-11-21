import React, { useState } from "react";
import TypingIndicator from "../TypingIndicator";
import { formatTime, parseDate } from "../../util/dateUtil";
import messageOptionsIcon from "../../assets/messageOptions.png";
import OptionsDropdown from "./OptionsDropdown";
import "../ChatRoom.css";

const Tile = ({
  id,
  name,
  options,
  latestMessageTimestamp,
  smallerInfo,
  typingUsers,
  unreadMessageCount,
  activeChatRoomId,
  onChatRoomClick,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  const handleSelectOption = async (option, message) => {
    // if (option === "Message info") {
    //   openMessageInfoPanel(message);
    // } else if (option === "Delete for everyone") {
    //   const isSuccess = await handleDeleteMessageForEveryone(message.id);
    // } else if (option === "Delete for me") {
    //   const isSuccess = await handleDeleteMessageForMe(message.id);
    //   if (isSuccess) {
    //     updateDeletedMessage(chatRoomId, message.id, true);
    //   }
    // }
    // setIsOpen(null);
  };

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
            {options && (
              <>
                <img
                  src={messageOptionsIcon}
                  className="messageOptionsIcon"
                  style={{
                    backgroundColor: "rgb(210, 255, 160)",
                  }}
                  onClick={() => toggleDropdown()}
                />
                <div style={{ position: "absolute" }}>
                  {isOpen && (
                    <OptionsDropdown
                      options={options}
                      onSelect={handleSelectOption}
                      isOpen={isOpen}
                      toggleDropdown={toggleDropdown}
                      parentButtonRef={"messageOptionsIcon"}
                    />
                  )}
                </div>
              </>
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
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
