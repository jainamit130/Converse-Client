import { useChatRoomWebSocket } from "../../../context/WebSocketContext/ChatRoomWebSocketContext";

export const handleChatTransactionNotification = (data) => {
  console.log("Group Transaction:", data.message);
  // Update your UI based on the message data
};

export const handleMessageDeletedNotification = (data) => {
  console.log("Message Deleted:", data.message);
  // Update your UI based on the message data
};

export const handleMessageNotification = (
  data,
  chatRooms,
  setChatRooms,
  setMessages
) => {
  console.log("Message Received:", data.message);

  // Find the respective chat room
  const chatRoom = chatRooms.find(
    (room) => room.id === data.message.chatRoomId
  );

  if (chatRoom) {
    // Update the latestMessage for the chatRoom
    chatRoom.setLatestMessage(data.message);

    // If the user has the chatRoom opened, add the message to the list
    const activeChatRoomId = localStorage.getItem("activeChatRoomId");
    if (activeChatRoomId && activeChatRoomId === chatRoom.id) {
      // Assuming that messages is an array inside the chat room
      setMessages((prevMessages) => [...prevMessages, data.message]);
    }
  }
};

export const handleTypingNotification = (data) => {
  console.log("User Typing:", data.typingUsernames);
  // Show typing indicator for the user
};

export const handleUserStatusNotification = (data) => {
  console.log("User Status Changed:", data.username, data.status);
  // Handle user status change (e.g., show them as online or offline)
};
