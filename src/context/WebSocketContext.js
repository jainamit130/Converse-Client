import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
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

  const subscribeToUser = (userId, callback) => {
    if (stompClient && connected) {
      stompClient.subscribe(`/topic/user/${userId}`, (message) => {
        callback(JSON.parse(message.body));
      });
    }
  };

  const subscribeToChatRoom = (chatRoomId, callback) => {
    if (!stompClient || !connected) {
      console.warn("WebSocket not connected yet");
      return () => {};
    }

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
          console.log("WebSocket message received:", message); // Debug log
          callback(JSON.parse(message.body));
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
