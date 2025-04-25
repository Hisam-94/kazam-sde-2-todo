"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = __importDefault(require("./index"));
const connectDB = async () => {
    try {
        if (!index_1.default.mongodbUri) {
            throw new Error("MongoDB URI is not defined in environment variables");
        }
        await mongoose_1.default.connect(index_1.default.mongodbUri);
        console.log("MongoDB connected successfully");
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
        // Exit process with failure
        process.exit(1);
    }
};
exports.default = connectDB;
