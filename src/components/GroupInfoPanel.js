import { useState } from "react";
import GroupIcon from "../assets/GroupIcon.png";
import onlineIcon from "../assets/onlineStatus.png";
import offlineIcon from "../assets/offline.png";
import "./InfoPanel.css";
import Tile from "./reusableComponents/Tile";
import { useChatRoom } from "../context/ChatRoomContext";
import { useUser } from "../context/UserContext";

const GroupInfoPanel = ({ chatRoomId, onClose }) => {
  const { setActiveChatRoomId } = useUser();
  const { chatRooms } = useChatRoom();
  const chatRoom = chatRooms.get(chatRoomId); // Get chat room details
  const [isVisible, setIsVisible] = useState(true);

  // Handle Add Member button
  const handleAddMember = () => {
    // Add your logic to handle adding a new member
    console.log("Add Member clicked");
  };

  // Handle Remove Member button
  const handleRemoveMember = (userId) => {
    // Add your logic to handle removing a member
    console.log("Remove member:", userId);
  };

  // Handle Group Delete or Exit
  const handleGroupAction = () => {
    if (chatRoom.isExited) {
      console.log("Delete Group logic here");
    } else {
      console.log("Exit Group logic here");
    }
  };

  return (
    <div className={`info-panel ${isVisible ? "visible" : ""}`}>
      {/* Close button */}
      <button className="close-button" onClick={onClose}>
        ✕
      </button>

      {/* Group Icon */}
      <div className="group-info-header">
        <img src={GroupIcon} alt="Group Icon" className="group-icon" />
      </div>

      {/* Group Name */}
      <h2 className="group-name">{chatRoom.name}</h2>

      {/* Group Status */}
      <p className="group-status">
        Status:{" "}
        <img
          src={chatRoom.status === "ONLINE" ? onlineIcon : offlineIcon}
          alt={chatRoom.status === "ONLINE" ? "Online" : "Offline"}
          className="status-icon"
        />
        {chatRoom.status === "ONLINE" ? "Online" : "Offline"}
      </p>

      {/* Group Members Title */}
      <h3 className="members-title">Group Members</h3>

      {/* Add Member Button */}
      <button className="add-member-button" onClick={handleAddMember}>
        + Add Member
      </button>

      {/* List of Group Members */}
      <div className="group-members">
        {chatRoom.userIds.map((userId) => (
          <Tile key={userId} className="member-tile">
            <span>{userId}</span>
            <button
              className="remove-member-button"
              onClick={() => handleRemoveMember(userId)}
            >
              -
            </button>
          </Tile>
        ))}
      </div>

      {/* Exit/Delete Group Button */}
      <button className="group-action-button" onClick={handleGroupAction}>
        {chatRoom.isExited ? "Delete Group" : "Exit Group"}
      </button>
    </div>
  );
};

export default GroupInfoPanel;
