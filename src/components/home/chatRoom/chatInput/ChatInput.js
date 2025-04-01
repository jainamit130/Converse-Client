import { useState } from "react";
import sendButtonIcon from "../../../../assets/SendButton.png";
import "./ChatInput.css";
import { useChatRoomWebSocket } from "../../../../context/WebSocketContext/ChatRoomWebSocketContext";

const ChatInput = ({ chatRoomId }) => {
  const { send } = useChatRoomWebSocket();
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = (messageContent) => {
    const newMessage = {
      content: messageContent,
    };
    send("send/Message/", newMessage);
    setMessage("");
  };

  return (
    <div className="chatInputComponent">
      <form
        className="chatInputForm"
        onSubmit={(e) => {
          e.preventDefault();
          const messageContent = e.target.elements.messageContent.value;
          handleSendMessage(messageContent);
          e.target.reset();
        }}
      >
        <input
          className="chatInput"
          // onKeyDown={(event) => handleTyping(chatRoomId, event)}
          type="text"
          value={message}
          onChange={handleChange}
          name="messageContent"
          placeholder="Type your message..."
          required
        />

        {message.trim().length > 0 && (
          <button type="submit" className="sendButton">
            <img src={sendButtonIcon} alt="Submit" />
          </button>
        )}
      </form>
    </div>
  );
};

export default ChatInput;
