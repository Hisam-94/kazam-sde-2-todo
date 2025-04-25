import { redisClient } from "../config/redis";
import Token from "../models/Token";

/**
 * Add a token to the blacklist
 * @param token JWT token to blacklist
 * @param userId User ID associated with the token
 * @param expiryDate When the token expires
 */
export const addToBlacklist = async (
  token: string,
  userId: string,
  expiryDate: Date
): Promise<boolean> => {
  try {
    // Use Redis if available
    if (redisClient.isReady) {
      console.log("Using Redis for token blacklisting");
      const ttl = Math.floor((expiryDate.getTime() - Date.now()) / 1000);
      if (ttl <= 0) return true; // Already expired

      await redisClient.setEx(`blacklist:${token}`, ttl, "true");
      return true;
    }

    // Fall back to MongoDB
    console.log("Using MongoDB for token blacklisting");
    await Token.create({
      token,
      user: userId,
      expiresAt: expiryDate,
    });
    return true;
  } catch (error) {
    console.error("Error blacklisting token:", error);
    return false;
  }
};

/**
 * Check if a token is blacklisted
 * @param token JWT token to check
 */
export const isBlacklisted = async (token: string): Promise<boolean> => {
  try {
    // Use Redis if available
    if (redisClient.isReady) {
      const isBlacklisted = await redisClient.get(`blacklist:${token}`);
      return !!isBlacklisted;
    }

    // Fall back to MongoDB
    const blacklistedToken = await Token.findOne({ token });
    return !!blacklistedToken;
  } catch (error) {
    console.error("Error checking blacklisted token:", error);
    return false;
  }
};

export default {
  addToBlacklist,
  isBlacklisted,
};
