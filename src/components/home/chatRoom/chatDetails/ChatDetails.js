import { useEffect, useState } from "react";
import "./ChatDetails.css";

const ChatDetails = () => {
  const [chatRoomName, setChatRoomName] = useState(
    localStorage.getItem("activeChatRoomName")
  );
  const [chatRoomId, setChatRoomId] = useState(
    localStorage.getItem("activeChatRoomId")
  );
  // number of people online
  const [onlineUsers, setOnlineUsers] = useState([]);
  // online or last seen
  const [lastSeen, setLastSeen] = useState();
  // typing - name or count
  const [typing, setTyping] = useState([]);

  return (
    <div className="chatDetails">
      <div className="chatRoomName">{chatRoomName}</div>
    </div>
  );
};

export default ChatDetails;
