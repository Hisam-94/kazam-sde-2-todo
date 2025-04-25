"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config"));
const Todo_1 = __importDefault(require("../models/Todo"));
function listTodos() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to MongoDB
            console.log("Connecting to MongoDB...");
            console.log("URI:", config_1.default.mongodbUri);
            yield mongoose_1.default.connect(config_1.default.mongodbUri);
            console.log("MongoDB connected successfully");
            // Find all todos
            const todos = yield Todo_1.default.find().lean();
            // Display the results
            console.log("Total todos found:", todos.length);
            console.log("Todos:");
            console.log(JSON.stringify(todos, null, 2));
        }
        catch (error) {
            console.error("Error:", error);
        }
        finally {
            // Close the connection
            yield mongoose_1.default.disconnect();
            console.log("MongoDB disconnected");
        }
    });
}
// Run the function
listTodos();
