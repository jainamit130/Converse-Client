import { useCallback } from "react";
import axios from "axios";
import config from "../../../../config/environment";

const useGetUsers = () => {
  const baseUrl = config.CHAT_BASE_URL + config.USER_SUBBASE_URL;
  const token = localStorage.getItem("authenticationToken");

  const getUsers = useCallback(
    async (chatRoom) => {
      const endpoint = `/getUsers`;

      try {
        const response = await axios.get(`${baseUrl}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: chatRoom?.id ? { chatRoomId: chatRoom.id } : {},
        });

        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error("Failed to get contacts:", error);
        return { error: "Failed to get users" };
      }
    },
    [token]
  );

  return { getUsers };
};

export default useGetUsers;
