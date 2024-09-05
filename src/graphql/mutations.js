import { gql } from "@apollo/client";

export const MARK_ALL_MESSAGES_READ = gql`
  mutation MarkAllMessagesRead($chatRoomId: String!, $userId: String!) {
    markAllMessagesRead(chatRoomId: $chatRoomId, userId: $userId)
  }
`;
