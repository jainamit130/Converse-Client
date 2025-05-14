import { useRef, useState } from "react";
import sendButtonIcon from "../../../../assets/SendButton.png";
import "./ChatInput.css";
import { useChatRoomWebSocket } from "../../../../context/WebSocketContext/ChatRoomWebSocketContext";
import { TypingHandlerService } from "./service/TypingHandlerService";

const ChatInput = ({ chatRoomId }) => {
  const { send } = useChatRoomWebSocket();
  const [message, setMessage] = useState("");

  const typingTimeoutRef = useRef(null);
  const { handleTyping, handleStopTyping } =
    TypingHandlerService(typingTimeoutRef);

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = (messageContent) => {
    const newMessage = {
      content: messageContent,
    };
    send("send/message/", newMessage);
    setMessage("");
  };

  return (
    <div className="chatInputComponent">
      <form
        className="chatInputForm"
        onSubmit={(e) => {
          handleStopTyping();
          e.preventDefault();
          const messageContent = e.target.elements.messageContent.value;
          handleSendMessage(messageContent);
          e.target.reset();
        }}
      >
        <input
          className="chatInput"
          onKeyDown={(event) => handleTyping(event)}
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
