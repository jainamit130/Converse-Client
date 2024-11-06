import { useState } from "react";
import config from "../config/environment";
import { useUser } from "../context/UserContext";
import axios from "axios";

const useDelete = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, userId } = useUser();
  const BASE_URL = config.CHAT_BASE_URL;

  const handleLeaveChat = async (chatRoomId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/chat/groups/remove/${chatRoomId}`,
        { memberIds: [userId] },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (err) {
      setError(err);
      console.error("Error exiting chat:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async (chatRoomId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/chat/groups/delete/${chatRoomId}`,
        userId,
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );
      return response.data;
    } catch (err) {
      setError(err);
      console.error("Error deleting chat:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async (chatRoomId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/chat/groups/clearChat/${chatRoomId}`,
        userId,
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );
      return response.data;
    } catch (err) {
      setError(err);
      console.error("Error clearing chat:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessageForMe = async (messageId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/chat/message/deleteForMe/${messageId}`,
        userId,
        {
          headers: {
            "Content-Type": "text/plain",
          },
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
        userId,
        {
          headers: {
            "Content-Type": "text/plain",
          },
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
    handleClearChat,
    handleLeaveChat,
    handleDeleteChat,
    loading,
    error,
  };
};
export default useDelete;
