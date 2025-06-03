import { useState } from "react";
import Tile from "../../../reusableComponents/Tile/Tile";
import "./NewChat.css";
import { iconType } from "../../../MappingTypes/iconFactory";
import { useChatRoomContext } from "../../../../context/ChatRoomContext";
import BackButton from "../SearchComponent/BackButton/BackButton";
import Search from "../SearchComponent/Search";
import useSearchableUsers from "../util/useSearchableUsers";
import UserTileList from "../util/UserTileList";

const NewChat = ({ goBack, openNewGroup, handleNewChat }) => {
  const { directSelfChats } = useChatRoomContext();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const userId = localStorage.getItem("userId");

  const { searchTerm, setSearchTerm, filteredUsers } = useSearchableUsers(
    selectedUsers.map((u) => u.userId)
  );

  const newChatHandler = ({ id, name, type }) => {
    if (!id || !name) return;

    if (directSelfChats.has(name)) {
      handleNewChat({ id: directSelfChats.get(name), name, type });
    } else {
      localStorage.setItem("newDirectChatUserId", id);
      handleNewChat({ id: "temp", name, type });
    }
    goBack();
  };

  return (
    <div className="add-user-panel">
      <BackButton title="New Chat" toggle={goBack} />
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
        onTileClick={newChatHandler}
      />
    </div>
  );
};

export default NewChat;
