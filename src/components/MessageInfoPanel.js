import { useEffect, useState } from "react";
import { useMessageInfo } from "../hooks/useMessageInfo";
import "./InfoPanel.css";
import {
  formatMessageTimestamp,
  formatTime,
  parseDate,
} from "../util/dateUtil";
import readStatusIcon from "../assets/readStatus.png";
import deliveredStatusIcon from "../assets/deliveredStatus.png";
import closeButtonIcon from "../assets/CloseButton.png";
import Tile from "./reusableComponents/Tile";
import ProfileIcon from "../assets/profileIcon.webp";
import { useUser } from "../context/UserContext";
import MessageStatusIcon from "./MessageStatusIcon";

const MessageInfoPanel = ({ message, userClicked, onClose }) => {
  const { getMessageInfo } = useMessageInfo();
  const { userId, username } = useUser();
  const [messageInfo, setMessageInfo] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const messageDate = parseDate(message.timestamp);
  const formattedTime = formatTime(messageDate);

  useEffect(() => {
    const fetchMessageInfo = async () => {
      if (message) {
        const data = await getMessageInfo(message.id);
        setMessageInfo(data);
      }
    };

    fetchMessageInfo();
    setIsVisible(true);

    return () => {
      setIsVisible(false);
    };
  }, [message]);

  if (!messageInfo) {
    return <div>Loading...</div>;
  }

  const recipients = {};

  Object.entries(messageInfo.deliveryReceiptsByTime || {}).forEach(
    ([timestamp, userDetails]) => {
      userDetails.forEach((userDetail) => {
        if (username !== userDetail.username && userDetail.id) {
          if (!recipients[userDetail.username]) {
            recipients[userDetail.username] = {};
          }
          recipients[userDetail.username].delivered = timestamp;
          recipients[userDetail.username].id = userDetail.id;
        }
      });
    }
  );

  Object.entries(messageInfo.readReceiptsByTime || {}).forEach(
    ([timestamp, userDetails]) => {
      userDetails.forEach((userDetail) => {
        if (username !== userDetail.username && userDetail.id) {
          if (!recipients[userDetail.username]) {
            recipients[userDetail.username] = {};
          }
          recipients[userDetail.username].read = timestamp;
          recipients[userDetail.username].id = userDetail.id;
        }
      });
    }
  );

  return (
    <div className={`info-panel ${isVisible ? "visible" : ""}`}>
      <div style={{ display: "flex", alignItems: "center", margin: "2px" }}>
        <img
          src={closeButtonIcon}
          className="close-button"
          alt="close"
          onClick={onClose}
        />
        <span style={{ marginLeft: "10px" }}>Message info</span>
      </div>
      <div className="message-content">
        <div className="message">
          <div className="message-right">
            {message.content}
            <MessageStatusIcon
              key={message.id}
              isSender={message.senderId === userId}
              status={message.status}
              formattedTime={formattedTime}
            />
          </div>
        </div>
      </div>

      <div style={{ margin: "20px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={readStatusIcon} className="infoIcon" alt="read status" />
          <div className="infoTitle">Read</div>
        </div>
        <div className="receipt-section">
          {Object.entries(recipients)
            .filter(([, receipt]) => receipt.read)
            .map(([username, receipt]) => (
              <Tile
                key={username}
                id={receipt.id}
                tileClick={userClicked}
                name={username}
                icon={ProfileIcon}
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
        </div>
      </div>

      {/* Delivered section */}
      <div style={{ margin: "20px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={deliveredStatusIcon}
            className="infoIcon"
            alt="delivered status"
          />
          <div className="infoTitle">Delivered</div>
        </div>
        <div className="receipt-section">
          {Object.entries(recipients)
            .filter(([, receipt]) => !receipt.read) // Show only delivered, not read
            .map(([username, receipt]) => (
              <Tile
                key={username}
                id={receipt.id}
                tileClick={userClicked}
                name={username}
                icon={ProfileIcon}
                smallerInfo={
                  <div className="receipt">
                    Delivered: {formatMessageTimestamp(receipt.delivered)}
                  </div>
                }
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default MessageInfoPanel;
