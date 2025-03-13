const ENVIRONMENT = {
  development: {
    USER_BASE_URL: "http://localhost:8081",
    CHAT_BASE_URL: "http://localhost:8080",
  },
  production: {
    USER_BASE_URL: "",
    CHAT_BASE_URL: "",
  },
};

const currentEnv = process.env.NODE_ENV || "development";
const config = ENVIRONMENT[currentEnv];

export default config;
