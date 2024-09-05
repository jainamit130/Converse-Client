import { gql } from "@apollo/client";

export const GET_CHAT_ROOMS_OF_USER = gql`
  query GetChatRoomsOfUser($userId: String!) {
    getChatRoomsOfUser(userId: $userId) {
      id
      name
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
  query getMessagesOfChatRoom($chatRoomId: String!) {
    getMessagesOfChatRoom(chatRoomId: $chatRoomId) {
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
`;
