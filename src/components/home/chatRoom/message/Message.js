import React, { useEffect, useState } from "react";
import MessageStatusIcon from "../message/messageStatus/MessageStatus";
import { formatTime, parseDate } from "../../../../util/dateUtil";
import "./Message.css";
import { toggleDropdown } from "./util/MessageUtil";
import MessageOptions from "../../../reusableComponents/OptionsDropdown/MessageOptions";
import DeletedMessageStyle from "./util/DeletedMessageStyle";
import useDelete from "./hook/useDelete";

const Message = ({ message }) => {
  const [userId] = useState(localStorage.getItem("userId"));
  const [chatRoomId] = useState(localStorage.getItem("activeChatRoomId"));
  const [chatRoomType] = useState(localStorage.getItem("activeChatRoomType"));
  const { name, content, timestamp, id, senderId, status } = message;
  const [isUserMessage] = useState(senderId === userId);
  const messageDate = parseDate(timestamp);
  const isWithinDeleteWindow = Date.now() - messageDate.getTime() <= 60000;
  const [isOptionsOpen, setIsOptionsOpen] = useState(null);
  const [options, setOptions] = useState(["Delete for me", "Message info"]);
  const formattedTime = formatTime(messageDate);
  const { deleteMessages } = useDelete();

  const handleSelectOption = async (option, messageId) => {
    console.log(option + " -> " + message);
    if (option === "Delete for me") {
      await deleteMessages({ chatRoomId, messageIds: [messageId] });
    } else if (option === "Delete for everyone") {
      await deleteMessages({
        chatRoomId,
        messageIds: [messageId],
        forEveryone: true,
      });
    }
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
      <div className="messageContent">
        {message.deletedForEveryOne ? (
          <DeletedMessageStyle senderId={message.senderId} userId={userId} />
        ) : (
          content
        )}
      </div>
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
