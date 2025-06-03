import "./MessageSkeleton.css";

const MessageSkeleton = () => {
  return (
    <div className="messageSkeleton">
      <div className="avatar shimmer" />
      <div className="content">
        <div className="line shimmer short" />
        <div className="line shimmer long" />
      </div>
    </div>
  );
};

export default MessageSkeleton;
