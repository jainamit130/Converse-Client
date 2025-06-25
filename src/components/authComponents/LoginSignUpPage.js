import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config/environment";
import backgroundImage from "../../assets/LoginBackground.png";
import chatBackgroundImage from "../../assets/ChatBackground.png";
import loaderGif from "../../assets/loadinggif.gif";
import "./LoginSignUpPage.css";

const LoginSignUpPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const BASE_URL = `${config.USER_BASE_URL}/converse/auth`;

  const togglePage = () => setIsLogin((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const url = isLogin ? `${BASE_URL}/login` : `${BASE_URL}/signup`;
    const payload = { username, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 403) setMessage("Incorrect username or password.");
        setIsLoading(false);
        return;
      }

      if (!isLogin) {
        setMessage("Signup successful! Please login.");
        setIsLoading(false);
        return;
      }

      const { userId, authenticationToken, refreshToken } = await res.json();
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);
      localStorage.setItem("authenticationToken", authenticationToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("active", true);
      navigate("/chat-rooms");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className="loader-container"
        style={{ backgroundImage: `url(${chatBackgroundImage})` }}
      >
        <img className="loader-gif" src={loaderGif} alt="Loading…" />
      </div>
    );
  }

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="dimmer" />

      <div className="login-box">
        <h3>{isLogin ? "Login" : "Sign Up"}</h3>

        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>

        {message && <p className="status-msg">{message}</p>}

        <p className="switch-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button className="link" onClick={togglePage}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginSignUpPage;
