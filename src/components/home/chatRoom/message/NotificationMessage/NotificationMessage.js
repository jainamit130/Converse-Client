import "./NotificationMessage.css";

const NotificationMessage = ({ content }) => {
  return (
    <div className="notification-message">
      <div className="notification-content">{content}</div>
    </div>
  );
};

export default NotificationMessage;
