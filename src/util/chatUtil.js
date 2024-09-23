export const sortChatRooms = (rooms) => {
  return new Map(
    Array.from(rooms.entries()).sort((a, b) => {
      const aUnreadCount = a[1].unreadMessageCount;
      const bUnreadCount = b[1].unreadMessageCount;
      if (aUnreadCount !== bUnreadCount) {
        return bUnreadCount - aUnreadCount;
      }

      const aLatestMessage = a[1].latestMessage?.timestamp || 0;
      const bLatestMessage = b[1].latestMessage?.timestamp || 0;

      return new Date(bLatestMessage) - new Date(aLatestMessage);
    })
  );
};
