import { useCallback } from "react";
import axios from "axios";
import config from "../../../../config/environment";

const useDeleteChat = () => {
  const baseUrl = config.CHAT_BASE_URL + config.CHAT_SUBBASE_URL;
  const token = localStorage.getItem("authenticationToken");

  const deleteChat = useCallback(
    async ({ chatRoomId }) => {
      if (!chatRoomId) {
        console.error("Invalid delete chat: Missing chatRoomId");
        return false;
      }

      const endpoint = `/deleteChat/${chatRoomId}`;

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

        return response.status === 204;
      } catch (error) {
        console.error(`Failed to delete chat`, error);
        return false;
      }
    },
    [token]
  );

  return { deleteChat };
};

export default useDeleteChat;
