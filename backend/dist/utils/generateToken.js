"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
/**
 * Generate access token
 */
const generateAccessToken = (payload) => {
    // Check if access token secret is defined
    if (!config_1.default.jwt.accessToken.secret) {
        throw new Error("Access token secret is not defined in environment variables");
    }
    const options = {};
    // Set expiry based on configuration
    if (config_1.default.jwt.accessToken.expiresIn) {
        options.expiresIn = config_1.default.jwt.accessToken.expiresIn;
    }
    return jsonwebtoken_1.default.sign(payload, config_1.default.jwt.accessToken.secret, options);
};
exports.generateAccessToken = generateAccessToken;
/**
 * Generate refresh token
 */
const generateRefreshToken = (payload) => {
    // Check if refresh token secret is defined
    if (!config_1.default.jwt.refreshToken.secret) {
        throw new Error("Refresh token secret is not defined in environment variables");
    }
    const options = {};
    // Set expiry based on configuration
    if (config_1.default.jwt.refreshToken.expiresIn) {
        options.expiresIn = config_1.default.jwt.refreshToken.expiresIn;
    }
    return jsonwebtoken_1.default.sign(payload, config_1.default.jwt.refreshToken.secret, options);
};
exports.generateRefreshToken = generateRefreshToken;
exports.default = { generateAccessToken: exports.generateAccessToken, generateRefreshToken: exports.generateRefreshToken };
