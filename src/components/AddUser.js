import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddUser.css";
import ProfileIcon from "../assets/profileIcon.webp";
import GroupIcon from "../assets/GroupIcon.png";
import Tile from "./reusableComponents/Tile";
import { useUser } from "../context/UserContext";
import { useChatRoom } from "../context/ChatRoomContext";
import useCreateChat from "../hooks/useCreateChat";

const AddUser = ({ onClose }) => {
  const [users, setUsers] = useState([]);
  const { usernameToChatRoomMap } = useChatRoom();
  const { getUsers } = useCreateChat();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [chatRoomType, setChatRoomType] = useState("GROUP");
  const [isNewGroup, setIsNewGroup] = useState(false);
  const { userId, token } = useUser();

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const handleSelectUser = (user) => {
    if (isNewGroup) {
      if (!selectedUsers.find((u) => u.id === user.id)) {
        setSelectedUsers([...selectedUsers, user]);
      }
    } else {
      createGroup(user, "INDIVIDUAL");
    }
  };

  const handleRemoveSelectedUser = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
  };

  const createGroup = async (user) => {
    if (chatRoomType === "INDIVIDUAL") {
      const existingChatRoomId = usernameToChatRoomMap[user.id];
      if (existingChatRoomId) {
        onClose(existingChatRoomId, user.username);
      } else {
        const tempChatRoom = {
          name: user.username,
          chatRoomType: "INDIVIDUAL",
          createdById: userId,
          members: [user.id, userId],
        };
        onClose(null, null, tempChatRoom);
      }
    } else {
      const selectedUserIds = selectedUsers.map((user) => user.id);
      try {
        const response = await createGroup(
          groupName,
          selectedUserIds,
          chatRoomType
        );
        const chatRoomId = response.id;
        const chatRoomName = response.name;
        onClose(chatRoomId, chatRoomName);
      } catch (err) {
        console.error("Error creating group:", err);
      }
    }
  };

  return (
    <div className="add-user-panel">
      <button className="close-btn" onClick={onClose}>
        X
      </button>
      <h1>Add Users to New Group</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users"
      />

      <div className="new-group-tile" onClick={() => setIsNewGroup(true)}>
        <Tile name={"New Group"} icon={GroupIcon} />
      </div>

      {isNewGroup && (
        <div className="group-name-input">
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
          />
        </div>
      )}

      <h2>Contacts on Converse</h2>

      <div className="user-tiles">
        {users
          .filter((user) => {
            return (
              user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
              !selectedUsers.find((u) => u.id === user.id)
            );
          })
          .map((user) => (
            <div
              key={user.id}
              className={`${
                selectedUsers.find((u) => u.id === user.id) ? "selected" : ""
              }`}
              onClick={() => handleSelectUser(user)}
            >
              <Tile id={user.id} name={user.username} icon={ProfileIcon} />
            </div>
          ))}
      </div>

      {/* Display selected users */}
      {selectedUsers.length > 0 && (
        <div className="selected-users">
          {selectedUsers.map((user) => (
            <div key={user.id} className="selected-user-tile">
              <span>{user.username}</span>
              <button onClick={() => handleRemoveSelectedUser(user)}>X</button>
            </div>
          ))}
        </div>
      )}

      {isNewGroup && selectedUsers.length > 0 && (
        <button onClick={createGroup(null, "GROUP")}>
          Create Group and Add Selected Users
        </button>
      )}
    </div>
  );
};

export default AddUser;
