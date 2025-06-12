import { useEffect, useState } from "react";
import GroupIcon from "../../../../assets/GroupIcon.png";
import addMemberIcon from "../../../../assets/AddMemberIcon.webp";
import exitIcon from "../../../../assets/ExitIcon.png";
import deleteIcon from "../../../../assets/DeleteIcon.png";
import "./GroupInfoPanel.css";
import Tile from "../../../reusableComponents/Tile/Tile";
import useGetGroupInfo from "../hook/useGetGroupInfo";
import { iconType } from "../../../MappingTypes/iconFactory";

const GroupInfoPanel = ({ chatRoom }) => {
  const { fetchGroupInfo } = useGetGroupInfo();
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const handleAddMember = (roomId) => {
    console.log("Add member clicked for room:", roomId);
  };

  const removeMember = (memberId) => {
    console.log("Remove member clicked:", memberId);
    return true;
  };

  const handleGroupAction = () => {
    console.log(chatRoom.isExited ? "Delete group" : "Exit group");
  };

  const openUserInfoPanel = (userId) => {
    console.log("Open user info panel for user:", userId);
  };

  const toggleDropdown = (event, id) => {
    setOpenDropdownId((prevId) => (prevId === id ? null : id));
    event.stopPropagation();
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
    <div>
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

          {isLoading && chatRoom.userIds
            ? chatRoom.userIds.map((_, index) => (
                <Tile
                  key={`loading-${index}`}
                  name="Loading..."
                  icon={iconType("DIRECT")}
                  isLoading={true} // You can conditionally style this in your Tile component
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
                  tileClick={() => openUserInfoPanel(member.userId)}
                  options={["Remove Member"]}
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
