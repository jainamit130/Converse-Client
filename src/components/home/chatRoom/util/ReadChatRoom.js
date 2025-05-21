export const readChatRoom = (setChatRooms, openedChatRoomId) => {
  setChatRooms((prevMap) => {
    const updatedMap = new Map(prevMap);
    const oldChatRoom = prevMap.get(openedChatRoomId);

    if (!oldChatRoom) return prevMap;

    const newChatRoom = {
      ...oldChatRoom,
      unreadMessageCount: 0,
    };

    updatedMap.set(openedChatRoomId, newChatRoom);
    return updatedMap;
  });
};
