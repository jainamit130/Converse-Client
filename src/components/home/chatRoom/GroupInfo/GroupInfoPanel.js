import { useEffect, useState } from "react";
import "./GroupInfoPanel.css";
import GroupIcon from "../../../../assets/GroupIcon.png";
import addMemberIcon from "../../../../assets/AddMemberIcon.webp";
import exitIcon from "../../../../assets/ExitIcon.png";
import deleteIcon from "../../../../assets/DeleteIcon.png";
import "./GroupInfoPanel.css";
import Tile from "../../../reusableComponents/Tile/Tile";
import useGetChatInfo from "../hook/useGetChatInfo";
import { iconType } from "../../../MappingTypes/iconFactory";

const GroupInfoPanel = ({
  chatRoom,
  handleDeletChat,
  handleExitChat,
  handleRemoveUsers,
  handleAddUsers,
  openProfileInfo,
}) => {
  const { fetchGroupInfo } = useGetChatInfo();
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [memberOptions, setMemberOptions] = useState(["Remove Member"]);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const chatRoomId = chatRoom?.id;

  useEffect(() => {
    const getGroupInfo = async () => {
      if (!chatRoomId) return;
      setIsLoading(true);
      const data = await fetchGroupInfo(chatRoomId);
      if (data?.members) {
        setMembers(data.members);
      }
      setIsLoading(false);
    };
    getGroupInfo();
  }, [chatRoomId]);

  const handleAddMember = () => {
    handleAddUsers();
  };

  const removeMember = async (memberId) => {
    try {
      const response = await handleRemoveUsers([memberId]);
      if (response && !response.error) {
        setMembers((prev) => prev.filter((m) => m.userId !== memberId));
      } else {
        console.error("Failed to remove member:", response?.error);
      }
    } catch (err) {
      console.error("Error removing member:", err);
    }
  };

  const handleGroupAction = () => {
    if (chatRoom.isExited) {
      handleDeletChat();
    } else {
      handleExitChat();
    }
  };

  const openUserInfoPanel = (userId) => {
    console.log("Open user info panel for user:", userId);
  };

  const toggleDropdown = (event, id) => {
    setOpenDropdownId((prevId) => (prevId === id ? null : id));
  };

  const handleOptionsClick = (option, id) => {
    console.log(`Option "${option}" clicked for member ID:`, id);
    if (option === "Remove Member") {
      const success = removeMember(id);
      if (success) {
        setMembers((prev) => prev.filter((m) => m.userId !== id));
      }
    }
  };

  useEffect(() => {
    const getGroupInfo = async () => {
      if (!chatRoomId) return;
      const data = await fetchGroupInfo(chatRoomId);
      if (data?.members) {
        setMembers(data.members);
      }
    };
    getGroupInfo();
  }, [chatRoomId]);

  if (!chatRoom) return null;

  return (
    <div style={{ flexGrow: "1" }}>
      <div
        className="profile-icon-container"
        style={{ textAlign: "center", marginTop: "20px" }}
      >
        <img
          src={GroupIcon}
          alt="Group Icon"
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <h2>{chatRoom.name}</h2>
      </div>

      <div style={{ padding: "0 20px" }}>
        <h3 style={{ fontSize: "18px", color: "#333", marginBottom: "10px" }}>
          Group Members
        </h3>
        <div style={{ zIndex: "1" }}>
          <Tile
            name={"Add Member"}
            tileClick={() => handleAddMember(chatRoomId)}
            icon={addMemberIcon}
          />

          {isLoading && chatRoom.userIds
            ? chatRoom.userIds.map((_, index) => (
                <Tile
                  key={`loading-${index}`}
                  name="Loading..."
                  icon={iconType("DIRECT")}
                  isLoading={true}
                />
              ))
            : members.map((member) => (
                <Tile
                  key={member.userId}
                  id={member.userId}
                  name={member.username}
                  icon={iconType("DIRECT")}
                  isOpen={openDropdownId === member.userId}
                  toggleDropdown={toggleDropdown}
                  tileClick={() => openProfileInfo(member.userId)}
                  options={memberOptions}
                  optionsClicked={handleOptionsClick}
                />
              ))}

          <Tile
            name={chatRoom?.isExited ? "Delete Group" : "Exit Group"}
            tileClick={handleGroupAction}
            icon={chatRoom?.isExited ? deleteIcon : exitIcon}
          />
        </div>
      </div>
    </div>
  );
};

export default GroupInfoPanel;
