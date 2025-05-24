import { useChatRoomContext } from "../../../../../context/ChatRoomContext";
import { formatLastSeen } from "../../../../../util/dateUtil";
import TypingIndicator from "../../../../sideComponents/TypingIndicator";
import "./MemberStatus.css";

const MemberStatus = ({ chatRoomType }) => {
  const { typing, onlineUsers, lastSeen } = useChatRoomContext();

  const renderStatus = () => {
    if (chatRoomType === "SELF" || chatRoomType === "DIRECT") {
      if (lastSeen) {
        return (
          <span className="member-status__last-seen">
            {formatLastSeen(lastSeen)}
          </span>
        );
      } else if (onlineUsers.length === 1) {
        return <span className="member-status__online">online</span>;
      }
    } else if (chatRoomType === "GROUP") {
      if (onlineUsers.length > 0) {
        return (
          <span className="member-status__group-online">
            {onlineUsers.length} member{onlineUsers.length > 1 ? "s" : ""}{" "}
            online
          </span>
        );
      }
    }

    return null;
  };

  return (
    <div className="member-status">
      {typing.length > 0 ? (
        <TypingIndicator typingUsers={typing} />
      ) : (
        renderStatus()
      )}
    </div>
  );
};

export default MemberStatus;
