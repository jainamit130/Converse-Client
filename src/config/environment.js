const ENVIRONMENT = {
  development: {
    USER_BASE_URL: "http://localhost:8081",
    CHAT_BASE_URL: "http://localhost:8080",
    CHAT_SUBBASE_URL: "/converse/chat",
    USER_SUBBASE_URL: "/converse/user",
  },
  production: {
    USER_BASE_URL: "",
    CHAT_BASE_URL: "",
    CHAT_SUBBASE_URL: "/converse/chat",
    USER_SUBBASE_URL: "/converse/user",
  },
};

const currentEnv = process.env.NODE_ENV || "development";
const config = ENVIRONMENT[currentEnv];

export default config;
