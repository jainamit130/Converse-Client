import "./NewGroup.css";

const NewGroup = ({ groupName, setGroupName }) => {
  return (
    <div className="group-name-input">
      <input
        type="text"
        className="searchUsers"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Enter group name"
      />
    </div>
  );
};

export default NewGroup;
