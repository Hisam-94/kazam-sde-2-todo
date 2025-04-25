import jwt, { SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import config from "../config";

interface TokenPayload {
  id: string;
}

/**
 * Generate access token
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  // Check if access token secret is defined
  if (!config.jwt.accessToken.secret) {
    throw new Error(
      "Access token secret is not defined in environment variables"
    );
  }

  const options: SignOptions = {};

  // Set expiry based on configuration
  if (config.jwt.accessToken.expiresIn) {
    options.expiresIn = config.jwt.accessToken.expiresIn as StringValue;
  }

  return jwt.sign(payload, config.jwt.accessToken.secret, options);
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  // Check if refresh token secret is defined
  if (!config.jwt.refreshToken.secret) {
    throw new Error(
      "Refresh token secret is not defined in environment variables"
    );
  }

  const options: SignOptions = {};

  // Set expiry based on configuration
  if (config.jwt.refreshToken.expiresIn) {
    options.expiresIn = config.jwt.refreshToken.expiresIn as StringValue;
  }

  return jwt.sign(payload, config.jwt.refreshToken.secret, options);
};

export default { generateAccessToken, generateRefreshToken };
