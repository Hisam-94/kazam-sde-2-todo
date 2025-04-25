"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.logout = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = require("../utils/generateToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const tokenBlacklist_1 = __importDefault(require("../utils/tokenBlacklist"));
/**
 * Register a new user
 */
const register = async (params) => {
    const { email, password } = params;
    // Check if user already exists
    const existingUser = await User_1.default.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists");
    }
    // Create new user
    const user = (await User_1.default.create({
        email,
        password,
    }));
    // Generate tokens
    const accessToken = (0, generateToken_1.generateAccessToken)({ id: user._id.toString() });
    const refreshToken = (0, generateToken_1.generateRefreshToken)({ id: user._id.toString() });
    return {
        user: {
            id: user._id.toString(),
            email: user.email,
        },
        accessToken,
        refreshToken,
    };
};
exports.register = register;
/**
 * Login user
 */
const login = async (email, password) => {
    // Find user
    const user = (await User_1.default.findOne({ email }));
    if (!user) {
        throw new Error("Invalid credentials");
    }
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    // Generate tokens
    const accessToken = (0, generateToken_1.generateAccessToken)({ id: user._id.toString() });
    const refreshToken = (0, generateToken_1.generateRefreshToken)({ id: user._id.toString() });
    return {
        user: {
            id: user._id.toString(),
            email: user.email,
        },
        accessToken,
        refreshToken,
    };
};
exports.login = login;
/**
 * Logout user - blacklist token
 */
const logout = async (token, userId) => {
    try {
        // Decode token to get expiry
        const decoded = jsonwebtoken_1.default.decode(token);
        const expiryDate = new Date(decoded.exp * 1000);
        // Add token to blacklist
        return await tokenBlacklist_1.default.addToBlacklist(token, userId, expiryDate);
    }
    catch (error) {
        console.error("Error blacklisting token:", error);
        throw new Error("Failed to logout");
    }
};
exports.logout = logout;
/**
 * Refresh access token
 */
const refreshToken = async (token) => {
    try {
        // Check if refresh token secret is defined
        if (!config_1.default.jwt.refreshToken.secret) {
            throw new Error("Refresh token secret is not defined");
        }
        // Verify refresh token
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.refreshToken.secret);
        // Check if user exists
        const user = (await User_1.default.findById(decoded.id));
        if (!user) {
            throw new Error("User not found");
        }
        // Generate new access token
        const accessToken = (0, generateToken_1.generateAccessToken)({ id: user._id.toString() });
        return { accessToken };
    }
    catch (error) {
        throw new Error("Invalid refresh token");
    }
};
exports.refreshToken = refreshToken;
exports.default = {
    register: exports.register,
    login: exports.login,
    logout: exports.logout,
    refreshToken: exports.refreshToken,
};
