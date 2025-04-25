import { Request, Response } from "express";
import authService from "../services/authService";

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const result = await authService.register({ email, password });

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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

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
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || "Authentication failed",
    });
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const userId = req.user?.id;

    if (!token || !userId) {
      res.status(400).json({
        success: false,
        message: "Token is required for logout",
      });
      return;
    }

    await authService.logout(token, userId);

    // Clear refresh token cookie
    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Logout failed",
    });
  }
};

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
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

    const result = await authService.refreshToken(refreshToken);

    // Set new refresh token in cookie if we want to rotate refresh tokens
    // For now, we're just returning the new access token

    res.status(200).json({
      success: true,
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || "Token refresh failed",
    });
  }
};

export default {
  register,
  login,
  logout,
  refreshToken,
};
