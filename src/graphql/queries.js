import { gql } from "@apollo/client";

export const GET_CHAT_ROOMS_OF_USER = gql`
  query GetChatRoomsOfUser($userId: String!) {
    getChatRoomsOfUser(userId: $userId) {
      id
      name
      chatRoomType
      userIds
      recipientUsername
      creatorUsername
      unreadMessageCount
      latestMessage {
        id
        senderId
        timestamp
        content
        deletedForEveryone
        status
        user {
          id
          username
        }
      }
    }
  }
`;

export const GET_MESSAGES_OF_CHAT_ROOM = gql`
  query getMessagesOfChatRoom(
    $chatRoomId: String!
    $userId: String!
    $fromCount: Int
  ) {
    getMessagesOfChatRoom(
      chatRoomId: $chatRoomId
      userId: $userId
      fromCount: $fromCount
    ) {
      id
      senderId
      timestamp
      content
      status
      deletedForEveryone
      user {
        id
        username
      }
    }
  }
`;
