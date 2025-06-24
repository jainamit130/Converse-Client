import React, { useState } from "react";
import config from "../../config/environment";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/LoginBackground.png";
import chatBackgroundImage from "../../assets/ChatBackground.png";
import loaderGif from "../../assets/loadinggif.gif";

const LoginSignUpPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = config.USER_BASE_URL + "/converse/auth";

  const togglePage = () => {
    setIsLoginPage(!isLoginPage);
  };

  const handle = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const url = isLoginPage ? `${BASE_URL}/login` : `${BASE_URL}/signup`;
    const payload = { username, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 403)
          setMessage("Incorrect username or password.");
        setIsLoading(false);
        return;
      }

      if (!isLoginPage) {
        setMessage("Signup successful! Please login.");
        setIsLoading(false);
      } else {
        const data = await response.json();
        const { userId, username, authenticationToken, refreshToken } = data;
        localStorage.setItem("userId", userId);
        localStorage.setItem("username", username);
        localStorage.setItem("authenticationToken", authenticationToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("active", true);
        navigate("/chat-rooms");
      }
    } catch (err) {
      console.error(err);
      setMessage("Incorrect username or password.");
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <div style={styles.loaderContainer}>
      <img src={loaderGif} style={styles.loaderGif} alt="Loading..." />
    </div>
  ) : (
    <div style={styles.container}>
      <div style={styles.dimmer}></div>

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

const styles = {
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "transparent",
  },
  loaderGif: {
    width: "100%",
    height: "100%",
  },
  container: {
    display: "flex",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
  },
  dimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(47, 49, 139, 0.2)",
    zIndex: 1,
  },
  loginBox: {
    width: "300px",
    padding: "40px",
    zIndex: 2,
    backgroundImage: `url(${chatBackgroundImage})`,
    borderRadius: "10px",
    borderColor: "black",
    boxShadow: "0 4px 8px rgba(0, 1, 87, 0.1)",
    textAlign: "center",
    border: "2px solid rgba(0, 1, 87,0.6)",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
    fontWeight: "bold",
    color: "#333",
  },
  inputGroup: {
    marginBottom: "20px",
    textAlign: "left",
  },
  label: {
    display: "block",
    fontSize: "15px",
    fontWeight: "450",
    marginBottom: "5px",
    color: "#555",
  },
  input: {
    width: "93%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    outline: "none",
    marginBottom: "10px",
  },
  button: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  switchText: {
    fontSize: "15px",
    marginTop: "20px",
    color: "#555",
  },
  link: {
    fontSize: "15px",
    color: "#4CAF50",
    fontWeight: "500",
    background: "none",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default LoginSignUpPage;
