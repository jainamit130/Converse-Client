import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import useRedis from "../../hooks/useRedis";
import { useChatRoom } from "../../context/ChatRoomContext";
import { usePageActivity } from "../../context/PageActivityContext";
import { useWebSocket } from "../../context/WebSocketContext";

const LoginSignUpPage = () => {
  const {
    updateUserId = () => {},
    setActiveChatRoomId = () => {},
    resetUser,
  } = useUser() || {};

  const { resetChatRoomContext } = useChatRoom();
  const { resetWebSocketContext } = useWebSocket();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { saveUserToRedis } = useRedis();
  const [isLoginPage, setIsLoginPage] = useState(true);
  const navigate = useNavigate();

  const togglePage = () => {
    setIsLoginPage(!isLoginPage);
  };

  const handle = async (e) => {
    e.preventDefault();

    // const url = isLoginPage
    //   ? "http://localhost:8081/converse/auth/login"
    //   : "http://localhost:8081/converse/auth/signup";

    const url = isLoginPage
      ? "https://converse-803802355670.asia-south1.run.app/converse/auth/login"
      : "https://converse-803802355670.asia-south1.run.app/converse/auth/signup";

    const payload = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      if (!isLoginPage) {
        const text = await response.text();
        setMessage("Signup successful! Please login.");
      } else {
        const data = await response.json();
        const { userId, username, authenticationToken, refreshToken } = data;

        resetWebSocketContext();
        resetChatRoomContext();
        if (JSON.stringify(userId) !== localStorage.getItem("userId")) {
          localStorage.setItem("userId", userId);
          localStorage.setItem("username", username);
          localStorage.setItem("authenticationToken", authenticationToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("isLogin", true);
          setActiveChatRoomId(null);
          updateUserId(userId);
        }
        saveUserToRedis(userId);
        navigate("/chat-rooms");
        window.location.reload();
      }
    } catch (error) {
      console.error("There was an error!", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h2 style={styles.title}>{isLoginPage ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handle}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.button}>
            {isLoginPage ? "Login" : "Sign Up"}
          </button>
        </form>
        {message && <p>{message}</p>}
        <p style={styles.switchText}>
          {isLoginPage ? "Don't have an account?" : "Already have an account?"}{" "}
          <button style={styles.link} onClick={togglePage}>
            {isLoginPage ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

const styles = {};

export default LoginSignUpPage;
