export const handleNewChatNotification = (data) => {
  console.log("New Chat Received:", data.message);
};

export const handleMessageMarkedNotification = (
  notification,
  setMessages,
  setChatRooms
) => {
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

    const latestMessage = updatedMessagesArray[updatedMessagesArray.length - 1];
    if (latestMessage) {
      const updatedChatRoomMessage = {
        ...latestMessage,
        status: notificationType === "MESSAGE_READ" ? "READ" : "DELIVERED",
      };
      updatedMessagesArray[updatedMessagesArray.length - 1] =
        updatedChatRoomMessage;
    }

    const newMessagesMap = new Map(prevMessages);
    newMessagesMap.set(chatRoomId, updatedMessagesArray);

    setChatRooms((prevChatRooms) => {
      const updatedChatRooms = new Map(prevChatRooms);
      const chatRoom = updatedChatRooms.get(chatRoomId);
      if (chatRoom) {
        const updatedChatRoom = {
          ...chatRoom,
          latestMessage: updatedMessagesArray[updatedMessagesArray.length - 1], // Set the latest message's updated status
        };
        updatedChatRooms.set(chatRoomId, updatedChatRoom);
      }
      return updatedChatRooms;
    });

    return newMessagesMap;
  });
};
