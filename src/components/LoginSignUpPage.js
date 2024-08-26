// src/components/LoginSignUpPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const LoginSignUpPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { updateUserId } = useUser();

  const togglePage = () => {
    setIsLogin(!isLogin);
  };

  const handle = async (e) => {
    e.preventDefault();

    const url = isLogin
      ? "http://localhost:8081/converse/auth/login"
      : "http://localhost:8081/converse/auth/signup";

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

      const data = await response.json();
      console.log(data);

      const { userId, username, authenticationToken, refreshToken } = data;

      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);
      localStorage.setItem("authenticationToken", authenticationToken);
      localStorage.setItem("refreshToken", refreshToken);

      if (isLogin) {
        updateUserId(data.userId); // Set user ID in context
        navigate(`/chat-rooms`);
      } else {
        setMessage("Signup successful! Please login.");
      }
    } catch (error) {
      console.error("There was an error!", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h2 style={styles.title}>{isLogin ? "Login" : "Sign Up"}</h2>
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
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        {message && <p>{message}</p>}
        <p style={styles.switchText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button style={styles.link} onClick={togglePage}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

const styles = {
  // Styles remain the same
};

export default LoginSignUpPage;
