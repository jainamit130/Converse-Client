import { useEffect, useRef, useState } from "react";
import useGetMessageInfo from "../../hook/useGetMessageInfo";
import closeButtonIcon from "../../../../../assets/CloseButton.png";
import Tile from "../../../../reusableComponents/Tile/Tile";
import "./MessageInfoPanel.css";
import {
  formatMessageTimestamp,
  formatTime,
  parseDate,
} from "../../../../../util/dateUtil";
import { iconType } from "../../../../MappingTypes/iconFactory";
import readStatusIcon from "./../../../../../assets/readStatus.png";
import deliveredStatusIcon from "./../../../../../assets/deliveredStatus.png";
import Message from "../Message";

const MessageInfoPanel = ({ message }) => {
  const { getMessageInfo } = useGetMessageInfo();
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");
  const [messageInfo, setMessageInfo] = useState(null);
  const messageDate = parseDate(message.timestamp);

  useEffect(() => {
    const fetchMessageInfo = async () => {
      if (message?.id) {
        const info = await getMessageInfo({ messageId: message.id });
        setMessageInfo(info);
      }
    };
    fetchMessageInfo();
  }, [message]);

  if (!messageInfo) return <div className="messageInfoPanel">Loading...</div>;

  const recipients = {};

  // Group delivered
  Object.entries(messageInfo.deliveryReceiptsByTime || {}).forEach(
    ([timestamp, users]) => {
      users.forEach((user) => {
        if (
          user.username !== username &&
          user.userId &&
          user.userId !== userId
        ) {
          if (!recipients[user.username]) recipients[user.username] = {};
          recipients[user.username].delivered = timestamp;
          recipients[user.username].id = user.userId;
        }
      });
    }
  );

  // Group read
  Object.entries(messageInfo.readReceiptsByTime || {}).forEach(
    ([timestamp, users]) => {
      users.forEach((user) => {
        if (
          user.username !== username &&
          user.userId &&
          user.userId !== userId
        ) {
          if (!recipients[user.username]) recipients[user.username] = {};
          recipients[user.username].read = timestamp;
          recipients[user.username].id = user.userId;
        }
      });
    }
  );

  return (
    <div>
      <div className="message-content">
        <Message message={message}></Message>
      </div>
      <div className="messageReceipts">
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={readStatusIcon} className="infoIcon" alt="read status" />
          <div className="infoTitle">Read</div>
        </div>
        {Object.entries(recipients)
          .filter(([, receipt]) => receipt.read)
          .map(([user, receipt]) => (
            <Tile
              key={user}
              id={receipt.id}
              name={user}
              icon={iconType("DIRECT")}
              smallerInfo={
                <div className="receipt">
                  <div>Read: {formatMessageTimestamp(receipt.read)}</div>
                  <div>
                    Delivered: {formatMessageTimestamp(receipt.delivered)}
                  </div>
                </div>
              }
            />
          ))}
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={deliveredStatusIcon}
            className="infoIcon"
            alt="delivered status"
          />
          <div className="infoTitle">Delivered</div>
        </div>
        {Object.entries(recipients)
          .filter(([, receipt]) => !receipt.read)
          .map(([user, receipt]) => (
            <Tile
              key={user}
              id={receipt.id}
              name={user}
              icon={iconType("DIRECT")}
              smallerInfo={
                <div className="receipt">
                  Delivered: {formatMessageTimestamp(receipt.delivered)}
                </div>
              }
            />
          ))}
      </div>
    </div>
  );
};

export default MessageInfoPanel;
