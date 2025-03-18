import React, { createContext, useContext, useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import config from "../../config/environment";

const UserWebSocketContext = createContext(null);

export const useUserWebSocket = () => useContext(UserWebSocketContext);

export const UserWebSocketProvider = ({ children }) => {
  const [client, setClient] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authenticationToken");
    const stompClient = new Client({
      brokerURL: `${config.CHAT_BASE_URL}`,
      connectHeaders: {
        token,
      },
      debug: (str) => {
        console.log(str);
      },
      onConnect: () => {
        console.log("User WebSocket connected");
        stompClient.subscribe("/topic/user", (message) => {
          console.log("Received message on User WebSocket:", message.body);
        });
      },
      onDisconnect: () => {
        console.log("User WebSocket disconnected");
      },
      onStompError: (error) => {
        console.error("STOMP Error:", error);
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, []);

  return (
    <UserWebSocketContext.Provider value={client}>
      {children}
    </UserWebSocketContext.Provider>
  );
};
