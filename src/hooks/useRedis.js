import { useState } from "react";
import config from "../config/environment";
import { useChatRoom } from "../context/ChatRoomContext";
import { useAppState } from "../context/AppStateContext";

const useRedis = () => {
  const [loading, setLoading] = useState(false);
  const { lastChatRoomId } = useAppState();
  const [error, setError] = useState(null);
  const BASE_URL = config.BASE_URL;

  const saveLastSeen = async (key, value) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${BASE_URL}/user/save/lastSeen/${key}?timestamp=${value}`;
      if (lastChatRoomId) {
        url += `?prevChatRoomId=${lastChatRoomId}`;
      }
      const response = await fetch(url, {
        method: "POST",
      });
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
      const response = await fetch(`${BASE_URL}/user/get/lastSeen/${key}`, {
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
      const url = `${BASE_URL}/user/update/lastSeen/${key}`;
      if (lastChatRoomId) {
        url += `?prevChatRoomId=${lastChatRoomId}`;
      }
      const response = await fetch(url, {
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

  const markChatRoomActive = async (chatRoomId, userId, prevChatRoomId) => {
    setLoading(true);
    setError(null);
    try {
      let url = `${BASE_URL}/user/save/activeChatRoom/${chatRoomId}/${userId}`;
      if (prevChatRoomId) {
        url += `?prevChatRoomId=${prevChatRoomId}`;
      }

      const response = await fetch(url, {
        method: "POST",
      });

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
        `${BASE_URL}/user/update/activeChatRoom/${chatRoomId}/${userId}`,
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
