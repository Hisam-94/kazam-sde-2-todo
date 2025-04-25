import express from "express";
import authController from "../controllers/authController";
import validate from "../middlewares/validationMiddleware";
import {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
} from "../utils/validationSchemas";
import protect from "../middlewares/authMiddleware";

const router = express.Router();

// Register route
router.post("/register", validate(registerValidation), authController.register);

// Login route
router.post("/login", validate(loginValidation), authController.login);

// Logout route (protected)
router.post("/logout", protect, authController.logout);

// Refresh token route
router.post(
  "/refresh-token",
  validate(refreshTokenValidation),
  authController.refreshToken
);

export default router;
