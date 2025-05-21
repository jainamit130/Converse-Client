import "./BackButton.css";
import backButton from "./../../../../../assets/backButton.png";

const BackButton = () => {
  return (
    <div>
      <img
        src={backButton}
        className="back-btn"
        onClick={() => {
          if (isNewGroup) {
            if (addMemberChatRoom) {
              onClose(null);
            }
            setIsNewGroup(false);
          } else onClose(null);
          setChatRoomType("INDIVIDUAL");
        }}
      />
      <span className="newChatHeader">New Chat</span>
    </div>
  );
};

export default BackButton;
