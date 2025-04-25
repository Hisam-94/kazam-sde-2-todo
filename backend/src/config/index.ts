import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri: process.env.MONGO_URI,
  jwt: {
    accessToken: {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    },
    refreshToken: {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    },
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },
};

export default config;
