import { useEffect, useRef, useState } from "react";
import sendButtonIcon from "../../../../assets/SendButton.png";
import "./ChatInput.css";
import { useChatRoomWebSocket } from "../../../../context/WebSocketContext/ChatRoomWebSocketContext";
import { TypingHandlerService } from "./service/TypingHandlerService";
import useCreateChat from "../../Users/hook/useCreateChat";
import { useChatRoomContext } from "../../../../context/ChatRoomContext";

const ChatInput = () => {
  const { send } = useChatRoomWebSocket();
  const { activeChatRoomId } = useChatRoomContext();
  const [message, setMessage] = useState("");
  const { createChat } = useCreateChat();
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const { handleTyping, handleStopTyping } = TypingHandlerService({
    typingTimeoutRef,
    isTypingRef,
  });

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = async (messageContent) => {
    const newMessage = {
      content: messageContent,
    };
    if (activeChatRoomId !== "temp") {
      send("send/message/", newMessage);
    } else {
      const userId = localStorage.getItem("newDirectChatUserId");
      const result = await createChat(userId, newMessage);

      if (result.error) {
        console.log("Failed to create new direct chat!");
      } else if (result) {
        localStorage.removeItem("newDirectChatUserId");
      }
    }
    setMessage("");
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="chatInputComponent">
      <form
        className="chatInputForm"
        onSubmit={(e) => {
          if (activeChatRoomId !== "temp") {
            handleStopTyping(send);
          }
          e.preventDefault();
          const messageContent = e.target.elements.messageContent.value;
          handleSendMessage(messageContent);
          e.target.reset();
        }}
      >
        <input
          className="chatInput"
          onKeyDown={(event) => {
            if (activeChatRoomId !== "temp") {
              handleTyping(event, send);
            }
          }}
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
