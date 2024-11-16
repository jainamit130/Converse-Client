import { useEffect, useState } from "react";
import useGetUserInfo from "../hooks/useGetUserInfo";
import { formatLastSeen } from "../util/dateUtil";
import closeButtonIcon from "../assets/CloseButton.png";
import userChatIcon from "../assets/userChat.png";
import profileIcon from "../assets/profileIcon.webp"; // Add profile image path
import "./InfoPanel.css";
import Tile from "./reusableComponents/Tile";
import ProfileIcon from "../assets/profileIcon.webp";
import { useChatRoom } from "../context/ChatRoomContext";

const UserInfoPanel = ({ userId, onClose }) => {
  const { chatRooms } = useChatRoom();
  const { fetchUserInfo } = useGetUserInfo();
  const [fetchedUserId, setFetchedUserId] = useState();
  const [username, setUsername] = useState();
  const [userStatus, setUserStatus] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [commonChatRoomIds, setCommonChatRoomIds] = useState([]);
  const [individualChatId, setIndividualChatId] = useState();
  const [lastSeenTimestamp, setLastSeenTimestamp] = useState(null);
  const [onlineStatus, setOnlineStatus] = useState("OFFLINE");

  useEffect(() => {
    const getUserInfo = async () => {
      if (userId) {
        const data = await fetchUserInfo(userId);
        setFetchedUserId(data.id);
        setUsername(data.username);
        setUserStatus(data.userStatus);
        setLastSeenTimestamp(formatLastSeen(data.lastSeenTimestamp));
        setOnlineStatus(data.status);
        setIndividualChatId(data.commonIndividualChatId);
        setCommonChatRoomIds(data.commonChatRoomIds);
      }
    };

    getUserInfo();
    setIsVisible(true);

    return () => {
      setIsVisible(false);
    };
  }, [userId]);

  return (
    <div className={`info-panel ${isVisible ? "visible" : ""}`}>
      {/* Header with Close Button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "2px",
        }}
      >
        <img
          src={closeButtonIcon}
          className="close-button"
          alt="close"
          onClick={onClose}
        />
        <span style={{ marginLeft: "10px" }}>Contact info</span>
      </div>

      {/* Profile Icon */}
      <div
        className="profile-icon-container"
        style={{ textAlign: "center", marginTop: "20px" }}
      >
        <img
          src={profileIcon}
          alt="Profile"
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Last Seen / Online Status */}
      <div
        style={{
          textAlign: "center",
          marginTop: "10px",
          fontSize: "16px",
          color: "#555",
        }}
      >
        {onlineStatus === "ONLINE" ? (
          <span>Online</span>
        ) : (
          <span>{lastSeenTimestamp}</span>
        )}
      </div>

      {/* Chat Button */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <img src={userChatIcon} className="chatIcon" />
      </div>

      {/* Groups in Common */}
      <div style={{ marginTop: "30px", padding: "0 20px" }}>
        <h3 style={{ fontSize: "18px", color: "#333", marginBottom: "10px" }}>
          Groups in Common
        </h3>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {commonChatRoomIds.map((chatRoomId) => (
            <Tile
              id={chatRoomId}
              name={chatRooms.get(chatRoomId).name}
              icon={profileIcon}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserInfoPanel;
