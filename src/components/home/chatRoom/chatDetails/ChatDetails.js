import { useEffect, useState } from "react";
import "./ChatDetails.css";
import { useChatRoomContext } from "../../../../context/ChatRoomContext";
import TypingIndicator from "../../../sideComponents/TypingIndicator";
import ChatHeaderOptionsIcon from "../../../../assets/groupOptionsIcon.png";
import Options from "../../../reusableComponents/OptionsDropdown/Options";

const ChatDetails = ({ handleClearChat }) => {
  const [chatRoomName, setChatRoomName] = useState(
    localStorage.getItem("activeChatRoomName")
  );
  const [chatRoomId, setChatRoomId] = useState(
    localStorage.getItem("activeChatRoomId")
  );
  const [isOptionsOpen, setIsOptionsOpen] = useState(null);
  const { typing } = useChatRoomContext();
  const [options, setOptions] = useState(["Clear Chat"]);

  const handleSelectOption = async (option) => {
    if (option == "Clear Chat") {
      handleClearChat();
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
        <TypingIndicator typingUsers={typing}></TypingIndicator>
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
