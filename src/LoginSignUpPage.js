import React, { useState } from "react";

const LoginSignUpPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

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
      setMessage(isLogin ? "Login successful!" : "Signup successful!");
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
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
  },
  loginBox: {
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
    width: "300px",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
  },
  inputGroup: {
    marginBottom: "15px",
    textAlign: "left",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "14px",
    color: "#333333",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #cccccc",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#4caf50",
    color: "#ffffff",
    fontSize: "16px",
    cursor: "pointer",
  },
  switchText: {
    marginTop: "10px",
  },
  link: {
    background: "none",
    border: "none",
    color: "#4caf50",
    textDecoration: "underline",
    cursor: "pointer",
  },
};

export default LoginSignUpPage;
