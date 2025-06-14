import { useEffect, useState } from "react";
import useGetChatInfo from "../hook/useGetChatInfo";
import userChatIcon from "../../../../assets/userChat.png";
import profileIcon from "../../../../assets/ProfileIcon.webp";
import onlineIcon from "../../../../assets/onlineStatus.png";
import offlineIcon from "../../../../assets/offlineStatus.png";
import "./ProfileInfo.css";
import { formatLastSeen, parseDate } from "../../../../util/dateUtil";
import Tile from "../../../reusableComponents/Tile/Tile";
import { useChatRoomContext } from "../../../../context/ChatRoomContext";
import { iconType } from "../../../MappingTypes/iconFactory";
import { initiateNewChat } from "../../Users/util/initiateNewChat";

const ProfileInfo = ({ myId, userId, handleChatRoomSelect, onClose }) => {
  const { fetchProfileInfo } = useGetChatInfo();
  const {
    chatRooms,
    setActiveChatRoomId,
    setActiveChatRoomType,
    directSelfChats,
  } = useChatRoomContext();

  const [username, setUsername] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [status, setStatus] = useState("INACTIVE");
  const [lastSeenTimestamp, setLastSeenTimestamp] = useState();
  const [commonChatId, setCommonChatId] = useState(null);
  const [commonGroupChatIds, setCommonGroupChatIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      const data = await fetchProfileInfo(userId);
      if (!data) return;

      const {
        username: rawUsername = "",
        status = "INACTIVE",
        userStatus = "",
        lastSeenTimestamp,
        commonChatId,
        commonGroupChatIds = [],
        userId: fetchedUserId,
      } = data;

      const username =
        fetchedUserId === myId ? `${rawUsername} (You)` : rawUsername;

      setUsername(username);
      setStatus(status);
      setUserStatus(userStatus);
      setLastSeenTimestamp(formatLastSeen(parseDate(lastSeenTimestamp)));
      setCommonChatId(commonChatId);
      setCommonGroupChatIds(commonGroupChatIds);
    };

    fetchData();
  }, [userId, myId]);

  const openChatRoom = () => {
    initiateNewChat({
      id: userId,
      name: username,
      type: myId === userId ? "SELF" : "DIRECT",
      directSelfChats,
      handleNewChat: handleChatRoomSelect,
      goBack: onClose,
    });
  };

  const handleGroupClick = ({ id, name, type = "GROUP" }) => {
    handleChatRoomSelect({ id, name, type });
    if (onClose) onClose();
  };

  return (
    <div className="info-panel visible">
      {/* Profile */}
      <div className="info-panel__profile">
        <img src={profileIcon} alt="Profile" className="info-panel__avatar" />
        <h2 className="info-panel__username">{username}</h2>
        {userStatus && <p className="info-panel__user-status">{userStatus}</p>}
      </div>

      {/* Status */}
      <div className="info-panel__status">
        {status === "ACTIVE" ? (
          <div className="statusDetails">
            <img src={onlineIcon} className="statusIcon" alt="online" />
            <span>online</span>
          </div>
        ) : (
          <div className="statusDetails">
            <img src={offlineIcon} className="statusIcon" alt="offline" />
            <span>{lastSeenTimestamp}</span>
          </div>
        )}
      </div>

      {/* Chat Icon */}
      <div className="info-panel__chat-launcher">
        <img
          src={userChatIcon}
          className="chatIcon"
          alt="chat"
          onClick={openChatRoom}
        />
      </div>

      {/* Groups in Common */}
      <div className="groups-section">
        <h3 className="groups-section__title">Groups in Common</h3>
        <ul className="groups-section__list">
          {commonGroupChatIds.map((id) => {
            const group = chatRooms.get(id);
            if (!group || group.chatRoomType !== "GROUP") return null;
            return (
              <Tile
                key={id}
                id={id}
                tileClick={handleGroupClick}
                name={group.chatRoomName}
                icon={iconType("DIRECT")}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ProfileInfo;
