import { useState } from "react";
import config from "../config/environment";
import { useUser } from "../context/UserContext";
import axios from "axios";

const useGetGroupInfo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, userId } = useUser();
  const BASE_URL = config.CHAT_BASE_URL;

  const fetchGroupInfo = async (chatRoomId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/chat/groups/details/${chatRoomId}`
      );
      return response.data;
    } catch (err) {
      setError(err);
      console.error("Error fetching group info:", err);
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
