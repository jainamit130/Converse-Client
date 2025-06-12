import { useState } from "react";
import config from "../../../../config/environment";
import axios from "axios";

const useGetGroupInfo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const baseUrl = config.CHAT_BASE_URL + config.CHAT_SUBBASE_URL;
  const token = localStorage.getItem("authenticationToken");

  const fetchGroupInfo = async (chatRoomId) => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = `/group/get/details/${chatRoomId}`;
      const response = await axios.get(`${baseUrl}${endpoint}`, {
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

  return {
    fetchGroupInfo,
    loading,
    error,
  };
};

export default useGetGroupInfo;
