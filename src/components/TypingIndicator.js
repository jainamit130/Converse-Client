import React from "react";

const TypingIndicator = ({ typingUsers }) => {
  const typingUsersArray = Array.isArray(typingUsers)
    ? typingUsers
    : [typingUsers];

  const typingUsersText = typingUsersArray.join(", ");

  const typingVerb = typingUsersArray.length > 1 ? "are" : "is";

  return (
    <div>
      {typingUsersArray.length > 0 && (
        <div>
          {typingUsersText} {typingVerb} typing
        </div>
      )}
    </div>
  );
};

export default TypingIndicator;
