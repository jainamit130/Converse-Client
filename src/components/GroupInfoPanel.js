import { useState } from "react";
import GroupIcon from "../assets/GroupIcon.png";
import closeButtonIcon from "../assets/CloseButton.png";
import profileIcon from "../assets/profileIcon.webp";
import "./InfoPanel.css";
import Tile from "./reusableComponents/Tile";
import { useChatRoom } from "../context/ChatRoomContext";
import { useUser } from "../context/UserContext";

const GroupInfoPanel = ({ chatRoomId, onClose }) => {
  const { setActiveChatRoomId } = useUser();
  const { chatRooms } = useChatRoom();
  const chatRoom = chatRooms.get(chatRoomId); // Get chat room details
  const [isVisible, setIsVisible] = useState(true);

  const handleChatRoomClick = () => {
    console.log("ChatRoom clicked");
  };

  const handleAddMember = () => {
    console.log("Add Member clicked");
  };

  const handleRemoveMember = (userId) => {
    console.log("Remove member:", userId);
  };

  const handleGroupAction = () => {
    if (chatRoom.isExited) {
      console.log("Delete Group logic here");
    } else {
      console.log("Exit Group logic here");
    }
  };

  return (
    <div className={`info-panel ${isVisible ? "visible" : ""}`}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "2px",
        }}
      >
        <img
          src={closeButtonIcon}
          className="close-button"
          alt="close"
          onClick={onClose}
        />
        <span style={{ marginLeft: "10px" }}>Contact info</span>
      </div>

      <div
        className="profile-icon-container"
        style={{ textAlign: "center", marginTop: "20px" }}
      >
        <img
          src={GroupIcon}
          alt="Profile"
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />

        <h2>{chatRoom.name}</h2>
      </div>

      <div style={{ marginTop: "30px", padding: "0 20px" }}>
        <h3 style={{ fontSize: "18px", color: "#333", marginBottom: "10px" }}>
          Group Members
        </h3>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {chatRoom.userIds.map((userId) => {
            return (
              <Tile
                key={userId}
                id={userId}
                onChatRoomClick={handleChatRoomClick}
                name={userId}
                icon={profileIcon}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default GroupInfoPanel;
