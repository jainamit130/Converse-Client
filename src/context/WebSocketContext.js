import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useChatRoom } from "./ChatRoomContext";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);
  const { addMessageToRoom, mergeChatRooms, chatRooms, setChatRooms } =
    useChatRoom();
  const [connected, setConnected] = useState(false);
  const [allSubscriptions, setAllSubscriptions] = useState([]);
  const subscriptions = useRef({});

  useEffect(() => {
    const token = localStorage.getItem("authenticationToken");
    const socket = new SockJS(`http://localhost:8080/ws?token=${token}`);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      setStompClient(client);
      setConnected(true);
    });

    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (stompClient && connected) {
      const userId = localStorage.getItem("userId");
      if (userId) {
        subscribeToUser(userId, (message) => {
          mergeChatRooms(message);
        });
      }
    }
  }, [stompClient, connected]);

  useEffect(() => {
    if (stompClient && connected) {
      chatRooms.forEach((chatRoom) => {
        setAllSubscriptions((prevSubs) => [
          ...prevSubs,
          subscribeToChatRoom(chatRoom.id),
        ]);
      });
    }
  }, [stompClient, connected, chatRooms]);

  const subscribeToUser = (userId) => {
    stompClient.subscribe(`/topic/user/${userId}`, (message) => {
      const chatRoom = JSON.parse(message.body);
      mergeChatRooms(chatRoom);
    });
  };

  const subscribeToChatRoom = (chatRoomId) => {
    if (!subscriptions.current[chatRoomId]) {
      subscriptions.current[chatRoomId] = {
        count: 0,
        unsubscribe: null,
      };
    }

    const subscriptionData = subscriptions.current[chatRoomId];
    subscriptionData.count += 1;

    if (!subscriptionData.unsubscribe) {
      const subscription = stompClient.subscribe(
        `/topic/chat/${chatRoomId}`,
        (message) => {
          const parsedMessage = JSON.parse(message.body);
          addMessageToRoom(chatRoomId, parsedMessage);

          setChatRooms((prevChatRooms) =>
            prevChatRooms.map((room) =>
              chatRoomId === room.id
                ? { ...room, latestMessage: parsedMessage }
                : room
            )
          );
        }
      );

      subscriptionData.unsubscribe = () => subscription.unsubscribe();
    }

    return () => {
      subscriptionData.count -= 1;
      if (subscriptionData.count === 0) {
        subscriptionData.unsubscribe();
        subscriptionData.unsubscribe = null;
      }
    };
  };

  const sendMessage = (destination, body) => {
    if (stompClient && connected) {
      stompClient.send(destination, {}, JSON.stringify(body));
    }
  };

  return (
    <WebSocketContext.Provider
      value={{ subscribeToChatRoom, sendMessage, subscribeToUser, connected }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
