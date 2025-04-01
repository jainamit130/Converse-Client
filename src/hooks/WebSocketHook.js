import { useState } from "react";
import { Client } from "@stomp/stompjs";
import config from "../config/environment";

const useWebSocket = () => {
  const brokerURL = `${config.CHAT_BASE_URL}/ws`;
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);

  const initWebSocket = (topic, onMessage) => {
    const token = localStorage.getItem("authenticationToken") || "";
    const stompClient = new Client({
      brokerURL: brokerURL,
      connectHeaders: {
        token: `Bearer ${token}`,
      },
      onConnect: () => {
        console.log(`${topic} WebSocket connected`);
        stompClient.subscribe(topic, (message) => {
          const messageData = JSON.parse(message.body);
          onMessage(messageData);
        });
        setConnected(true); // Mark as connected
      },
      onDisconnect: () => {
        console.log(`${topic} WebSocket disconnected`);
        setConnected(false); // Mark as disconnected
      },
    });

    stompClient.activate();
    setClient(stompClient);
  };

  const closeWebSocket = () => {
    if (client) {
      client.deactivate();
    }
  };

  const sendMessage = (topic, message) => {
    if (client && connected) {
      client.publish({
        destination: topic,
        body: JSON.stringify(message),
      });
    } else {
      console.error("WebSocket not connected. Cannot send message.");
    }
  };

  return { initWebSocket, closeWebSocket, sendMessage, client };
};

export default useWebSocket;
