export const handleChatTransactionNotification = (
  data,
  handleIncomingMessage,
  handleContextOnMemberTransaction
) => {
  const { notifications } = data;
  notifications.forEach((notification) => {
    handleIncomingMessage(notification.message);
    handleContextOnMemberTransaction(notification);
  });
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

export const handleMessageNotification = (
  message,
  setChatRooms,
  setMessages,
  activeChatRoomId
) => {
  const chatRoomId = message.chatRoomId;

  if (activeChatRoomId === chatRoomId) {
    setMessages((prevMap) => {
      const prevMessages = prevMap.get(chatRoomId) || [];

      const exists = prevMessages.some((msg) => msg.id === message.id);
      if (exists) return prevMap;

      const updatedMessages = [...prevMessages, message];
      const updatedMap = new Map(prevMap);
      updatedMap.set(chatRoomId, updatedMessages);
      return updatedMap;
    });
  }

  setChatRooms((prevChatRooms) => {
    const chatRoom = prevChatRooms.get(chatRoomId);
    if (!chatRoom) return prevChatRooms;

    // Avoid double-counting if this message is already the latest
    const shouldStayUnaffected =
      chatRoom.latestMessage?.id === message.id ||
      message.__typename === "NotificationMessage";

    const updatedChatRoom = {
      ...chatRoom,
      latestMessage: message,
      unreadMessageCount:
        activeChatRoomId === chatRoomId
          ? 0
          : shouldStayUnaffected
          ? chatRoom.unreadMessageCount || 0
          : (chatRoom.unreadMessageCount || 0) + 1,
    };

    const updatedMap = new Map();
    updatedMap.set(chatRoomId, updatedChatRoom);

    for (const [key, value] of prevChatRooms.entries()) {
      if (key !== chatRoomId) {
        updatedMap.set(key, value);
      }
    }

    return updatedMap;
  });
};

export const handleTypingNotification = (data, setTyping, activeChatRoomId) => {
  const { chatRoomId, typingUsernames } = data;

  if (chatRoomId === activeChatRoomId && typingUsernames?.length > 0) {
    setTyping(typingUsernames);
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
    setLastSeen(null);
    setOnlineUsers((prev) => {
      if (!Array.isArray(prev)) return [username];
      if (!prev.includes(username)) {
        return [...prev, username];
      }
      return prev;
    });
  } else if (status === "INACTIVE") {
    const now = new Date().toISOString();
    setLastSeen(now);
    setOnlineUsers((prev) => {
      if (!Array.isArray(prev)) return [];
      const updated = prev.filter((user) => user !== username);
      return updated;
    });
  }
};
