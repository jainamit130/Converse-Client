export const handleClearChat = ({ chatRoomId, setMessages, setChatRooms }) => {
  setMessages((prevMessages) => {
    const chatRoomMessages = prevMessages.get(chatRoomId);
    if (!chatRoomMessages) return prevMessages;

    const updatedMessages = [];

    const updatedMap = new Map(prevMessages);
    updatedMap.set(chatRoomId, updatedMessages);

    setChatRooms((prevChatRooms) => {
      const chatRoom = prevChatRooms.get(chatRoomId);
      if (!chatRoom) return prevChatRooms;

      const newLatestMessage = {
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
