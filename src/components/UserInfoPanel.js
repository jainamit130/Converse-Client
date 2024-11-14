import { useEffect, useState } from "react";
import useGetUserInfo from "../hooks/useGetUserInfo";
import { formatLastSeen } from "../util/dateUtil";

const UserInfoPanel = ({ userId, onClose }) => {
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
        setLastSeenTimestamp(formatLastSeen(data.commonChatRoomIds));
        setOnlineStatus(data.onlineStatus);
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

  // if (!userStatus) {
  //   return <div>Loading...</div>;
  // }

  return <div className={`info-panel ${isVisible ? "visible" : ""}`}></div>;
};

export default UserInfoPanel;
