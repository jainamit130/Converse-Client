import { useState } from "react";
import "./ChatDetails.css";

const ChatDetails = ({ chatRoomName, chatRoomId }) => {
  // number of people online
  const [onlineUsers, setOnlineUsers] = useState([]);
  // online or last seen
  const [lastSeen, setLastSeen] = useState();
  // typing - name or count
  const [typing, setTyping] = useState([]);

  return <div className="chatDetails"></div>;
};

export default ChatDetails;
