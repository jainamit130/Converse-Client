import React, { useEffect, useState } from "react";
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
  removeMember,
  icon,
  isOpen,
  toggleDropdown,
}) => {
  const handleSelectOption = async (event, option, id) => {
    if (option === "Remove Member") {
      removeMember(id);
    }
    toggleDropdown(event, id);
    event.stopPropagation();
  };

  const handleChatRoomClick = () => {
    if (!isOpen && onChatRoomClick) {
      onChatRoomClick(id, name);
    }
  };

  const messageDate = latestMessageTimestamp
    ? parseDate(latestMessageTimestamp)
    : null;
  const formattedTime = messageDate ? formatTime(messageDate) : null;

  return (
    <div
      key={id}
      className={`chat-room-tile`}
      style={{
        zIndex: isOpen ? 1000 : 1,
      }}
      onClick={handleChatRoomClick}
    >
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
              <div style={{ position: "absolute", right: "0" }}>
                <img
                  src={messageOptionsIcon}
                  className="messageOptionsIcon"
                  style={{
                    position: "relative",
                    alignItems: "center",
                    justifyItems: "self-end",
                  }}
                  onClick={(event) => toggleDropdown(event, id)}
                />
                <div style={{ position: "absolute", right: "200px" }}>
                  {isOpen && (
                    <OptionsDropdown
                      options={options}
                      onSelect={handleSelectOption}
                      toggleDropdown={(event) => toggleDropdown(event, id)}
                      parameter={id}
                      parentButtonRef={"messageOptionsIcon"}
                    />
                  )}
                </div>
              </div>
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
