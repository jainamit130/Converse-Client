export const handleChatTransactionNotification = (data) => {
  console.log("Group Transaction:", data.message);
  // Update your UI based on the message data
};

export const handleMessageDeletedNotification = (data) => {
  console.log("Message Deleted:", data.message);
  // Update your UI based on the message data
};

export const handleMessageNotification = (
  data,
  chatRooms,
  setChatRooms,
  setMessages
) => {
  const chatRoom = chatRooms.get(data.message.chatRoomId);

  if (chatRoom) {
    const updatedChatRoom = {
      ...chatRoom,
      latestMessage: data.message,
    };

    const activeChatRoomId = localStorage.getItem("activeChatRoomId");
    if (activeChatRoomId && activeChatRoomId === chatRoom.id) {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    }

    const updatedChatRooms = new Map(chatRooms);
    updatedChatRooms.set(chatRoom.id, updatedChatRoom);
    setChatRooms(updatedChatRooms);
  }
};

export const handleTypingNotification = (data) => {
  console.log("User Typing:", data.typingUsernames);
  // Show typing indicator for the user
};

export const handleUserStatusNotification = (data) => {
  console.log("User Status Changed:", data.username, data.status);
  // Handle user status change (e.g., show them as online or offline)
};
