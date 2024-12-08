import { useState } from "react";
import axios from "axios";
import config from "../config/environment";
import { useUser } from "../context/UserContext";

const useCreateChat = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, userId } = useUser();
  const BASE_URL = config.CHAT_BASE_URL;

  const getUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/converse/users/getUsers`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err);
      console.error("Error getting users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (chatRoomId, selectedUserIds) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/chat/groups/add/${chatRoomId}`,
        {
          actionedBy: userId,
          memberIds: selectedUserIds,
        }
      );
      return response.data;
    } catch (err) {
      setError(err);
      console.error("Error adding members:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (
    groupName,
    selectedUserIds,
    chatRoomType,
    latestMessage
  ) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/chat/groups/create`, {
        groupName: groupName,
        members: selectedUserIds,
        chatRoomType: chatRoomType,
        createdById: userId,
        latestMessage: latestMessage,
      });
      return response.data;
    } catch (err) {
      setError(err);
      console.error("Error creating group:", err);
    } finally {
      setLoading(false);
    }
  };

  return { getUsers, handleCreateGroup, handleAddMember, loading, error };
};

export default useCreateChat;
