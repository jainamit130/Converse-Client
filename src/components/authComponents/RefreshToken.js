import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import config from "../../config/environment";

const RefreshToken = () => {
  const navigate = useNavigate();
  const { updateUserId } = useUser();

  useEffect(() => {
    const handleRefreshToken = async () => {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        const payload = {
          refreshToken: refreshToken,
          username: localStorage.getItem("username"),
        };

        try {
          const response = await fetch(
            config.USER_BASE_URL + "/converse/auth/refreshToken",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to refresh token");
          }

          const data = await response.json();
          const { authenticationToken, refreshToken: newRefreshToken } = data;

          localStorage.setItem("authenticationToken", authenticationToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          updateUserId(localStorage.getItem("userId"));
        } catch (error) {
          console.error("Token refresh failed", error);
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    };

    handleRefreshToken();
  }, [navigate, updateUserId]);

  return <div>Refreshing token...</div>;
};

export default RefreshToken;
