import { useEffect, useState } from "react";
import useGetUserInfo from "../hooks/useGetUserInfo";
import { formatLastSeen } from "../util/dateUtil";
import closeButtonIcon from "../assets/CloseButton.png";
import userChatIcon from "../assets/userChat.png";
import profileIcon from "../assets/profileIcon.webp";
import backButtonIcon from "../assets/backButton.png";
import "./InfoPanel.css";
import Tile from "./reusableComponents/Tile";
import onlineIcon from "../assets/onlineStatus.png";
import offlineIcon from "../assets/offline.png";
import { useChatRoom } from "../context/ChatRoomContext";
import { useUser } from "../context/UserContext";

const UserInfoPanel = ({
  currentUserId,
  handleTempChatRoom,
  isGroupInfoPanelOpen,
  setTempChatRoom,
  onClose,
}) => {
  const { setActiveChatRoomId, userId } = useUser();
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

  const handleChatRoomClick = (chatRoomId) => {
    setActiveChatRoomId(chatRoomId);
  };

  const openChatRoom = () => {
    if (individualChatId === null) {
      const tempChatRoom = {
        name: username,
        chatRoomType: "INDIVIDUAL",
        isExited: false,
        members: [currentUserId, userId],
        createdById: userId,
      };
      setTempChatRoom(tempChatRoom);
      handleTempChatRoom(null, true);
    } else {
      setActiveChatRoomId(individualChatId);
    }
    onClose();
  };

  useEffect(() => {
    const getUserInfo = async () => {
      if (currentUserId) {
        const data = await fetchUserInfo(currentUserId);
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
  }, [currentUserId]);

  return (
    <div
      className={`info-panel ${isVisible ? "visible" : ""}`}
      style={{ zIndex: "2000" }}
    >
      {/* Header with Close Button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "2px",
        }}
      >
        {isGroupInfoPanelOpen ? (
          <img
            src={backButtonIcon}
            className="back-button"
            alt="close"
            onClick={onClose}
          />
        ) : (
          <img
            src={closeButtonIcon}
            className="close-button"
            alt="close"
            onClick={onClose}
          />
        )}

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

        <h2>{username}</h2>
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
          <div className="statusDetails">
            <img src={onlineIcon} className="statusIcon" />
            <span>online</span>
          </div>
        ) : (
          <div className="statusDetails">
            <img src={offlineIcon} className="statusIcon" />
            <span>{lastSeenTimestamp}</span>
          </div>
        )}
      </div>

      {/* Chat Button */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <img src={userChatIcon} className="chatIcon" onClick={openChatRoom} />
      </div>

      {/* Groups in Common */}
      <div style={{ marginTop: "30px", padding: "0 20px" }}>
        <h3 style={{ fontSize: "18px", color: "#333", marginBottom: "10px" }}>
          Groups in Common
        </h3>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {commonChatRoomIds.map((chatRoomId) => {
            const chatRoom = chatRooms.get(chatRoomId);
            if (!chatRoom || chatRoom.chatRoomType !== "GROUP") {
              return null;
            }
            return (
              <Tile
                key={chatRoomId}
                id={chatRoomId}
                tileClick={handleChatRoomClick}
                name={chatRoom.name}
                icon={profileIcon}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default UserInfoPanel;
