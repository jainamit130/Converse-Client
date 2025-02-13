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

const AddUser = ({
  onClose,
  handleCreateGroup,
  setTempChatRoom,
  addMemberChatRoom,
}) => {
  const [users, setUsers] = useState([]);
  const { usernameToChatRoomMap } = useChatRoom();
  const { getUsers, handleAddMember } = useCreateChat();
  const [focus, setFocus] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [chatRoomType, setChatRoomType] = useState("INDIVIDUAL");
  const [isNewGroup, setIsNewGroup] = useState(() => {
    if (addMemberChatRoom) {
      return true;
    }
    return false;
  });
  const { userId } = useUser();

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      if (addMemberChatRoom) {
        const filteredUsers = data.filter(
          (user) => !addMemberChatRoom.userIds.includes(user.id)
        );
        setUsers(filteredUsers);
      } else {
        setUsers(data);
      }
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

  const openChatRoom = async (user) => {
    let chatRoomId = null;
    if (chatRoomType === "INDIVIDUAL" && addMemberChatRoom == null) {
      const existingChatRoomId = usernameToChatRoomMap[user.id];
      if (existingChatRoomId) {
        onClose(existingChatRoomId);
        return;
      }

      // const result = await createChatRoom(null, [user.id], chatRoomType);
      // chatRoomId = result.id;
      // Set Temp ChatRoom
      const tempChatRoom = {
        name: user.username,
        chatRoomType,
        isExited: false,
        members: [user.id, userId],
        createdById: userId,
      };
      setTempChatRoom(tempChatRoom);
      onClose(chatRoomId, true);
    } else {
      const selectedUserIds = selectedUsers.map((user) => user.id);
      let result;
      if (addMemberChatRoom) {
        result = await handleAddMember(addMemberChatRoom.id, selectedUserIds);
      } else {
        result = await handleCreateGroup(
          groupName,
          selectedUserIds,
          chatRoomType
        );
      }
      chatRoomId = result.chatRoomId;
      onClose(chatRoomId);
    }
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
              if (isNewGroup) {
                if (addMemberChatRoom) {
                  onClose(null);
                }
                setIsNewGroup(false);
              } else onClose(null);
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

      {isNewGroup &&
        (addMemberChatRoom ? (
          addMemberChatRoom.name
        ) : (
          <div className="group-name-input">
            <input
              type="text"
              value={groupName}
              className="searchUsers"
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
            />
          </div>
        ))}

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
