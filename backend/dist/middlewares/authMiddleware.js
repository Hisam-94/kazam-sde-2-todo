"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const tokenBlacklist_1 = __importDefault(require("../utils/tokenBlacklist"));
const protect = async (req, res, next) => {
    var _a;
    try {
        // Get token from header
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Not authorized, no token provided",
            });
            return;
        }
        try {
            // Check if token is blacklisted
            const isBlacklisted = await tokenBlacklist_1.default.isBlacklisted(token);
            if (isBlacklisted) {
                res.status(401).json({
                    success: false,
                    message: "Not authorized, token revoked",
                });
                return;
            }
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.accessToken.secret);
            // Add user ID to request
            req.user = {
                id: decoded.id,
            };
            next();
        }
        catch (error) {
            res.status(401).json({
                success: false,
                message: "Not authorized, token invalid",
            });
            return;
        }
    }
    catch (error) {
        console.error("Auth middleware error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
        return;
    }
};
exports.protect = protect;
exports.default = exports.protect;
