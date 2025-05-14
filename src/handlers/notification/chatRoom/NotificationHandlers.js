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
  if (!chatRoom) return;

  let updatedChatRoom = {
    ...chatRoom,
    latestMessage: data.message,
  };

  const activeChatRoomId = localStorage.getItem("activeChatRoomId");

  if (activeChatRoomId) {
    if (activeChatRoomId === chatRoom.id) {
      updatedChatRoom.unreadMessageCount = 0;

      setMessages((prevMap) => {
        const prevMessages = prevMap.get(activeChatRoomId) || [];
        const updatedMessages = [...prevMessages, data.message];

        const updatedMap = new Map(prevMap);
        updatedMap.set(activeChatRoomId, updatedMessages);
        return updatedMap;
      });
    } else {
      updatedChatRoom = {
        ...updatedChatRoom,
        unreadMessageCount: (chatRoom.unreadMessageCount || 0) + 1,
      };
    }
  }

  const updatedChatRooms = new Map(chatRooms);
  updatedChatRooms.set(chatRoom.id, updatedChatRoom);
  setChatRooms(updatedChatRooms);
};

export const handleTypingNotification = (data) => {
  console.log("User Typing:", data);
  // Show typing indicator for the user
};

export const handleUserStatusNotification = (data) => {
  console.log("User Status Changed:", data.username, data.status, data);
  // Handle user status change (e.g., show them as online or offline)
};
