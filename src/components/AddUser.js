import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const AddUser = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const creatorId = queryParams.get("userId");

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([creatorId]);
  const [groupName, setGroupName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users on component mount
    axios
      .get("http://localhost:8080/converse/users/getUsers")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // Search handler
  const handleSearch = () => {
    axios
      .get(`http://localhost:8080/converse/users/search?q=${searchTerm}`)
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error searching users:", error));
  };

  // Handle user selection
  const handleSelectUser = (user) => {
    if (selectedUserIds.includes(user.id)) {
      // Deselect user
      setSelectedUserIds(selectedUserIds.filter((id) => id !== user.id));
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      // Select user
      setSelectedUserIds([...selectedUserIds, user.id]);
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // Handle group creation and user addition
  const handleSubmit = () => {
    // First create the group
    axios
      .post("http://localhost:8080/chat/groups/create", {
        groupName: groupName,
        members: selectedUserIds,
      })
      .then(() => {
        navigate("/chat-rooms"); // Redirect to chat rooms page
      })
      .catch((error) => console.error("Error creating group:", error));
  };

  return (
    <div>
      <h1>Add Users to New Group</h1>
      <div>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name"
        />
      </div>
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <ul>
        {users
          .filter((user) => user.id !== creatorId)
          .map((user) => (
            <li key={user.id}>
              <input
                type="checkbox"
                checked={selectedUserIds.includes(user.id)}
                onChange={() => handleSelectUser(user)}
              />
              {user.username}
            </li>
          ))}
      </ul>

      <h2>Selected Users:</h2>
      <ul>
        {selectedUsers.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
      <button onClick={handleSubmit}>
        Create Group and Add Selected Users
      </button>
    </div>
  );
};

export default AddUser;
