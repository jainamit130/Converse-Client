import React from "react";
import MessageStatusIcon from "./MessageStatusIcon"; // Assuming MessageStatusIcon is in the same directory or adjust accordingly

const Message = ({ message, userId, openMessageInfoPanel, formattedTime }) => {
  return (
    <div
      key={message.id}
      className={`message ${
        message.senderId === userId ? "message-right" : "message-left"
      }`}
      onClick={() => openMessageInfoPanel(message)}
    >
      <div className="messageContent">{message.content}</div>
      {message.senderId === userId && (
        <MessageStatusIcon
          key={message.id}
          status={message.status}
          formattedTime={formattedTime}
        />
      )}
    </div>
  );
};

export default Message;
