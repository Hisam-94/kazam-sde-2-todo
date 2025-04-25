import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import tokenBlacklist from "../utils/tokenBlacklist";

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Not authorized, no token provided",
      });
      return;
    }

    try {
      // Check if token is blacklisted
      const isBlacklisted = await tokenBlacklist.isBlacklisted(token);
      if (isBlacklisted) {
        res.status(401).json({
          success: false,
          message: "Not authorized, token revoked",
        });
        return;
      }

      // Verify token
      const decoded = jwt.verify(
        token,
        config.jwt.accessToken.secret as jwt.Secret
      ) as {
        id: string;
      };

      // Add user ID to request
      req.user = {
        id: decoded.id,
      };

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Not authorized, token invalid",
      });
      return;
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
    return;
  }
};

export default protect;
