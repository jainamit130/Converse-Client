import { useState, useEffect } from "react";
import config from "../config/environment";

const useGetOnlineUsers = (chatRoomId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const BASE_URL = config.CHAT_BASE_URL;

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${BASE_URL}/get/users/online/${chatRoomId}`,
          {
            method: "GET",
          }
        );

        if (response.ok) {
        } else {
          throw new Error("Failed to fetch online users");
        }
      } catch (err) {
        setError(err);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (chatRoomId) {
      fetchOnlineUsers();
    }
  }, [chatRoomId, BASE_URL]);

  return {
    loading,
    error,
    onlineUsers,
  };
};

export default useGetOnlineUsers;
