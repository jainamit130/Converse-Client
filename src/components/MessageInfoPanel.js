import { useEffect, useState } from "react";
import { useMessageInfo } from "../hooks/useMessageInfo";
import "./MessageInfoPanel.css";
import { formatMessageTimestamp } from "../util/dateUtil";

const MessageInfoPanel = ({ message, onClose }) => {
  const { getMessageInfo } = useMessageInfo();
  const [messageInfo, setMessageInfo] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchMessageInfo = async () => {
      if (message) {
        const data = await getMessageInfo(message.id);
        setMessageInfo(data);
      }
    };

    fetchMessageInfo();
    setIsVisible(true); // Set to visible when fetching starts

    return () => {
      setIsVisible(false); // Hide when unmounting
    };
  }, [getMessageInfo, message]);

  if (!messageInfo) {
    return <div>Loading...</div>;
  }

  const { deliveryReceiptsByTime = {}, readReceiptsByTime = {} } = messageInfo;

  return (
    <div className={`message-info-panel ${isVisible ? "visible" : ""}`}>
      <button className="close-button" onClick={onClose}>
        Close
      </button>
      <div className="message-content">
        <h2>Message: {message.content}</h2>
        <h3>Read Receipts</h3>
        <div className="receipt-section">
          {Object.entries(readReceiptsByTime).length === 0 ? (
            <div>No read receipts available.</div>
          ) : (
            Object.entries(readReceiptsByTime).map(([timestamp, usernames]) => (
              <div key={timestamp} className="receipt">
                <strong>{formatMessageTimestamp(timestamp)}:</strong>{" "}
                {Array.from(usernames).join(", ")}
              </div>
            ))
          )}
        </div>
        <h3>Delivery Receipts</h3>
        <div className="receipt-section">
          {Object.entries(deliveryReceiptsByTime).length === 0 ? (
            <div>No delivery receipts available.</div>
          ) : (
            Object.entries(deliveryReceiptsByTime).map(
              ([timestamp, usernames]) => (
                <div key={timestamp} className="receipt">
                  <strong>{formatMessageTimestamp(timestamp)}:</strong>{" "}
                  {Array.from(usernames).join(", ")}
                </div>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageInfoPanel;
