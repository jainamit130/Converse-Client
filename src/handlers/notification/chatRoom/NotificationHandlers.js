export const handleChatTransactionNotification = (data) => {
  console.log("Group Transaction:", data.message);
};

export const handleMessageDeletedNotification = (
  data,
  setChatRooms,
  setMessages
) => {
  const { messageIds, chatRoomId } = data;
  const userId = localStorage.getItem("userId");

  if (!chatRoomId) {
    console.error("Missing chatRoomId in MESSAGE_DELETED notification");
    return;
  }

  const messageIdsToUpdate = new Set(messageIds);

  // ✅ Update messages
  setMessages((prevMessages) => {
    const updatedMessages = new Map(prevMessages);
    const messagesForRoom = updatedMessages.get(chatRoomId) || [];

    const newMessages = messagesForRoom.map((msg) => {
      if (messageIdsToUpdate.has(msg.id)) {
        const content =
          msg.senderId === userId
            ? "You deleted this message!"
            : "This message was deleted!";
        return {
          ...msg,
          content,
          deletedForEveryone: true,
        };
      }
      return msg;
    });

    updatedMessages.set(chatRoomId, newMessages);
    return updatedMessages;
  });

  // ✅ Update chatRoom using setChatRooms functionally
  setChatRooms((prevChatRooms) => {
    const updatedChatRooms = new Map(prevChatRooms);
    const chatRoom = updatedChatRooms.get(chatRoomId);
    if (!chatRoom) return updatedChatRooms;

    if (
      chatRoom.latestMessage &&
      messageIdsToUpdate.has(chatRoom.latestMessage.id)
    ) {
      const latest = chatRoom.latestMessage;
      const content =
        latest.senderId === userId
          ? "You deleted this message!"
          : "This message was deleted!";

      updatedChatRooms.set(chatRoomId, {
        ...chatRoom,
        latestMessage: {
          ...latest,
          content,
          deletedForEveryone: true,
        },
      });
    }

    return updatedChatRooms;
  });
};

export const handleMessageNotification = (data, setChatRooms, setMessages) => {
  const { message } = data;
  const chatRoomId = message.chatRoomId;
  const activeChatRoomId = localStorage.getItem("activeChatRoomId");

  // ✅ Update messages for active room
  if (activeChatRoomId === chatRoomId) {
    setMessages((prevMap) => {
      const prevMessages = prevMap.get(chatRoomId) || [];
      const updatedMessages = [...prevMessages, message];

      const updatedMap = new Map(prevMap);
      updatedMap.set(chatRoomId, updatedMessages);
      return updatedMap;
    });
  }

  // ✅ Update chatRooms state safely using the functional form
  setChatRooms((prevChatRooms) => {
    const chatRoom = prevChatRooms.get(chatRoomId);
    if (!chatRoom) return prevChatRooms;

    const updatedChatRoom = {
      ...chatRoom,
      latestMessage: message,
      unreadMessageCount:
        activeChatRoomId === chatRoomId
          ? 0
          : (chatRoom.unreadMessageCount || 0) + 1,
    };

    const updatedMap = new Map(prevChatRooms);
    updatedMap.set(chatRoomId, updatedChatRoom);
    return updatedMap;
  });
};

export const handleTypingNotification = (data, setTyping) => {
  if (data.typingUsernames && data.typingUsernames.length > 0) {
    setTyping(data.typingUsernames);
  } else {
    setTyping([]);
  }
};

export const handleUserStatusNotification = (
  data,
  setOnlineUsers,
  setLastSeen
) => {
  const { username, status } = data;

  console.log("User Status Changed:", username, status);

  if (!username || !status) return;

  if (status === "ACTIVE") {
    setOnlineUsers((prev) => {
      if (!Array.isArray(prev)) return [username];
      if (!prev.includes(username)) {
        return [...prev, username];
      }
      return prev;
    });
  } else if (status === "INACTIVE") {
    setOnlineUsers((prev) => {
      if (!Array.isArray(prev)) return [];
      const updated = prev.filter((user) => user !== username);
      return updated;
    });

    const now = new Date().toISOString();
    setLastSeen(now);
  }
};
