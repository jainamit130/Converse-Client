import deliveredStatusIcon from "../../../../../assets/deliveredStatus.png";
import readStatusIcon from "../../../../../assets/readStatus.png";
import pendingStatusIcon from "../../../../../assets/pendingStatus.png";
import sendingStatusIcon from "../../../../../assets/SendingStatus.png";
import "./MessageStatus.css";

const MessageStatusIcon = ({
  status,
  formattedTime,
  isSender,
  deletedForEveryone,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case "DELIVERED":
        return deliveredStatusIcon;
      case "READ":
        return readStatusIcon;
      case "PENDING":
        return pendingStatusIcon;
      default:
        return sendingStatusIcon;
    }
  };

  return (
    <div className="messageTimeStatus">
      {formattedTime && <div className="message-time">{formattedTime}</div>}
      {!deletedForEveryone && isSender && (
        <img
          src={getStatusIcon()}
          className="messagetStatus"
          alt="Message Status"
        />
      )}
    </div>
  );
};

export default MessageStatusIcon;
