import "./BackButton.css";
import backButton from "./../../../../../assets/backButton.png";

const BackButton = ({ toggle, title = "New Chat" }) => {
  return (
    <div className="newChatHeader">
      <img src={backButton} className="back-btn" onClick={toggle} />
      <span className="newChatFont">{title}</span>
    </div>
  );
};

export default BackButton;
