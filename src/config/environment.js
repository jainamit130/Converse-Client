const ENVIRONMENT = {
  development: {
    BASE_URL: "http://localhost:8080",
  },
  production: {
    BASE_URL: "",
  },
};

const currentEnv = process.env.NODE_ENV || "development";
const config = ENVIRONMENT[currentEnv];

export default config;
