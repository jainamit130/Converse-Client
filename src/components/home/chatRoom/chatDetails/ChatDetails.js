import { useEffect, useState } from "react";
import "./ChatDetails.css";
import { useChatRoomContext } from "../../../../context/ChatRoomContext";
import ChatHeaderOptionsIcon from "../../../../assets/groupOptionsIcon.png";
import BackButton from "../../../../assets/WhitebackButton.png";
import Options from "../../../reusableComponents/OptionsDropdown/Options";
import MemberStatus from "./MemberStatus/MemberStatus";

const ChatDetails = ({
  handleClearChat,
  handleDeleteChat,
  handleChatDetailsPanel,
  handleBack,
}) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(null);
  const { activeChatRoomId, activeChatRoomName, activeChatRoomType } =
    useChatRoomContext();
  const [options, setOptions] = useState(["Clear Chat", "Delete Chat"]);

  const isTempChat = activeChatRoomId === "temp";

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelectOption = async (event, option) => {
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
      <div style={{ display: "flex" }}>
        {isMobile && (
          <img
            src={BackButton}
            alt="Back"
            className="backButton"
            onClick={handleBack}
          />
        )}
        <div className="chatRoomName" onClick={handleChatDetailsPanel}>
          {activeChatRoomName}
          {!isTempChat && (
            <MemberStatus chatRoomType={activeChatRoomType}></MemberStatus>
          )}
        </div>
      </div>
      <Options
        id={activeChatRoomId}
        isOpen={isOptionsOpen}
        optionsIcon={ChatHeaderOptionsIcon}
        options={options}
        toggleDropdown={toggleDropdown}
        onSelect={handleSelectOption}
        handleClearChat={handleClearChat}
        shouldStayVisible={true}
        optionsIconClassName="optionsClassName"
      ></Options>
    </div>
  );
};

export default ChatDetails;
