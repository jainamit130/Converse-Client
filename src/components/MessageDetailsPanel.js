import React from "react";
import { formatTime } from "../util/dateUtil.js";
import "./MessageDetailsPanel.css";

const MessageDetailsPanel = ({ selectedMessage, onClose }) => {
  if (!selectedMessage) return null;

  return (
    <div className="message-details-panel">
      <div className="message-details-header">
        <div>Message Details</div>
        <button onClick={onClose}>Close</button>
      </div>
      <div className="message-details-content">
        <div className="message-details-item">
          <strong>Message:</strong>
          <div>{selectedMessage.content}</div>
        </div>
        <div className="message-details-item">
          <strong>Delivered Status:</strong>
          <div>
            {selectedMessage.deliveredRecipients?.size > 0
              ? Array.from(selectedMessage.deliveredRecipients).map(
                  (userId) => {
                    return (
                      <div key={userId}>
                        {userId} - Delivered at{" "}
                        {formatTime(
                          selectedMessage.deliveryReceiptsByTime[userId]
                        )}
                      </div>
                    );
                  }
                )
              : "Not Delivered"}
          </div>
        </div>
        <div className="message-details-item">
          <strong>Read Status:</strong>
          <div>
            {selectedMessage.readRecipients?.size > 0
              ? Array.from(selectedMessage.readRecipients).map((userId) => {
                  return (
                    <div key={userId}>
                      {userId} - Read at{" "}
                      {formatTime(selectedMessage.readReceiptsByTime[userId])}
                    </div>
                  );
                })
              : "Not Read"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDetailsPanel;
