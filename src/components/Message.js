import React from "react";
import MessageStatusIcon from "./MessageStatusIcon";

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
      {
        <MessageStatusIcon
          key={message.id}
          isSender={message.senderId === userId}
          status={message.status}
          formattedTime={formattedTime}
        />
      }
    </div>
  );
};

export default Message;
