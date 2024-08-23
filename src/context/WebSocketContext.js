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
    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);

    client.connect({}, () => {
      setStompClient(client);
      setConnected(true);

      // Re-subscribe to all stored subscriptions when reconnecting
      Object.keys(subscriptions.current).forEach((chatRoomId) => {
        const subscriptionData = subscriptions.current[chatRoomId];
        if (!subscriptionData.unsubscribe) {
          const subscription = client.subscribe(
            `/topic/chat/${chatRoomId}`,
            (message) => {
              subscriptionData.callbacks.forEach((callback) =>
                callback(JSON.parse(message.body))
              );
            }
          );
          subscriptionData.unsubscribe = () => subscription.unsubscribe();
        }
      });
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
        callbacks: [],
        unsubscribe: null,
      };
    }

    const subscriptionData = subscriptions.current[chatRoomId];
    subscriptionData.callbacks.push(callback);

    if (!subscriptionData.unsubscribe) {
      const subscription = stompClient.subscribe(
        `/topic/chat/${chatRoomId}`,
        (message) => {
          subscriptionData.callbacks.forEach((cb) =>
            cb(JSON.parse(message.body))
          );
        }
      );
      subscriptionData.unsubscribe = () => subscription.unsubscribe();
    }

    return () => {
      // Remove callback on unsubscription
      subscriptionData.callbacks = subscriptionData.callbacks.filter(
        (cb) => cb !== callback
      );
      if (subscriptionData.callbacks.length === 0) {
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
      value={{ subscribeToChatRoom, subscribeToUser, sendMessage, connected }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
