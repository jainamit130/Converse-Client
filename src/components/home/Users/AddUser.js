import { useEffect, useState } from "react";
import "./AddUser.css";
import Tile from "../../reusableComponents/Tile/Tile";
import useGetUsers from "./hook/useGetUsers";
import { iconType } from "../../MappingTypes/iconFactory";
import Search from "./SearchComponent/Search";

const AddUser = () => {
  const [users, setUsers] = useState([]);
  const { getUsers } = useGetUsers();

  const handleGetUsers = async () => {
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    handleGetUsers();
  }, []);

  return (
    <div className="add-user-panel">
      <Search></Search>
      <div style={{ fontSize: "17px", color: "green", margin: "20px" }}>
        CONTACTS ON CONVERSE
      </div>
      {users.map((user) => (
        <Tile
          key={user.id}
          id={user.id}
          name={user.username}
          icon={iconType("DIRECT")}
        />
      ))}
    </div>
  );
};

export default AddUser;
