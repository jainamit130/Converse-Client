import { Client } from "@stomp/stompjs";
import config from "../config/environment";

let client = null;
const clients = new Map();

const extractChatRoomIdFromTopic = (topic) => {
  const parts = topic.split("/");
  const chatIndex = parts.indexOf("chat");
  return chatIndex !== -1 ? parts[chatIndex + 1] : null;
};

const initWebSocket = (topic, onMessage) => {
  if (!client) {
    const token = localStorage.getItem("authenticationToken") || "";
    client = new Client({
      brokerURL: `${config.CHAT_BASE_URL}/ws`,
      connectHeaders: { token: `Bearer ${token}` },
      onConnect: () => {
        console.log("✅ WebSocket connected");

        clients.forEach((_, subscribedTopic) => {
          const subscription = client.subscribe(subscribedTopic, (message) => {
            const data = JSON.parse(message.body);
            clients.get(subscribedTopic)(data);
          });
          clients.set(subscribedTopic, clients.get(subscribedTopic));
          console.log(`📩 Re-subscribed to topic: ${subscribedTopic}`);
        });
      },
      onDisconnect: () => {
        console.log("🛑 WebSocket disconnected");
      },
      onStompError: (frame) => {
        console.error(
          "❌ WebSocket error",
          frame.headers["message"],
          frame.body
        );
      },
    });

    client.activate();
    console.log("🚀 WebSocket client activating...");
  }

  if (!clients.has(topic)) {
    clients.set(topic, onMessage);

    if (client.connected) {
      const subscription = client.subscribe(topic, (message) => {
        const data = JSON.parse(message.body);
        onMessage(data);
      });
      console.log(`✅ Subscribed to topic: ${topic}`);
    }
  }

  return client;
};

const closeWebSocket = (topic) => {
  if (clients.has(topic)) {
    try {
      console.log(`🔕 Unsubscribing from topic: ${topic}`);
    } catch (err) {
      console.warn(`⚠️ Failed to unsubscribe from topic: ${topic}`, err);
    }

    clients.delete(topic);

    if (clients.size === 0 && client?.connected) {
      console.log("🛑 No more subscribers. Closing WebSocket...");
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
    console.log(`📤 Message sent to ${destination}`, message);
  } else {
    console.error(
      "❌ WebSocket client not connected. Cannot publish to:",
      destination
    );
  }
};

export default () => ({ initWebSocket, closeWebSocket, sendMessage });
export { clients };
