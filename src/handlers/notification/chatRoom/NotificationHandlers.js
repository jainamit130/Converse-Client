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
  data,
  setChatRooms,
  setMessages,
  activeChatRoomId
) => {
  const { message } = data;
  const chatRoomId = message.chatRoomId;

  if (activeChatRoomId === chatRoomId) {
    setMessages((prevMap) => {
      const prevMessages = prevMap.get(chatRoomId) || [];
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
    const isAlreadyLatest = chatRoom.latestMessage?.id === message.id;

    const updatedChatRoom = {
      ...chatRoom,
      latestMessage: message,
      unreadMessageCount:
        activeChatRoomId === chatRoomId
          ? 0
          : isAlreadyLatest
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
