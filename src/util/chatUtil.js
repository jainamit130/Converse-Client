export const sortChatRooms = (rooms) => {
  return new Map(
    Array.from(rooms.entries()).sort((a, b) => {
      const aLatestMessage = a[1].latestMessage?.timestamp || 0;
      const bLatestMessage = b[1].latestMessage?.timestamp || 0;

      if (aLatestMessage !== bLatestMessage) {
        return new Date(bLatestMessage) - new Date(aLatestMessage);
      }

      const aUnreadCount = a[1].unreadMessageCount;
      const bUnreadCount = b[1].unreadMessageCount;

      return bUnreadCount - aUnreadCount;
    })
  );
};
