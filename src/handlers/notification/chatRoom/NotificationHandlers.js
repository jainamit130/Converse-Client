export const handleChatTransactionNotification = (data) => {
  console.log("Group Transaction:", data.message);
  // Update your UI based on the message data
};

export const handleMessageDeletedNotification = (data) => {
  console.log("Message Deleted:", data.message);
  // Update your UI based on the message data
};

export const handleMessageNotification = (data) => {
  console.log("Message Received:", data.message);
  // Update your UI based on the message data
};

export const handleTypingNotification = (data) => {
  console.log("User Typing:", data.typingUsernames);
  // Show typing indicator for the user
};

export const handleUserStatusNotification = (data) => {
  console.log("User Status Changed:", data.username, data.status);
  // Handle user status change (e.g., show them as online or offline)
};
