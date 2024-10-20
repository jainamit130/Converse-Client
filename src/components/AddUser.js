import React, { useState, useEffect, useRef } from "react";
import "./AddUser.css";
import ProfileIcon from "../assets/profileIcon.webp";
import GroupIcon from "../assets/NewGroup.png";
import backButton from "../assets/backButton.png";
import backSearchButton from "../assets/backSearchButton.png";
import searchIcon from "../assets/searchIcon.png";
import Tile from "./reusableComponents/Tile";
import { useUser } from "../context/UserContext";
import { useChatRoom } from "../context/ChatRoomContext";
import useCreateChat from "../hooks/useCreateChat";

const AddUser = ({ onClose }) => {
  const [users, setUsers] = useState([]);
  const { usernameToChatRoomMap } = useChatRoom();
  const { getUsers } = useCreateChat();

  const [focus, setFocus] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const { handleCreateGroup } = useCreateChat();
  const [chatRoomType, setChatRoomType] = useState("INDIVIDUAL");
  const [isNewGroup, setIsNewGroup] = useState(false);
  const { username } = useUser();

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
      openChatRoom(user, "INDIVIDUAL");
    }
  };

  const handleRemoveSelectedUser = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
  };

  const createChatRoom = async (name, userIds, type) => {
    try {
      const response = await handleCreateGroup(name, userIds, type);
      return { id: response.id, name: response.name };
    } catch (err) {
      console.error("Error creating chat room:", err);
      throw err;
    }
  };

  const openChatRoom = async (user) => {
    let chatRoomId, chatRoomName;

    if (chatRoomType === "INDIVIDUAL") {
      const existingChatRoomId = usernameToChatRoomMap[user.id];
      if (existingChatRoomId) {
        onClose(existingChatRoomId, user.username);
        return;
      }

      const result = await createChatRoom(null, [user.id], chatRoomType);
      chatRoomId = result.id;
      chatRoomName =
        result.recipientUsername === username
          ? result.creatorUsername
          : result.recipientUsername;
    } else {
      const selectedUserIds = selectedUsers.map((user) => user.id);
      const result = await createChatRoom(
        groupName,
        selectedUserIds,
        chatRoomType
      );
      chatRoomId = result.id;
      chatRoomName = result.name;
    }

    onClose(chatRoomId, chatRoomName);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const removeFocus = () => {
    setFocus(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleFocus = () => {
    setFocus(true);
  };

  return (
    <div className="add-user-panel">
      <div>
        <div>
          <img
            src={backButton}
            className="back-btn"
            onClick={() => {
              if (isNewGroup) setIsNewGroup(false);
              else onClose(null, null);
              setChatRoomType("INDIVIDUAL");
            }}
          />
          <span style={{ marginLeft: "20px" }}>New Chat</span>
        </div>

        <div className="search-container">
          <input
            ref={inputRef}
            className="searchUsers"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleFocus}
            onBlur={() => setFocus(false)}
            placeholder="Search users"
          />

          <div className="search-icon" onClick={removeFocus}>
            {focus ? (
              <img
                className={`back-search-image rotate-in`}
                src={backSearchButton}
              />
            ) : (
              <img className={`search-image rotate-out`} src={searchIcon} />
            )}
          </div>
        </div>
      </div>

      {!isNewGroup && (
        <div
          className="new-group-tile"
          onClick={() => {
            setIsNewGroup(true);
            setChatRoomType("GROUP");
          }}
        >
          <Tile name={"New Group"} icon={GroupIcon} />
        </div>
      )}

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

      <div style={{ fontSize: "17px", color: "green", margin: "20px" }}>
        CONTACTS ON CONVERSE
      </div>

      <div>
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
              <button onClick={() => handleRemoveSelectedUser(user)}>X</button>
              <span>{user.username}</span>
            </div>
          ))}
        </div>
      )}

      {isNewGroup && selectedUsers.length > 0 && (
        <button onClick={() => openChatRoom(null)}>
          Create Group and Add Selected Users
        </button>
      )}
    </div>
  );
};

export default AddUser;
