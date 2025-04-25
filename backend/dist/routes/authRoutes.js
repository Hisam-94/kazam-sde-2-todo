"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controllers/authController"));
const validationMiddleware_1 = __importDefault(require("../middlewares/validationMiddleware"));
const validationSchemas_1 = require("../utils/validationSchemas");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = express_1.default.Router();
// Register route
router.post("/register", (0, validationMiddleware_1.default)(validationSchemas_1.registerValidation), authController_1.default.register);
// Login route
router.post("/login", (0, validationMiddleware_1.default)(validationSchemas_1.loginValidation), authController_1.default.login);
// Logout route (protected)
router.post("/logout", authMiddleware_1.default, authController_1.default.logout);
// Refresh token route
router.post("/refresh-token", (0, validationMiddleware_1.default)(validationSchemas_1.refreshTokenValidation), authController_1.default.refreshToken);
exports.default = router;
