import React from "react";
import TypingIndicator from "../../sideComponents/TypingIndicator";
import { formatTime, parseDate } from "../../../util/dateUtil";
import messageOptionsIcon from "../../../assets/MessageOptions.png";
import OptionsDropdown from "../OptionsDropdown/OptionsDropdown";
import "../Tile/Tile.css";

const Tile = ({
  id,
  name,
  type,
  options,
  timestamp,
  titleSubInfo, // Nullable
  primarySubInfo, // Nullable
  typingUsers, // Nullable Ex: user types then the primary info gets replaced by secondary subinfo
  unreadMessageCount, // Nullable/0 then dont show
  tileClick,
  optionsClicked,
  icon, // Not Nullable, Group/Direct PNG
  isOpen,
  toggleDropdown,
}) => {
  const handleSelectOption = async (event, option, id) => {
    optionsClicked(option, id);
    toggleDropdown(event, id);
    event.stopPropagation();
  };

  const handleChatRoomClick = () => {
    if (!isOpen && tileClick) {
      tileClick({
        chatRoomId: id,
        chatRoomName: name,
        chatRoomType: type,
      });
    }
  };

  const messageDate = timestamp ? parseDate(timestamp) : null;
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
        <img src={icon} className="icon" alt="Group Icon" />
        <div style={{ marginLeft: "10px", width: "100%" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div className="chatRoomTitle primarySubInfo">{name}</div>
            {formattedTime && <div className="timestamp">{formattedTime}</div>}
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
              <div className="primarySubInfo">
                {titleSubInfo
                  ? `${titleSubInfo}: ${primarySubInfo}`
                  : primarySubInfo}
              </div>
            )}
            {unreadMessageCount > 0 && (
              <div className="unreadMessages">{unreadMessageCount}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tile;
