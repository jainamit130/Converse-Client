import { Client } from "@stomp/stompjs";
import config from "../config/environment";

let client = null;
const clients = new Map(); // Only tracks subscriptions by topic

const initWebSocket = (topic, onMessage) => {
  if (!client) {
    const token = localStorage.getItem("authenticationToken") || "";
    client = new Client({
      brokerURL: `${config.CHAT_BASE_URL}/ws`,
      connectHeaders: { token: `Bearer ${token}` },
      onConnect: () => {
        // Subscribe once client is connected
        clients.forEach((_, subscribedTopic) => {
          client.subscribe(subscribedTopic, (message) => {
            const data = JSON.parse(message.body);
            clients.get(subscribedTopic)(data);
          });
        });
      },
      onDisconnect: () => console.log(`Disconnected WebSocket`),
    });

    client.activate();
  }

  if (!clients.has(topic)) {
    clients.set(topic, onMessage);

    // If already connected, subscribe immediately
    if (client.connected) {
      client.subscribe(topic, (message) => {
        const data = JSON.parse(message.body);
        onMessage(data);
      });
    }
  }

  return client;
};

const closeWebSocket = (topic) => {
  if (clients.has(topic)) {
    const { subscription } = clients.get(topic);

    try {
      subscription?.unsubscribe();
    } catch (err) {
      console.warn(`Failed to unsubscribe from topic: ${topic}`, err);
    }

    clients.delete(topic);

    if (clients.size === 0 && client?.connected) {
      client.deactivate();
      client = null;
    }
  }
};

const sendMessage = (destination, message) => {
  if (client?.connected) {
    const token = localStorage.getItem("authenticationToken") || "";
    client.publish({
      destination,
      connectHeaders: { token: `Bearer ${token}` },
      body: JSON.stringify(message),
    });
  } else {
    console.error(
      "WebSocket client not connected. Cannot publish to:",
      destination
    );
  }
};

export default () => ({ initWebSocket, closeWebSocket, sendMessage });
export { clients };
