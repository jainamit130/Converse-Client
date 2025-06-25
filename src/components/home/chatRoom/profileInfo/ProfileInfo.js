import { useEffect, useState } from "react";
import useGetChatInfo from "../hook/useGetChatInfo";

import profileIcon from "../../../../assets/ProfileIcon.webp";
import userChatIcon from "../../../../assets/userChat.png";
import onlineIcon from "../../../../assets/onlineStatus.png";
import offlineIcon from "../../../../assets/offlineStatus.png";

import "./ProfileInfo.css";
import { formatLastSeen, parseDate } from "../../../../util/dateUtil";
import Tile from "../../../reusableComponents/Tile/Tile";
import { useChatRoomContext } from "../../../../context/ChatRoomContext";
import { iconType } from "../../../MappingTypes/iconFactory";
import { initiateNewChat } from "../../Users/util/initiateNewChat";
import ProfileInfoSkeleton from "../message/util/ProfileInfoSekelton/ProfileInfoSekeleton";

const ProfileInfo = ({ myId, userId, handleChatRoomSelect, onClose }) => {
  const [loading, setLoading] = useState(true);
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
  const [lastSeenTimestamp, setLastSeen] = useState();
  const [commonChatId, setCommonChatId] = useState(null);
  const [commonGroupChatIds, setGroupIds] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
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

      const label =
        fetchedUserId === myId ? `${rawUsername} (You)` : rawUsername;

      setUsername(label);
      setStatus(status);
      setUserStatus(userStatus);
      setLastSeen(formatLastSeen(parseDate(lastSeenTimestamp)));
      setCommonChatId(commonChatId);
      setGroupIds(commonGroupChatIds);

      setLoading(false);
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
    onClose?.();
  };

  if (loading) return <ProfileInfoSkeleton />;
  return (
    <aside className="info-panel visible">
      <section className="info-panel__section center">
        <img src={profileIcon} alt="Profile" className="avatar" />
        <h2 className="username">{username}</h2>
        {userStatus && <p className="user-status">{userStatus}</p>}
      </section>

      <hr className="divider" />

      <section className="info-panel__section center status-block">
        {status === "ACTIVE" ? (
          <>
            <img src={onlineIcon} className="status-icon" alt="online" />
            <span>Online</span>
          </>
        ) : (
          <>
            <img src={offlineIcon} className="status-icon" alt="offline" />
            <span>{lastSeenTimestamp}</span>
          </>
        )}
      </section>

      <hr className="divider" />

      <section className="info-panel__section center">
        <img
          src={userChatIcon}
          className="chat-launcher"
          alt="Start chat"
          onClick={openChatRoom}
          title="Start chat"
        />
      </section>

      <hr className="divider" />

      <section className="info-panel__section">
        <h3 className="section-title">Groups in Common</h3>
        <ul className="groups-list">
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
          {commonGroupChatIds.length === 0 && (
            <li className="no-groups">No common groups</li>
          )}
        </ul>
      </section>
    </aside>
  );
};

export default ProfileInfo;
