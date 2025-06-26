import { useCallback } from "react";
import axios from "axios";
import config from "../../../../config/environment";

const useClear = () => {
  const baseUrl = config.CHAT_BASE_URL + config.CHAT_SUBBASE_URL;
  const token = localStorage.getItem("authenticationToken");

  const clearChat = useCallback(
    async ({ chatRoomId }) => {
      if (!chatRoomId) {
        console.error("Invalid clear request: Missing chatRoomId");
        return { error: "chatRoomId is required" };
      }

      const endpoint = `/clearChat/${chatRoomId}`;

      try {
        const response = await axios.post(
          `${baseUrl}${endpoint}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        return response;
      } catch (error) {
        console.error("Failed to clear chat:", error);
        return { error: "Failed to clear chat" };
      }
    },
    [token]
  );

  return { clearChat };
};

export default useClear;
