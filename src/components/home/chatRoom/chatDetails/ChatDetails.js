import { useEffect, useState } from "react";
import "./ChatDetails.css";
import { useChatRoomContext } from "../../../../context/ChatRoomContext";
import ChatHeaderOptionsIcon from "../../../../assets/groupOptionsIcon.png";
import Options from "../../../reusableComponents/OptionsDropdown/Options";
import MemberStatus from "./MemberStatus/MemberStatus";

const ChatDetails = ({ handleClearChat, handleDeleteChat }) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(null);
  const { activeChatRoomId, activeChatRoomName, activeChatRoomType } =
    useChatRoomContext();
  const [options, setOptions] = useState(["Clear Chat", "Delete Chat"]);

  const isTempChat = activeChatRoomId === "temp";

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
        {activeChatRoomName}
        {!isTempChat && (
          <MemberStatus chatRoomType={activeChatRoomType}></MemberStatus>
        )}
      </div>
      <Options
        id={activeChatRoomId}
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
