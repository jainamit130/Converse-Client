import { useState } from "react";
import config from "../config/environment";
import { useUser } from "../context/UserContext";
import axios from "axios";

const useDelete = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, userId } = useUser();
  const BASE_URL = config.CHAT_BASE_URL;

  const handleDeleteMessageForMe = async (messageId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/chat/message/deleteForMe/${messageId}`,
        {
          userId,
        }
      );
      return response.data;
    } catch (err) {
      setError(err);
      console.error("Error deleting message:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessageForEveryone = async (messageId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/chat/message/deleteForEveryone/${messageId}`,
        {
          userId,
        }
      );
      return response.data;
    } catch (err) {
      setError(err);
      console.error("Error deleting message:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleDeleteMessageForEveryone,
    handleDeleteMessageForMe,
    loading,
    error,
  };
};
export default useDelete;
