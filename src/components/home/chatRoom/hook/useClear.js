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
        return { error: "chatRoomId is required" }; // Returning an error object
      }

      const endpoint = `/clearChat/${chatRoomId}`;

      try {
        const response = await axios.post(
          `${baseUrl}${endpoint}`,
          {}, // Empty payload
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        return response.status === 204
          ? { success: true } // A successful response
          : { error: "Failed to clear chat" }; // If the status isn't 204
      } catch (error) {
        console.error("Failed to clear chat:", error);
        return { error: "Failed to clear chat" }; // Handle error
      }
    },
    [token]
  );

  return { clearChat };
};

export default useClear;
