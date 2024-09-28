import deliveredStatusIcon from "../assets/deliveredStatus.png";
import readStatusIcon from "../assets/readStatus.png";
import pendingStatusIcon from "../assets/pendingStatus.png";
import sendingStatusIcon from "../assets/SendingStatus.png";

const MessageStatusIcon = ({ status, formattedTime }) => {
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

  // Render message with status icon
  return (
    <div className="messageTimeStatus">
      <div className="message-time">{formattedTime}</div>
      <img
        src={getStatusIcon()}
        className="messagetStatus"
        alt="Message Status"
      />
    </div>
  );
};

export default MessageStatusIcon;
