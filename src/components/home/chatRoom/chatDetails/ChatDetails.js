import { useEffect, useState } from "react";
import "./ChatDetails.css";
import { useChatRoomContext } from "../../../../context/ChatRoomContext";
import TypingIndicator from "../../../sideComponents/TypingIndicator";

const ChatDetails = () => {
  const [chatRoomName, setChatRoomName] = useState(
    localStorage.getItem("activeChatRoomName")
  );
  const [chatRoomId, setChatRoomId] = useState(
    localStorage.getItem("activeChatRoomId")
  );

  const { typing } = useChatRoomContext();

  return (
    <div className="chatDetails">
      <div className="chatRoomName">
        {chatRoomName}
        <TypingIndicator typingUsers={typing}></TypingIndicator>
      </div>
    </div>
  );
};

export default ChatDetails;
