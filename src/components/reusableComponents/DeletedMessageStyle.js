import deletedMessageIcon from "../../assets/messageDeleted.png";

const DeletedMessageStyle = ({ senderId, userId }) => {
  return (
    <div className="deletedMessage">
      <img
        src={deletedMessageIcon}
        style={{
          height: "10px",
          width: "10px",
          marginRight: "3px",
        }}
      />
      {senderId === userId
        ? "You deleted this message."
        : "This message was deleted."}
    </div>
  );
};

export default DeletedMessageStyle;
