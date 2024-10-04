import { gql } from "@apollo/client";

export const GET_CHAT_ROOMS_OF_USER = gql`
  query GetChatRoomsOfUser($userId: String!) {
    getChatRoomsOfUser(userId: $userId) {
      id
      name
      chatRoomType
      userIds
      unreadMessageCount
      latestMessage {
        id
        senderId
        timestamp
        content
        user {
          id
          username
        }
      }
    }
  }
`;

export const GET_MESSAGES_OF_CHAT_ROOM = gql`
  query getMessagesOfChatRoom($chatRoomId: String!, $fromCount: Int) {
    getMessagesOfChatRoom(chatRoomId: $chatRoomId, fromCount: $fromCount) {
      id
      senderId
      timestamp
      content
      status
      user {
        id
        username
      }
    }
  }
`;
