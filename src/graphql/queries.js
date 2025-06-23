import { gql } from "@apollo/client";

export const GET_CHAT_ROOMS_OF_USER = gql`
  query getChatRoomsOfUser {
    getChatRoomsOfUser {
      id
      chatRoomName
      chatRoomType
      userIds
      unreadMessageCount
      counterPartUserId
      isExited
      latestMessage {
        ... on ChatMessage {
          id
          senderId
          name
          timestamp
          content
          status
          deletedForEveryone
        }
        ... on NotificationMessage {
          id
          timestamp
          content
        }
      }
    }
  }
`;

// id can be null if no message present
// senderId can be null if not chatMessage but a notification/system message
// name can be null if not chatMessage but a notification/system message
// timestamp can be null if no messages present
// content always present even no messages have some content
// status can be null if the user is not the message sender

export const GET_CHAT_ROOM_DATA = gql`
  query getChatRoomData($chatRoomId: String!) {
    getChatRoomData(chatRoomId: $chatRoomId) {
      messages {
        ... on ChatMessage {
          id
          senderId
          name
          timestamp
          content
          status
          deletedForEveryone
        }
        ... on NotificationMessage {
          id
          timestamp
          content
          isChatHistoryShared
        }
      }
      onlineUsersDTO {
        ... on DirectChatOnlineUsersDTO {
          lastSeenTimestamp
        }
        ... on SelfChatOnlineUsersDTO {
          lastSeenTimestamp
        }
        ... on GroupChatOnlineUsersDTO {
          lastSeenTimestamp
          onlineUsers
        }
      }
    }
  }
`;

// id can be null if no message present
// senderId can be null if not chatMessage but a notification/system message
// name can be null if not chatMessage but a notification/system message
// timestamp can be null if no messages present
// content always present even no messages have some content
// status can be null if the user is not the message sender
