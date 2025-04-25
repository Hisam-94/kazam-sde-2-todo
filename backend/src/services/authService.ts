import User, { IUser } from "../models/User";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken";
import jwt from "jsonwebtoken";
import config from "../config";
import tokenBlacklist from "../utils/tokenBlacklist";

interface RegisterParams {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
}

/**
 * Register a new user
 */
export const register = async (
  params: RegisterParams
): Promise<AuthResponse> => {
  const { email, password } = params;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  // Create new user
  const user = (await User.create({
    email,
    password,
  })) as IUser;

  // Generate tokens
  const accessToken = generateAccessToken({ id: user._id.toString() });
  const refreshToken = generateRefreshToken({ id: user._id.toString() });

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * Login user
 */
export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  // Find user
  const user = (await User.findOne({ email })) as IUser | null;
  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // Generate tokens
  const accessToken = generateAccessToken({ id: user._id.toString() });
  const refreshToken = generateRefreshToken({ id: user._id.toString() });

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * Logout user - blacklist token
 */
export const logout = async (
  token: string,
  userId: string
): Promise<boolean> => {
  try {
    // Decode token to get expiry
    const decoded = jwt.decode(token) as { exp: number };
    const expiryDate = new Date(decoded.exp * 1000);

    // Add token to blacklist
    return await tokenBlacklist.addToBlacklist(token, userId, expiryDate);
  } catch (error) {
    console.error("Error blacklisting token:", error);
    throw new Error("Failed to logout");
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (
  token: string
): Promise<{ accessToken: string }> => {
  try {
    // Check if refresh token secret is defined
    if (!config.jwt.refreshToken.secret) {
      throw new Error("Refresh token secret is not defined");
    }

    // Verify refresh token
    const decoded = jwt.verify(token, config.jwt.refreshToken.secret) as {
      id: string;
    };

    // Check if user exists
    const user = (await User.findById(decoded.id)) as IUser | null;
    if (!user) {
      throw new Error("User not found");
    }

    // Generate new access token
    const accessToken = generateAccessToken({ id: user._id.toString() });

    return { accessToken };
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

export default {
  register,
  login,
  logout,
  refreshToken,
};
