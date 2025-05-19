import { useCallback } from "react";
import axios from "axios";
import config from "../../../../config/environment";

const useDelete = () => {
  const baseUrl = config.CHAT_BASE_URL + config.CHAT_SUBBASE_URL;
  const token = localStorage.getItem("authenticationToken");

  const deleteMessages = useCallback(
    async ({ chatRoomId, messageIds, forEveryone = false }) => {
      if (
        !chatRoomId ||
        !Array.isArray(messageIds) ||
        messageIds.length === 0
      ) {
        console.error(
          "Invalid delete request: Missing chatRoomId or messageIds"
        );
        return false;
      }

      const endpoint = forEveryone
        ? `/delete/messages/everyone/${chatRoomId}`
        : `/delete/messages/me/${chatRoomId}`;

      try {
        const response = await axios.post(`${baseUrl}${endpoint}`, messageIds, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        return response.status === 204;
      } catch (error) {
        console.error(
          `Failed to delete messages (${forEveryone ? "everyone" : "me"}):`,
          error
        );
        return false;
      }
    },
    [token]
  );

  return { deleteMessages };
};

export default useDelete;
