export const handleDeleteChat = ({
  chatRoomId,
  setChatRooms,
  setActiveChatRoomId,
}) => {
  localStorage.removeItem("activeChatRoomName");
  localStorage.removeItem("activeChatRoomType");
  localStorage.removeItem("activeChatRoomId");
  setActiveChatRoomId(null);
  setChatRooms((prevChatRooms) => {
    const updatedChatRooms = new Map(prevChatRooms);
    updatedChatRooms.delete(chatRoomId);
    return updatedChatRooms;
  });
};
