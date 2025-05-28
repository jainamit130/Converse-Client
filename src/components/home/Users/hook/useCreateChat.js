import { useCallback } from "react";
import axios from "axios";
import config from "../../../../config/environment";

const useCreateChat = () => {
  const baseUrl = config.CHAT_BASE_URL + config.CHAT_SUBBASE_URL;
  const storedUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("authenticationToken");

  const createChat = useCallback(
    async (userId, message) => {
      const endpoint =
        storedUserId == userId ? `/create/self/` : `/create/direct/${userId}`;
      const payload = {
        message,
      };

      try {
        const response = await axios.post(`${baseUrl}${endpoint}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        return response.data;
      } catch (error) {
        console.error("Failed to create direct chat:", error);
        return { error: "Failed to create direct chat" };
      }
    },
    [token]
  );

  const createGroupChat = useCallback(
    async (groupName, userIds) => {
      const endpoint = `/create/group`;
      const payload = {
        groupName,
        userIds,
      };

      try {
        const response = await axios.post(`${baseUrl}${endpoint}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        return response.data;
      } catch (error) {
        console.error("Failed to create group chat:", error);
        return { error: "Failed to create group chat" };
      }
    },
    [token]
  );

  return {
    createChat,
    createGroupChat,
  };
};

export default useCreateChat;
