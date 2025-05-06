export const handleNewChatNotification = (data) => {
  console.log("New Chat Received:", data.message);
  // Update your UI based on the message data
};

export const handleMessageMarkedNotification = (notification, setMessages) => {
  const { chatRoomId, messageIds, notificationType } = notification;

  setMessages((prevMessages) => {
    const chatRoomMessages = prevMessages.get(chatRoomId);
    if (!chatRoomMessages) return prevMessages;

    const updatedRoomMessages = new Map(chatRoomMessages);

    messageIds.forEach((id) => {
      const msg = updatedRoomMessages.get(id);
      if (msg) {
        msg.status = notificationType === "MESSAGE_READ" ? "READ" : "DELIVERED";
        updatedRoomMessages.set(id, { ...msg });
      }
    });

    const newMessagesMap = new Map(prevMessages);
    newMessagesMap.set(chatRoomId, updatedRoomMessages);
    return newMessagesMap;
  });
};
