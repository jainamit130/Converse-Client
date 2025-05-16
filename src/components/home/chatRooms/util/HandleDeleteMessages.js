export const handleDeleteMessages = ({
  chatRoomId,
  setMessages,
  setChatRooms,
  messageIds,
}) => {
  setMessages((prevMessages) => {
    const chatRoomMessages = prevMessages.get(chatRoomId);
    if (!chatRoomMessages) return prevMessages;

    const updatedMessages = chatRoomMessages.filter(
      (msg) => !messageIds.includes(msg.id)
    );

    const updatedMap = new Map(prevMessages);
    updatedMap.set(chatRoomId, updatedMessages);

    setChatRooms((prevChatRooms) => {
      const chatRoom = prevChatRooms.get(chatRoomId);
      if (!chatRoom) return prevChatRooms;

      const newLatestMessage =
        updatedMessages.length > 0
          ? updatedMessages[updatedMessages.length - 1]
          : {
              content: "There are no messages!",
              id: "__empty__",
              senderId: null,
              status: null,
              deletedForEveryone: false,
              timestamp: null,
            };

      const updatedChatRoom = {
        ...chatRoom,
        latestMessage: newLatestMessage,
      };

      const updatedChatRooms = new Map(prevChatRooms);
      updatedChatRooms.set(chatRoomId, updatedChatRoom);
      return updatedChatRooms;
    });

    return updatedMap;
  });
};
