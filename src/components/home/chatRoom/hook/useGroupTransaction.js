import { useCallback } from "react";
import axios from "axios";
import config from "../../../../config/environment";

const useGroupTransaction = () => {
  const baseUrl = config.CHAT_BASE_URL + config.CHAT_SUBBASE_URL + "/group";
  const token = localStorage.getItem("authenticationToken");

  const makePostRequest = useCallback(
    async ({ endpoint, payload = {} }) => {
      if (!endpoint) {
        console.error("Missing endpoint for POST request");
        return { error: "Endpoint is required" };
      }

      try {
        const response = await axios.post(`${baseUrl}${endpoint}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        return response.status === 204
          ? { success: true }
          : { error: "Unexpected response status" };
      } catch (error) {
        console.error("POST request failed:", error);
        return { error: error?.response?.data?.message || "Request failed" };
      }
    },
    [baseUrl, token]
  );

  const exitChat = useCallback(
    ({ chatRoomId }) => {
      if (!chatRoomId) {
        console.error("Missing chatRoomId for exitChat");
        return { error: "chatRoomId is required" };
      }

      return makePostRequest({
        endpoint: `/exit/${chatRoomId}`,
      });
    },
    [makePostRequest]
  );

  const removeUsers = useCallback(
    ({ chatRoomId, users }) => {
      if (!chatRoomId) {
        console.error("Missing chatRoomId for removeUsers");
        return { error: "chatRoomId is required" };
      }

      return makePostRequest({
        endpoint: `/remove/users/${chatRoomId}`,
        payload: users,
      });
    },
    [makePostRequest]
  );

  const addUsers = useCallback(
    ({ chatRoomId, users, shareHistory = false }) => {
      if (!chatRoomId) {
        console.error("Missing chatRoomId for addUsers");
        return { error: "chatRoomId is required" };
      }

      const query = `?shareHistory=${encodeURIComponent(shareHistory)}`;
      const endpoint = `/add/users/${chatRoomId}${query}`;

      return makePostRequest({
        endpoint,
        payload: users,
      });
    },
    [makePostRequest]
  );

  return { exitChat, removeUsers, addUsers };
};

export default useGroupTransaction;
