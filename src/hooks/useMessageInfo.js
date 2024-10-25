import { useState } from "react";
import config from "../config/environment";

export const useMessageInfo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const BASE_URL = config.CHAT_BASE_URL;

  const getMessageInfo = async (messageId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BASE_URL}/chat/message/info/${messageId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err);
      console.error("Error getting message info:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    getMessageInfo,
    loading,
    error,
  };
};

export default useMessageInfo;
