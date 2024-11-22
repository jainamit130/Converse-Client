import { useEffect, useState } from "react";
import GroupIcon from "../assets/GroupIcon.png";
import closeButtonIcon from "../assets/CloseButton.png";
import profileIcon from "../assets/profileIcon.webp";
import addMemberIcon from "../assets/AddMemberIcon.webp";
import exitIcon from "../assets/ExitIcon.png";
import "./InfoPanel.css";
import Tile from "./reusableComponents/Tile";
import { useChatRoom } from "../context/ChatRoomContext";
import useGetGroupInfo from "../hooks/useGetGroupInfo";

const GroupInfoPanel = ({ chatRoomId, openUserInfoPanel, onClose }) => {
  const { chatRooms } = useChatRoom();
  const { fetchGroupInfo } = useGetGroupInfo();
  const chatRoom = chatRooms.get(chatRoomId);
  const [members, setMembers] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  const handleUserClick = (userId) => {
    openUserInfoPanel(userId);
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

  useEffect(() => {
    const getGroupInfo = async () => {
      if (chatRoomId) {
        const data = await fetchGroupInfo(chatRoomId);

        const memberDetails = data.members.map((member) => ({
          userId: member.userId,
          username: member.username,
        }));

        setMembers(memberDetails);
      }
    };

    getGroupInfo();
    setIsVisible(true);

    return () => {
      setIsVisible(false);
    };
  }, [chatRoomId]);

  return (
    <div
      className={`info-panel ${isVisible ? "visible" : ""}`}
      style={{ zIndex: "1000" }}
    >
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
        <Tile
          name={"Add Member"}
          onChatRoomClick={() => handleAddMember()}
          icon={addMemberIcon}
        />
        <div style={{ position: "relative" }}>
          {members.map((member) => {
            return (
              <Tile
                key={member.userId}
                id={member.userId}
                options={["Option 1", "Option 2"]}
                onChatRoomClick={() => handleUserClick(member.userId)}
                name={member.username}
                icon={profileIcon}
              />
            );
          })}
        </div>
        <Tile
          name={chatRoom?.isExited ? "Delete Group" : "Exit Group"}
          onChatRoomClick={() => handleRemoveMember()}
          icon={exitIcon}
        />
      </div>
    </div>
  );
};

export default GroupInfoPanel;
