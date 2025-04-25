"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
const config_1 = __importDefault(require("./config"));
const database_1 = __importDefault(require("./config/database"));
const redis_1 = require("./config/redis");
// Import routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const todoRoutes_1 = __importDefault(require("./routes/todoRoutes"));
// Initialize Express app
const app = (0, express_1.default)();
// Connect to MongoDB
(0, database_1.default)();
// Connect to Redis (optional)
(0, redis_1.connectRedis)().catch(() => {
    console.log("Redis connection failed, continuing without Redis");
});
// Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: config_1.default.cors.origin,
    credentials: true,
}));
// Logging
if (config_1.default.nodeEnv === "development") {
    app.use((0, morgan_1.default)("dev"));
}
// Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/todos", todoRoutes_1.default);
// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});
// Error handling middlewares
app.use(errorMiddleware_1.notFound);
app.use(errorMiddleware_1.errorHandler);
// Start server
const PORT = config_1.default.port;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${config_1.default.nodeEnv} mode`);
});
