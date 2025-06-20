const ENVIRONMENT = {
  development: {
    USER_BASE_URL: "http://localhost:8081",
    CHAT_BASE_URL: "http://localhost:8080",
    CHAT_SUBBASE_URL: "/converse/chat",
    USER_SUBBASE_URL: "/converse/users",
  },
  production: {
    USER_BASE_URL: "https://user-dot-converse-refactor.el.r.appspot.com",
    CHAT_BASE_URL: "https://chat-dot-converse-refactor.el.r.appspot.com",
    CHAT_SUBBASE_URL: "/converse/chat",
    USER_SUBBASE_URL: "/converse/users",
  },
};

const currentEnv = process.env.NODE_ENV || "development";
const config = ENVIRONMENT[currentEnv];

export default config;
