export const handleChatTransactionNotification = (data) => {
  console.log("Group Transaction:", data.message);
};

export const handleMessageDeletedNotification = (
  data,
  chatRooms,
  setChatRooms,
  setMessages
) => {
  const { messageIds } = data;
  const userId = localStorage.getItem("userId");
  const chatRoomId = localStorage.getItem("activeChatRoomId");
  const messageIdsToUpdate = new Set(messageIds);

  const updatedChatRooms = new Map(chatRooms);
  const chatRoom = updatedChatRooms.get(chatRoomId);
  if (!chatRoom) return;

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
          deletedForEveryOne: true,
        };
      }
      return msg;
    });

    updatedMessages.set(chatRoomId, newMessages);
    return updatedMessages;
  });

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
        deletedForEveryOne: true,
      },
    });

    setChatRooms(updatedChatRooms);
  }
};

export const handleMessageNotification = (
  data,
  chatRooms,
  setChatRooms,
  setMessages
) => {
  const chatRoom = chatRooms.get(data.message.chatRoomId);
  if (!chatRoom) return;

  let updatedChatRoom = {
    ...chatRoom,
    latestMessage: data.message,
  };

  const activeChatRoomId = localStorage.getItem("activeChatRoomId");

  if (activeChatRoomId) {
    if (activeChatRoomId === chatRoom.id) {
      updatedChatRoom.unreadMessageCount = 0;

      setMessages((prevMap) => {
        const prevMessages = prevMap.get(activeChatRoomId) || [];
        const updatedMessages = [...prevMessages, data.message];

        const updatedMap = new Map(prevMap);
        updatedMap.set(activeChatRoomId, updatedMessages);
        return updatedMap;
      });
    } else {
      updatedChatRoom = {
        ...updatedChatRoom,
        unreadMessageCount: (chatRoom.unreadMessageCount || 0) + 1,
      };
    }
  }

  const updatedChatRooms = new Map(chatRooms);
  updatedChatRooms.set(chatRoom.id, updatedChatRoom);
  setChatRooms(updatedChatRooms);
};

export const handleTypingNotification = (data, setTyping) => {
  if (data.typingUsernames && data.typingUsernames.length > 0) {
    setTyping(data.typingUsernames);
  } else {
    setTyping([]);
  }
};

export const handleUserStatusNotification = (data) => {
  console.log("User Status Changed:", data.username, data.status, data);
  // Handle user status change (e.g., show them as online or offline)
};
