import TypingIndicator from "../../sideComponents/TypingIndicator";
import { formatTime, parseDate } from "../../../util/dateUtil";
import "../Tile/Tile.css";
import Options from "../OptionsDropdown/Options";
import optionsIcon from "../../../assets/MessageOptions.png";
import MessageStatusIcon from "../../home/chatRoom/message/messageStatus/MessageStatus";

const Tile = ({
  id,
  name,
  type,
  options,
  timestamp,
  message, // Nullable or present
  userId, // Nullable or present
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

  const handleTileClick = () => {
    if (!isOpen && tileClick) {
      tileClick({
        id,
        name,
        type,
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
      onClick={handleTileClick}
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
              <Options
                id={id}
                isOpen={isOpen}
                options={options}
                toggleDropdown={toggleDropdown}
                onSelect={handleSelectOption}
                optionsIcon={optionsIcon}
              ></Options>
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
              message && (
                <div className="latestMessageContainer">
                  <MessageStatusIcon
                    status={message.status}
                    isSender={message.senderId === userId}
                    deletedForEveryone={message.deletedForEveryone}
                  ></MessageStatusIcon>
                  <div className="primarySubInfo">
                    {titleSubInfo && !message.deletedForEveryone
                      ? `${titleSubInfo}: ${primarySubInfo}`
                      : primarySubInfo}
                  </div>
                </div>
              )
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
