import { useState } from "react";
import Tile from "../../../reusableComponents/Tile/Tile";
import "./AddUser.css";
import { iconType } from "../../../MappingTypes/iconFactory";
import { useChatRoomContext } from "../../../../context/ChatRoomContext";
import BackButton from "../SearchComponent/BackButton/BackButton";
import Search from "../SearchComponent/Search";
import useSearchableUsers from "../util/useSearchableUsers";
import UserTileList from "../util/UserTileList";
import { FormControlLabel, Switch } from "@mui/material";

const AddUser = ({ goBack, openNewGroup, handleAddUser, chatRoom }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [shareChatHistory, setShareChatHistory] = useState(false);
  const userId = localStorage.getItem("userId");

  const excludedIds = selectedUsers
    .map((u) => u.id)
    .concat(chatRoom?.userIds || []);

  const { searchTerm, setSearchTerm, filteredUsers } =
    useSearchableUsers(excludedIds);

  const toggleUserSelection = (user) => {
    setSelectedUsers((prev) => {
      if (prev.find((u) => u.id === user.id)) {
        return prev.filter((u) => u.id !== user.id);
      }
      return [...prev, user];
    });
  };

  const handleAddSelected = () => {
    if (selectedUsers.length > 0) {
      const userIds = selectedUsers.map((u) => u.id);
      handleAddUser(userIds, shareChatHistory);
    }
  };

  return (
    <div className="add-user-panel">
      <BackButton title="Add Members" toggle={goBack} />
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="newGroup" onClick={openNewGroup}>
        <Tile icon={iconType("GROUP")} name={"New Group"} />
      </div>

      <div style={{ fontSize: "17px", color: "green", margin: "20px" }}>
        CONTACTS ON CONVERSE
      </div>

      <UserTileList
        users={filteredUsers}
        userId={userId}
        onTileClick={toggleUserSelection}
        selectedUserIds={selectedUsers.map((u) => u.id)}
      />

      {selectedUsers.length > 0 && (
        <div className="selected-users-floating">
          {selectedUsers.map((user) => (
            <div key={user.id} className="selected-user-tile">
              <span>{user.name}</span>
              <button
                onClick={() =>
                  setSelectedUsers((prev) =>
                    prev.filter((u) => u.id !== user.id)
                  )
                }
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="add-user-footer">
        <FormControlLabel
          control={
            <Switch
              checked={shareChatHistory}
              onChange={() => setShareChatHistory((prev) => !prev)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "rgb(80, 165, 154)",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "rgb(80, 165, 154)",
                },
              }}
            />
          }
          label="Share Chat History"
        />
        <button
          onClick={handleAddSelected}
          className="add-members-btn"
          disabled={selectedUsers.length === 0}
        >
          Add Selected ({selectedUsers.length})
        </button>
      </div>
    </div>
  );
};

export default AddUser;
