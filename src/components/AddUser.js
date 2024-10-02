import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddUser.css";

const AddUser = ({ onClose }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [groupName, setGroupName] = useState("");
  const token = localStorage.getItem("authenticationToken");

  useEffect(() => {
    axios
      .get("http://localhost:8080/converse/users/getUsers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleSelectUser = (user) => {
    if (selectedUserIds.includes(user.id)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== user.id));
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUserIds([...selectedUserIds, user.id]);
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleSubmit = () => {
    axios
      .post(
        "http://localhost:8080/chat/groups/create",
        {
          groupName: groupName,
          members: selectedUserIds,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        onClose();
      })
      .catch((error) => console.error("Error creating group:", error));
  };

  return (
    <div className="add-user-panel">
      {" "}
      {/* Styled for slide-in */}
      <button className="close-btn" onClick={onClose}>
        X
      </button>{" "}
      {/* Close button */}
      <h1>Add Users to New Group</h1>
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Enter group name"
      />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users"
      />
      <ul>
        {users.map((user) => (
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
      <button onClick={handleSubmit}>
        Create Group and Add Selected Users
      </button>
    </div>
  );
};

export default AddUser;
