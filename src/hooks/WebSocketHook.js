import { useState } from "react";
import { Client } from "@stomp/stompjs";
import config from "../config/environment";

const useWebSocket = () => {
  const brokerURL = `${config.CHAT_BASE_URL}/ws`;
  const [client, setClient] = useState(null);

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
      },
      onDisconnect: () => {
        console.log(`${topic} WebSocket disconnected`);
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

  return { initWebSocket, closeWebSocket, client };
};

export default useWebSocket;
