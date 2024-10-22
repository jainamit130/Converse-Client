import { useState } from "react";
import config from "../config/environment";

const useRedis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const BASE_URL = config.BASE_URL;

  const saveUserToRedis = async (key, optional) => {
    if (key === null) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let url = `${BASE_URL}/user/save/lastSeen/${key}`;
      if (optional) {
        url += `?prevChatRoomId=${optional}`;
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

  // const getLastSeen = async (key) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await fetch(`${BASE_URL}/user/get/lastSeen/${key}`, {
  //       method: "GET",
  //     });
  //     const data = await response.json();
  //     return data;
  //   } catch (err) {
  //     setError(err);
  //     console.error("Error fetching data:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const removeUserFromRedis = async (key, optional) => {
    setLoading(true);
    setError(null);
    try {
      let url = `${BASE_URL}/user/update/lastSeen/${key}`;
      if (optional) {
        url += `?prevChatRoomId=${optional}`;
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

      const data = await response.json();
      const onlineUsers = new Set(data);
      return onlineUsers;
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
    saveUserToRedis,
    // getLastSeen,
    removeUserFromRedis,
    markChatRoomActive,
    markChatRoomInactive,
    loading,
    error,
  };
};

export default useRedis;
