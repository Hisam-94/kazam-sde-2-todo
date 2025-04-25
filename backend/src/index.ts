import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middlewares/errorMiddleware";
import config from "./config";
import connectDB from "./config/database";
import { connectRedis } from "./config/redis";

// Import routes
import authRoutes from "./routes/authRoutes";
import todoRoutes from "./routes/todoRoutes";

// Initialize Express app
const app: Express = express();

// Connect to MongoDB
connectDB();

// Connect to Redis (optional)
connectRedis().catch(() => {
  console.log("Redis connection failed, continuing without Redis");
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);

// Logging
if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
});
