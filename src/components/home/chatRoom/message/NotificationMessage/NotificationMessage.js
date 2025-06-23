import "./NotificationMessage.css";
import chatHistorySharedIcon from "../../../../../assets/isChatHistoryShared.png";

const NotificationMessage = ({ content, isChatHistoryShared = false }) => {
  return (
    <div className="notification-message">
      <div className="notification-content">
        {content}
        {isChatHistoryShared && (
          <img
            src={chatHistorySharedIcon}
            alt="Chat history shared"
            className="chat-history-shared-icon"
          />
        )}
      </div>
    </div>
  );
};

export default NotificationMessage;
