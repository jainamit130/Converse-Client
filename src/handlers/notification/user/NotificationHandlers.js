export const handleNewChatNotification = (data) => {
  console.log("New Chat Received:", data.message);
  // Update your UI based on the message data
};

export const handleMessageMarkedNotification = (notification, setMessages) => {
  const { chatRoomId, messageIds, notificationType } = notification;

  setMessages((prevMessages) => {
    const chatRoomMessages = prevMessages.get(chatRoomId);
    if (!chatRoomMessages) return prevMessages;

    const messageMap = new Map(chatRoomMessages.map((msg) => [msg.id, msg]));

    messageIds.forEach((id) => {
      const msg = messageMap.get(id);
      if (msg) {
        const updatedMsg = {
          ...msg,
          status: notificationType === "MESSAGE_READ" ? "READ" : "DELIVERED",
        };
        messageMap.set(id, updatedMsg);
      }
    });

    const updatedMessagesArray = Array.from(messageMap.values());

    const newMessagesMap = new Map(prevMessages);
    newMessagesMap.set(chatRoomId, updatedMessagesArray);
    return newMessagesMap;
  });
};
