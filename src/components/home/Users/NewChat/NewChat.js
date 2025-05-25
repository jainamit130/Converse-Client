import { useEffect, useState } from "react";
import Tile from "../../../reusableComponents/Tile/Tile";
import "./NewChat.css";
import useGetUsers from "../hook/useGetUsers";
import { iconType } from "../../../MappingTypes/iconFactory";
import { useChatRoomContext } from "../../../../context/ChatRoomContext";
import BackButton from "../SearchComponent/BackButton/BackButton";
import Search from "../SearchComponent/Search";
import useCreateChat from "../hook/useCreateChat";

const NewChat = ({ goBack, openNewGroup, handleNewChat }) => {
  const { directSelfChats } = useChatRoomContext();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { createChat } = useCreateChat();
  const { getUsers } = useGetUsers();
  const userId = localStorage.getItem("userId");

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedUsers.find((u) => u.userId === user.userId)
  );

  useEffect(() => {
    const handleGetUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    handleGetUsers();
  }, []);

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

      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
          <Tile
            key={user.userId}
            id={user.userId}
            isOpen={false}
            type={user.userId === userId ? "SELF" : "DIRECT"}
            name={user.username}
            icon={iconType("DIRECT")}
            tileClick={newChatHandler}
          />
        ))
      ) : (
        <p style={{ padding: "0 20px", color: "gray" }}>
          No matching users found
        </p>
      )}
    </div>
  );
};

export default NewChat;
