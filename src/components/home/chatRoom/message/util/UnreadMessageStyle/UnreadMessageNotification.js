import "./UnreadMessageNotification.css";

const UnreadMessageNotification = ({ unreadMessageCount }) => {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="unread-message-marker">
          {unreadMessageCount} Unread Message
          {unreadMessageCount !== 1 ? "s" : ""}
        </div>
      </div>
      <div className="unread-message-line"></div>
    </div>
  );
};

export default UnreadMessageNotification;
