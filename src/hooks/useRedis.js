import { useState } from "react";

const BASE_URL = "http://localhost:8080/user";

const useRedis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveLastSeen = async (key, value) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BASE_URL}/save/lastSeen/${key}?timestamp=${value}`,
        {
          method: "POST",
        }
      );
      const data = await response.text();
      return data;
    } catch (err) {
      setError(err);
      console.error("Error saving data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getLastSeen = async (key) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/get/lastSeen/${key}`, {
        method: "GET",
      });
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateLastSeen = async (key) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/update/lastSeen/${key}`, {
        method: "POST",
      });
      const data = await response.text();
      return data;
    } catch (err) {
      setError(err);
      console.error("Error removing data:", err);
    } finally {
      setLoading(false);
    }
  };

  const markChatRoomActive = async (chatRoomId, userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BASE_URL}/save/activeChatRoom/${chatRoomId}/${userId}`,
        {
          method: "POST",
        }
      );
      const data = await response.text();
      return data;
    } catch (err) {
      setError(err);
      console.error("Error saving data:", err);
    } finally {
      setLoading(false);
    }
  };

  const markChatRoomInactive = async (chatRoomId, userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BASE_URL}/update/activeChatRoom/${chatRoomId}/${userId}`,
        {
          method: "POST",
        }
      );
      const data = await response.text();
      return data;
    } catch (err) {
      setError(err);
      console.error("Error removing data:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    saveLastSeen,
    getLastSeen,
    updateLastSeen,
    markChatRoomActive,
    markChatRoomInactive,
    loading,
    error,
  };
};

export default useRedis;
