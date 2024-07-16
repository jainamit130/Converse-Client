import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
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

  const subscribeToChatRoom = (chatRoomId, callback) => {
    if (stompClient && connected) {
      const subscription = stompClient.subscribe(
        `/topic/chat/${chatRoomId}`,
        (message) => {
          callback(JSON.parse(message.body));
        }
      );
      return () => subscription.unsubscribe();
    }
    return () => {};
  };

  const sendMessage = (destination, body) => {
    if (stompClient && connected) {
      stompClient.send(destination, {}, JSON.stringify(body));
    }
  };

  return (
    <WebSocketContext.Provider
      value={{ subscribeToChatRoom, sendMessage, connected }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
