import { useState } from "react";
import config from "../../../../config/environment";
import axios from "axios";

const useGetChatInfo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const baseChatUrl = config.CHAT_BASE_URL + config.CHAT_SUBBASE_URL;
  const baseUserUrl = config.CHAT_BASE_URL + config.USER_SUBBASE_URL;
  const token = localStorage.getItem("authenticationToken");

  const fetchGroupInfo = async (chatRoomId) => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = `/group/get/details/${chatRoomId}`;
      const response = await axios.get(`${baseChatUrl}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (err) {
      console.error("Failed to fetch group info:", err);
      setError("Failed to fetch group info");
      return { error: "Failed to fetch group info" };
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileInfo = async (userId) => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = `/get/profile/${userId}`;
      const response = await axios.get(`${baseUserUrl}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (err) {
      console.error("Failed to fetch profile info:", err);
      setError("Failed to fetch profile info");
      return { error: "Failed to fetch profile info" };
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchGroupInfo,
    fetchProfileInfo,
    loading,
    error,
  };
};

export default useGetChatInfo;
