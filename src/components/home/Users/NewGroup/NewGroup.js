import { useEffect, useState } from "react";
import "./NewGroup.css";
import useGetUsers from "../hook/useGetUsers";
import BackButton from "../SearchComponent/BackButton/BackButton";
import Search from "../SearchComponent/Search";
import { iconType } from "../../../MappingTypes/iconFactory";
import Tile from "../../../reusableComponents/Tile/Tile";
import useCreateChat from "../hook/useCreateChat";
import { useChatRoomContext } from "../../../../context/ChatRoomContext";
import UserTileList from "../util/UserTileList";
import useSearchableUsers from "../util/useSearchableUsers";

const NewGroup = ({ goBack, goBackTwice, handleNewGroup }) => {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { createGroupChat } = useCreateChat();
  const userId = localStorage.getItem("userId");

  const { searchTerm, setSearchTerm, filteredUsers } = useSearchableUsers(
    selectedUsers.map((u) => u.userId)
  );

  const handleSelectUser = (user) => {
    setSelectedUsers((prev) => [...prev, user]);
  };

  const handleRemoveUser = (user) => {
    setSelectedUsers((prev) => prev.filter((u) => u.userId !== user.userId));
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedUsers.length === 0) {
      alert("Group name and at least one member are required.");
      return;
    }

    const userIds = selectedUsers.map((u) => u.userId);
    try {
      const result = await createGroupChat(groupName, userIds);
      if (result.error) {
        alert("Failed to create group.");
      } else if (result) {
        handleNewGroup({ id: result, name: groupName, type: "GROUP" });
        goBackTwice();
      }
    } catch (err) {
      console.error("Group creation failed:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div>
      <BackButton title="New Group" toggle={goBack} />
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="group-name-input">
        <input
          type="text"
          className="searchUsers"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name"
        />
      </div>

      <div style={{ fontSize: "17px", color: "green", margin: "20px" }}>
        CONTACTS ON CONVERSE
      </div>

      <UserTileList
        users={filteredUsers}
        userId={userId}
        onGroupTagClick={handleSelectUser}
      />

      {selectedUsers.length > 0 && (
        <div className="selected-users-floating">
          {selectedUsers.map((user) => (
            <div key={user.userId} className="selected-user-tile">
              <span>{user.username}</span>
              <button onClick={() => handleRemoveUser(user)}>✕</button>
            </div>
          ))}
        </div>
      )}

      <div style={{ margin: "20px", textAlign: "center" }}>
        <button className="create-group-btn" onClick={handleCreateGroup}>
          Create Group
        </button>
      </div>
    </div>
  );
};

export default NewGroup;
