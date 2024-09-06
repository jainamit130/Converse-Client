import { useMutation } from "@apollo/client";
import { MARK_ALL_MESSAGES_READ } from "../graphql/mutations";

export const useMarkAllMessagesRead = (chatRoomId, userId) => {
  const [markAllMessagesRead] = useMutation(MARK_ALL_MESSAGES_READ);

  const handleMarkAllMessagesRead = async () => {
    try {
      await markAllMessagesRead({
        variables: {
          chatRoomId: chatRoomId,
          userId: userId,
        },
      });
      console.log("Messages marked as read");
    } catch (error) {
      console.error("Error marking messages as read", error);
    }
  };

  return handleMarkAllMessagesRead;
};
