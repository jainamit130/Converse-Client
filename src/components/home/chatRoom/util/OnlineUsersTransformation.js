import { parseDate } from "../../../../util/dateUtil";

export const normalizeOnlineStatus = ({
  chatRoomName,
  onlineUsersDTO,
  setOnlineUsers,
  setLastSeen,
}) => {
  if (!onlineUsersDTO) {
    setOnlineUsers([]);
    setLastSeen(null);
    return;
  }

  const rawTimestamp = onlineUsersDTO.lastSeenTimestamp;
  const timeStamp = rawTimestamp ? parseDate(rawTimestamp) : null;

  const isValidTimestamp =
    timeStamp instanceof Date && !isNaN(timeStamp.getTime());

  if (Array.isArray(onlineUsersDTO.onlineUsers)) {
    setOnlineUsers(onlineUsersDTO.onlineUsers || []);
    setLastSeen(isValidTimestamp ? timeStamp : null);
    return;
  }

  if (isValidTimestamp) {
    setOnlineUsers([]);
    setLastSeen(timeStamp);
  } else {
    setOnlineUsers([chatRoomName]);
    setLastSeen(null);
  }
};
