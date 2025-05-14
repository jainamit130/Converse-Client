import React, { useEffect, useState } from "react";
import MessageStatusIcon from "../message/messageStatus/MessageStatus";
import { formatTime, parseDate } from "../../../../util/dateUtil";
import "./Message.css";
import { toggleDropdown } from "./util/MessageUtil";
import MessageOptions from "../../../reusableComponents/OptionsDropdown/MessageOptions";

const Message = ({ message }) => {
  const [userId] = useState(localStorage.getItem("userId"));
  const [chatRoomType] = useState(localStorage.getItem("activeChatRoomType"));
  const { name, content, timestamp, id, senderId, status } = message;
  const [isUserMessage] = useState(senderId === userId);
  const messageDate = parseDate(timestamp);
  const isWithinDeleteWindow = Date.now() - messageDate.getTime() <= 60000;
  const [isOptionsOpen, setIsOptionsOpen] = useState(null);
  const [options, setOptions] = useState(["Delete for me", "Message info"]);
  const formattedTime = formatTime(messageDate);

  const handleSelectOption = async (option, message) => {
    console.log(option + " -> " + message);
    setIsOptionsOpen(null);
  };

  return (
    <div
      key={id}
      className={`message ${
        senderId === userId ? "message-right" : "message-left"
      }`}
    >
      <div className="messageHeader">
        {chatRoomType === "GROUP" && (
          <div className="messageSenderName">
            {isUserMessage ? "You" : name}
          </div>
        )}
        <div className="messageAction">
          {
            <MessageOptions
              id={id}
              isOpen={isOptionsOpen}
              options={options}
              toggleDropdown={() =>
                toggleDropdown(
                  message,
                  isOptionsOpen,
                  setIsOptionsOpen,
                  setOptions,
                  isWithinDeleteWindow,
                  isUserMessage
                )
              }
              onSelect={handleSelectOption}
            ></MessageOptions>
          }
        </div>
      </div>
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
