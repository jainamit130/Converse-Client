import "./MessageSkeleton.css";

const MessageSkeleton = ({ senderType = "left" }) => {
  return (
    <div
      className={`message messageSkeleton ${
        senderType === "right"
          ? "message-right messageSkeleton-right"
          : "message-left messageSkeleton-left"
      }`}
    >
      <div className="messageSkeleton-header">
        <div className="messageSkeleton-sender shimmer short" />
        <div className="messageSkeleton-options shimmer tiny" />
      </div>
      <div className="messageSkeleton-content shimmer medium" />
      <div className="messageSkeleton-status shimmer tiny" />
    </div>
  );
};

export default MessageSkeleton;
