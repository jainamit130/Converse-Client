import React, { useEffect, useState } from "react";
import MessageStatusIcon from "../message/messageStatus/MessageStatus";
import { formatTime, parseDate } from "../../../../util/dateUtil";
import "./Message.css";

const Message = ({ message }) => {
  const [userId] = useState(localStorage.getItem("userId"));
  const [chatRoomType] = useState(localStorage.getItem("activeChatRoomType"));
  const { name, content, timestamp, id, senderId, status } = message;
  const messageDate = parseDate(timestamp);
  const formattedTime = formatTime(messageDate);

  return (
    <div
      key={id}
      className={`message ${
        senderId === userId ? "message-right" : "message-left"
      }`}
    >
      {chatRoomType === "GROUP" && (
        <div className="messageSenderName">
          {senderId === userId ? "You" : name}
        </div>
      )}
      <div className="messageContent">{content}</div>
      {
        <MessageStatusIcon
          key={id}
          isSender={senderId === userId}
          status={status}
          formattedTime={formattedTime}
        />
      }
    </div>
  );
};

export default Message;
