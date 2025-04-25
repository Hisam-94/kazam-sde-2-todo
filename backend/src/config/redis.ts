import { createClient, RedisClientType } from "redis";
import config from "./index";

// Create Redis client with proper typing
let redisClient: RedisClientType;

try {
  // Use environment variables for Redis configuration
  redisClient = createClient({
    username: process.env.REDIS_USERNAME || undefined,
    password: process.env.REDIS_PASSWORD || undefined,
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
        ? parseInt(process.env.REDIS_PORT)
        : undefined,
      reconnectStrategy: (retries) => {
        // Maximum retry delay is 10 seconds
        return Math.min(retries * 100, 10000);
      },
    },
  });

  // Add listeners for better error handling
  redisClient.on("error", (err) => {
    console.error("Redis Client Error:", err);
  });

  redisClient.on("reconnecting", () => {
    console.log("Redis client trying to reconnect...");
  });

  redisClient.on("connect", () => {
    console.log("Redis client connected");
  });
} catch (error) {
  console.error("Error creating Redis client:", error);
  // Create a dummy client
  redisClient = createClient() as RedisClientType;
}

const connectRedis = async (): Promise<void> => {
  try {
    if (!redisClient) {
      throw new Error("Redis client not initialized");
    }

    // Only attempt connection if Redis host is provided
    if (!process.env.REDIS_HOST) {
      console.log(
        "No Redis host specified in environment variables. Skipping Redis connection."
      );
      return;
    }

    await redisClient.connect();
    console.log("Redis connected successfully");

    // Test connection by setting a key
    await redisClient.set("test_connection", "success");
    const testValue = await redisClient.get("test_connection");
    console.log(`Redis test: ${testValue}`);
  } catch (error) {
    console.error("Redis connection error:", error);
    // Don't exit process, Redis is optional
    console.log("Continuing without Redis...");
  }
};

export { redisClient, connectRedis };
