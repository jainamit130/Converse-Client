import { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import config from "../config/environment";

const useWebSocket = (topic, onMessage) => {
  const brokerURL = `${config.CHAT_BASE_URL}`;
  const [client, setClient] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authenticationToken") || "";
    const stompClient = new Client({
      brokerURL: brokerURL,
      connectHeaders: {
        token,
      },
      debug: (str) => {
        console.log(str);
      },
      onConnect: () => {
        console.log(`${topic} WebSocket connected`);
        stompClient.subscribe(topic, (message) => {
          const messageData = JSON.parse(message.body);
          onMessage(messageData); // Custom handler passed by the provider
        });
      },
      onDisconnect: () => {
        console.log(`${topic} WebSocket disconnected`);
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
  }, [brokerURL, topic, onMessage]);

  return client;
};

export default useWebSocket;
