import { useState } from "react";
import config from "../config/environment";
import { useUser } from "../context/UserContext";
import axios from "axios";

const useGetUserInfo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, userId } = useUser();
  const BASE_URL = config.CHAT_BASE_URL;

  const fetchUserInfo = async (userInfoId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/converse/users/getUser/${userInfoId}?loggedInUserId=${userId}`
      );
      return response.data;
    } catch (err) {
      setError(err);
      console.error("Error fetching user info:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchUserInfo,
    loading,
    error,
  };
};
export default useGetUserInfo;
