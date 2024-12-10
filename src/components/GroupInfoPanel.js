import { useEffect, useState } from "react";
import GroupIcon from "../assets/GroupIcon.png";
import closeButtonIcon from "../assets/CloseButton.png";
import profileIcon from "../assets/profileIcon.webp";
import addMemberIcon from "../assets/AddMemberIcon.webp";
import exitIcon from "../assets/ExitIcon.png";
import deleteIcon from "../assets/DeleteIcon.png";
import "./InfoPanel.css";
import Tile from "./reusableComponents/Tile";
import { useChatRoom } from "../context/ChatRoomContext";
import useGetGroupInfo from "../hooks/useGetGroupInfo";
import useDelete from "../hooks/useDelete";
import { useUser } from "../context/UserContext";

const GroupInfoPanel = ({
  chatRoomId,
  openUserInfoPanel,
  onClose,
  handleAddMember,
  removeMember,
  handleDeleteGroup,
}) => {
  const { chatRooms } = useChatRoom();
  const { fetchGroupInfo } = useGetGroupInfo();
  const { userId } = useUser();
  const chatRoom = chatRooms.get(chatRoomId);
  const [members, setMembers] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const handleGroupAction = () => {
    if (chatRoom.isExited) {
      handleDeleteGroup(chatRoom.id);
    } else {
      const isSuccess = removeMember();
      if (isSuccess) {
        removeMemberFromGroupDetails(userId);
      }
    }
  };

  const handleOptionsClick = (option, id) => {
    if (option === "Remove Member") {
      const isSuccess = removeMember(id);
      if (isSuccess) {
        removeMemberFromGroupDetails(id);
      }
    }
  };

  const removeMemberFromGroupDetails = (id) => {
    setMembers((prevMembers) =>
      prevMembers.filter((member) => member.userId !== id)
    );
  };

  const toggleDropdown = (event, id) => {
    console.log(openDropdownId + " - " + id);
    if (openDropdownId === id) {
      setOpenDropdownId(null);
    } else {
      setOpenDropdownId(id);
    }
    event.stopPropagation();
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
        <div style={{ position: "relative", zIndex: "1" }}>
          <Tile
            name={"Add Member"}
            tileClick={() => handleAddMember(chatRoomId)}
            icon={addMemberIcon}
          />
          {members.map((member) => {
            return (
              <Tile
                key={member.userId}
                id={member.userId}
                options={["Remove Member"]}
                optionsClicked={handleOptionsClick}
                tileClick={() => openUserInfoPanel(member.userId)}
                name={member.username}
                isOpen={openDropdownId === member.userId}
                icon={profileIcon}
                toggleDropdown={toggleDropdown}
              />
            );
          })}
          <Tile
            name={chatRoom?.isExited ? "Delete Group" : "Exit Group"}
            tileClick={() => handleGroupAction(chatRoomId)}
            icon={chatRoom?.isExited ? deleteIcon : exitIcon}
          />
        </div>
      </div>
    </div>
  );
};

export default GroupInfoPanel;
