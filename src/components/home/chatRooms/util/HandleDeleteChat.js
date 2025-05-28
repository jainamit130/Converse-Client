export const handleDeleteChat = ({
  chatRoomId,
  setChatRooms,
  setActiveChatRoomId,
  setDirectSelfChats,
}) => {
  localStorage.removeItem("activeChatRoomName");
  localStorage.removeItem("activeChatRoomType");
  localStorage.removeItem("activeChatRoomId");
  setActiveChatRoomId(null);

  setChatRooms((prevChatRooms) => {
    const updatedChatRooms = new Map(prevChatRooms);

    const chatRoom = updatedChatRooms.get(chatRoomId);

    updatedChatRooms.delete(chatRoomId);

    if (
      chatRoom &&
      (chatRoom.chatRoomType === "DIRECT" || chatRoom.chatRoomType === "SELF")
    ) {
      setDirectSelfChats((prev) => {
        const updated = new Map(prev);
        updated.delete(chatRoom.chatRoomName);
        return updated;
      });
    }

    return updatedChatRooms;
  });
};
