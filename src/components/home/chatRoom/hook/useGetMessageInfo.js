import { useCallback } from "react";
import axios from "axios";
import config from "../../../../config/environment";

const useGetMessageInfo = () => {
  const baseUrl = config.CHAT_BASE_URL + config.USER_SUBBASE_URL;
  const token = localStorage.getItem("authenticationToken");

  const getMessageInfo = useCallback(
    async ({ messageId }) => {
      if (!messageId) {
        console.error("Invalid request: Missing messageId");
        return { error: "messageId is required" };
      }

      const endpoint = `/get/messageInfo/${messageId}`;

      try {
        const response = await axios.get(`${baseUrl}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        return response.data;
      } catch (error) {
        console.error("Failed to fetch message info:", error);
        return { error: "Failed to fetch message info" };
      }
    },
    [token]
  );

  return { getMessageInfo };
};

export default useGetMessageInfo;
