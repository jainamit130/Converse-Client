import "./TypingIndicator.css";

const TypingIndicator = ({ typingUsers }) => {
  const typingUsersArray = Array.isArray(typingUsers) ? typingUsers : [];

  if (typingUsersArray.length === 0) {
    return null;
  }

  const typingUsersText = typingUsersArray.join(", ");
  const typingVerb = typingUsersArray.length > 1 ? "are" : "is";

  return (
    <div>
      {typingUsersArray.length > 0 && (
        <div className="typingStatus">
          {typingUsersText} {typingVerb} typing
        </div>
      )}
    </div>
  );
};

export default TypingIndicator;
