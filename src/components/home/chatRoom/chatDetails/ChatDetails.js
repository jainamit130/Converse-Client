import { useState } from "react";
import "./ChatDetails.css";
import { useChatRoomContext } from "../../../../context/ChatRoomContext";
import ChatHeaderOptionsIcon from "../../../../assets/groupOptionsIcon.png";
import Options from "../../../reusableComponents/OptionsDropdown/Options";
import MemberStatus from "./MemberStatus/MemberStatus";

const ChatDetails = ({ handleClearChat, handleDeleteChat, chatRoomType }) => {
  const [chatRoomName, setChatRoomName] = useState(
    localStorage.getItem("activeChatRoomName")
  );
  const [chatRoomId, setChatRoomId] = useState(
    localStorage.getItem("activeChatRoomId")
  );
  const [isOptionsOpen, setIsOptionsOpen] = useState(null);
  const { typing, onlineUsers, lastSeen } = useChatRoomContext();
  const [options, setOptions] = useState(["Clear Chat", "Delete Chat"]);

  const handleSelectOption = async (option) => {
    if (option == "Clear Chat") {
      handleClearChat();
    } else if (option == "Delete Chat") {
      handleDeleteChat();
    }
    setIsOptionsOpen(null);
  };

  const toggleDropdown = () => {
    if (isOptionsOpen) {
      setIsOptionsOpen(null);
    } else {
      setIsOptionsOpen(true);
    }
  };

  return (
    <div className="chatDetails">
      <div className="chatRoomName">
        {chatRoomName}
        <MemberStatus chatRoomType={chatRoomType}></MemberStatus>
      </div>
      <Options
        id={chatRoomId}
        isOpen={isOptionsOpen}
        optionsIcon={ChatHeaderOptionsIcon}
        options={options}
        toggleDropdown={toggleDropdown}
        onSelect={handleSelectOption}
        handleClearChat={handleClearChat}
      ></Options>
    </div>
  );
};

export default ChatDetails;
