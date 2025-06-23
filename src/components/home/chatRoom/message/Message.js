import React, { useEffect, useState } from "react";
import MessageStatusIcon from "../message/messageStatus/MessageStatus";
import { formatTime, parseDate } from "../../../../util/dateUtil";
import "./Message.css";
import { toggleDropdown } from "./util/MessageUtil";
import Options from "../../../reusableComponents/OptionsDropdown/Options";
import messageOptionsIcon from "../../../../assets/MessageOptions.png";
import DeletedMessageStyle from "./util/DeletedMessageStyle/DeletedMessageStyle";
import useDelete from "../hook/useDelete";
import MessageOptions from "../../../reusableComponents/OptionsDropdown/MessageOptions";
import { useChatRoomContext } from "../../../../context/ChatRoomContext";
import NotificationMessage from "./NotificationMessage/NotificationMessage";

const Message = ({ message, handleDeleteMessages, onOpenInfoPanel }) => {
  const [userId] = useState(localStorage.getItem("userId"));
  const { activeChatRoomId, activeChatRoomType } = useChatRoomContext();
  const { name, content, deletedForEveryone, timestamp, id, senderId, status } =
    message;
  const [isUserMessage] = useState(senderId === userId);
  const messageDate = parseDate(timestamp);
  const { deleteMessages } = useDelete();
  const isWithinDeleteWindow = Date.now() - messageDate.getTime() <= 60000;
  const [isOptionsOpen, setIsOptionsOpen] = useState(null);
  const [options, setOptions] = useState(["Delete for me", "Message info"]);
  const formattedTime = formatTime(messageDate);

  const handleSelectOption = async (option, message) => {
    if (option === "Delete for me") {
      handleDeleteMessages({
        messageIds: [message.id],
        deleteMessages,
      });
    } else if (option === "Delete for everyone") {
      await deleteMessages({
        chatRoomId: activeChatRoomId,
        messageIds: [message.id],
        forEveryone: true,
      });
    } else if (option === "Message info") {
      onOpenInfoPanel(message);
    }
    setIsOptionsOpen(null);
  };

  if (message.__typename === "NotificationMessage") {
    return (
      <NotificationMessage
        content={content}
        isChatHistoryShared={message?.isChatHistoryShared}
      />
    );
  }

  return (
    <div
      key={id}
      className={`message ${
        senderId === userId ? "message-right" : "message-left"
      }`}
    >
      <div className="messageHeader">
        {activeChatRoomType === "GROUP" && !deletedForEveryone && (
          <div className="messageSenderName">
            {isUserMessage ? "You" : name}
          </div>
        )}
        <div>
          {
            <MessageOptions
              id={id}
              isOpen={isOptionsOpen}
              optionsIcon={messageOptionsIcon}
              isUserMessage={isUserMessage}
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
              onSelect={(option) => handleSelectOption(option, message)}
            ></MessageOptions>
          }
        </div>
      </div>
      <div className="messageContent">
        {deletedForEveryone ? (
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
          deletedForEveryone={deletedForEveryone}
        />
      }
    </div>
  );
};

export default Message;
