import { useEffect, useState } from "react";
import "./AddUser.css";
import Tile from "../../reusableComponents/Tile/Tile";
import useGetUsers from "./hook/useGetUsers";
import { iconType } from "../../MappingTypes/iconFactory";
import Search from "./SearchComponent/Search";
import BackButton from "./SearchComponent/BackButton/BackButton";
import NewGroup from "./NewGroup/NewGroup";

const AddUser = ({ toggle }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newGroupMode, setNewGroupMode] = useState(false);
  const [groupName, setGroupName] = useState("");

  const { getUsers } = useGetUsers();

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

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBack = () => {
    if (newGroupMode) {
      setNewGroupMode(false);
      setGroupName("");
    } else {
      toggle();
    }
  };

  return (
    <div className="add-user-panel">
      <BackButton
        toggle={handleBack}
        title={newGroupMode ? "New Group" : "New Chat"}
      />
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="newGroup">
        {newGroupMode ? (
          <NewGroup groupName={groupName} setGroupName={setGroupName} />
        ) : (
          <Tile
            tileClick={() => setNewGroupMode(true)}
            icon={iconType("GROUP")}
            name={"New Group"}
          ></Tile>
        )}
      </div>

      <div style={{ fontSize: "17px", color: "green", margin: "20px" }}>
        CONTACTS ON CONVERSE
      </div>

      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
          <Tile
            key={user.id}
            id={user.id}
            name={user.username}
            icon={iconType("DIRECT")}
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

export default AddUser;
