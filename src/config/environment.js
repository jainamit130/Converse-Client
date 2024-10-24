const ENVIRONMENT = {
  development: {
    // BASE_URL: "http://localhost:8080",
    BASE_URL: "https://converse-common-803802355670.asia-south1.run.app",
  },
  production: {
    BASE_URL: "",
  },
};

const currentEnv = process.env.NODE_ENV || "development";
const config = ENVIRONMENT[currentEnv];

export default config;
