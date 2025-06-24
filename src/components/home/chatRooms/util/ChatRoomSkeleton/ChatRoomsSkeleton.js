import "./ChatRoomsSkeleton.css";

const ChatRoomsSkeleton = () => {
  return (
    <div className="chatRoomTileSkeleton shimmer">
      <div className="chatRoomTile-avatar shimmer" />
      <div className="chatRoomTile-text">
        <div className="chatRoomTile-line short shimmer" />
        <div className="chatRoomTile-line long shimmer" />
      </div>
    </div>
  );
};

export default ChatRoomsSkeleton;
