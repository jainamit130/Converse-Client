import { useMutation } from "@apollo/client";
import {
  MARK_ALL_MESSAGES_DELIVERED,
  MARK_ALL_MESSAGES_READ,
} from "../graphql/mutations";

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
    } catch (error) {
      console.error("Error marking messages as read", error);
    }
  };

  return handleMarkAllMessagesRead;
};

export const useMarkAllMessagesDelivered = (userId) => {
  const [markAllMessagesDelivered] = useMutation(MARK_ALL_MESSAGES_DELIVERED);

  const handleMarkAllMessagesDelivered = async () => {
    try {
      await markAllMessagesDelivered({
        variables: {
          userId: userId,
        },
      });
    } catch (error) {
      console.error("Error marking messages as delivered", error);
    }
  };

  return handleMarkAllMessagesDelivered;
};
