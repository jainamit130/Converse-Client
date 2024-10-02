import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const LogoutPage = () => {
  const navigate = useNavigate();
  const { updateUserId, setActiveChatRoomId, setActiveChatRoomName } =
    useUser();

  useEffect(() => {
    const handleLogout = async () => {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        const payload = {
          refreshToken: refreshToken,
          username: localStorage.getItem("username"),
        };

        try {
          const response = await fetch(
            "http://localhost:8081/converse/auth/logout",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to logout");
          }

          localStorage.clear();
          updateUserId(null);
          setActiveChatRoomId(null);
          setActiveChatRoomName(null);

          navigate("/login");
        } catch (error) {
          console.error("Logout failed", error);
        }
      }
    };

    handleLogout();
  }, [navigate, updateUserId, setActiveChatRoomId, setActiveChatRoomName]);

  return <div>Logging out...</div>;
};

export default LogoutPage;
