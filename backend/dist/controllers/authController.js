"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.logout = exports.login = exports.register = void 0;
const authService_1 = __importDefault(require("../services/authService"));
/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService_1.default.register({ email, password });
        // Set refresh token in HTTP-only cookie
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(201).json({
            success: true,
            data: {
                user: result.user,
                accessToken: result.accessToken,
            },
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Registration failed",
        });
    }
};
exports.register = register;
/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService_1.default.login(email, password);
        // Set refresh token in HTTP-only cookie
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({
            success: true,
            data: {
                user: result.user,
                accessToken: result.accessToken,
            },
        });
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: error.message || "Authentication failed",
        });
    }
};
exports.login = login;
/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res) => {
    var _a, _b;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (!token || !userId) {
            res.status(400).json({
                success: false,
                message: "Token is required for logout",
            });
            return;
        }
        await authService_1.default.logout(token, userId);
        // Clear refresh token cookie
        res.clearCookie("refreshToken");
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Logout failed",
        });
    }
};
exports.logout = logout;
/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
const refreshToken = async (req, res) => {
    try {
        // Get refresh token from cookie or body
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
        if (!refreshToken) {
            res.status(401).json({
                success: false,
                message: "Refresh token is required",
            });
            return;
        }
        const result = await authService_1.default.refreshToken(refreshToken);
        // Set new refresh token in cookie if we want to rotate refresh tokens
        // For now, we're just returning the new access token
        res.status(200).json({
            success: true,
            data: {
                accessToken: result.accessToken,
            },
        });
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: error.message || "Token refresh failed",
        });
    }
};
exports.refreshToken = refreshToken;
exports.default = {
    register: exports.register,
    login: exports.login,
    logout: exports.logout,
    refreshToken: exports.refreshToken,
};
