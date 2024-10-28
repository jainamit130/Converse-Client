const ENVIRONMENT = {
  development: {
    USER_BASE_URL: "http://localhost:8081",
    CHAT_BASE_URL: "http://localhost:8080",
    // USER_BASE_URL: "https://converse-803802355670.asia-south1.run.app",
    // CHAT_BASE_URL: "https://converse-common-803802355670.asia-south1.run.app",
  },
  production: {
    USER_BASE_URL: "https://converse-803802355670.asia-south1.run.app",
    CHAT_BASE_URL: "https://converse-common-803802355670.asia-south1.run.app",
  },
};

const currentEnv = process.env.NODE_ENV || "development";
const config = ENVIRONMENT[currentEnv];

export default config;
