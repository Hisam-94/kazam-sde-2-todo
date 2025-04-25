"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBlacklisted = exports.addToBlacklist = void 0;
const redis_1 = require("../config/redis");
const Token_1 = __importDefault(require("../models/Token"));
/**
 * Add a token to the blacklist
 * @param token JWT token to blacklist
 * @param userId User ID associated with the token
 * @param expiryDate When the token expires
 */
const addToBlacklist = async (token, userId, expiryDate) => {
    try {
        // Use Redis if available
        if (redis_1.redisClient.isReady) {
            console.log("Using Redis for token blacklisting");
            const ttl = Math.floor((expiryDate.getTime() - Date.now()) / 1000);
            if (ttl <= 0)
                return true; // Already expired
            await redis_1.redisClient.setEx(`blacklist:${token}`, ttl, "true");
            return true;
        }
        // Fall back to MongoDB
        console.log("Using MongoDB for token blacklisting");
        await Token_1.default.create({
            token,
            user: userId,
            expiresAt: expiryDate,
        });
        return true;
    }
    catch (error) {
        console.error("Error blacklisting token:", error);
        return false;
    }
};
exports.addToBlacklist = addToBlacklist;
/**
 * Check if a token is blacklisted
 * @param token JWT token to check
 */
const isBlacklisted = async (token) => {
    try {
        // Use Redis if available
        if (redis_1.redisClient.isReady) {
            const isBlacklisted = await redis_1.redisClient.get(`blacklist:${token}`);
            return !!isBlacklisted;
        }
        // Fall back to MongoDB
        const blacklistedToken = await Token_1.default.findOne({ token });
        return !!blacklistedToken;
    }
    catch (error) {
        console.error("Error checking blacklisted token:", error);
        return false;
    }
};
exports.isBlacklisted = isBlacklisted;
exports.default = {
    addToBlacklist: exports.addToBlacklist,
    isBlacklisted: exports.isBlacklisted,
};
