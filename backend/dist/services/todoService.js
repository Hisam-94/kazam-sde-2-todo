"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsCompleted = exports.deleteTodo = exports.updateTodo = exports.getTodoById = exports.getAllTodos = exports.createTodo = void 0;
const Todo_1 = __importStar(require("../models/Todo"));
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Create a new todo
 */
const createTodo = async (params) => {
    const { title, description, dueDate, userId } = params;
    try {
        const todo = await Todo_1.default.create({
            title,
            description,
            dueDate,
            owner: userId,
        });
        return todo;
    }
    catch (error) {
        console.error("Error creating todo:", error);
        throw new Error("Failed to create todo");
    }
};
exports.createTodo = createTodo;
/**
 * Get all todos for a user
 */
const getAllTodos = async (userId, status, page = 1, limit = 10) => {
    try {
        const query = {
            owner: new mongoose_1.default.Types.ObjectId(userId),
        };
        // Add status filter if provided
        if (status) {
            query.status = status;
        }
        // Calculate pagination
        const skip = (page - 1) * limit;
        // Get total count for pagination
        const total = await Todo_1.default.countDocuments(query);
        const totalPages = Math.ceil(total / limit);
        // Get todos with pagination
        const todos = await Todo_1.default.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        return {
            todos,
            total,
            totalPages,
        };
    }
    catch (error) {
        console.error("Error getting todos:", error);
        throw new Error("Failed to get todos");
    }
};
exports.getAllTodos = getAllTodos;
/**
 * Get a todo by ID
 */
const getTodoById = async (todoId, userId) => {
    try {
        const todo = await Todo_1.default.findOne({
            _id: todoId,
            owner: userId,
        });
        if (!todo) {
            throw new Error("Todo not found");
        }
        return todo;
    }
    catch (error) {
        console.error("Error getting todo:", error);
        throw new Error("Failed to get todo");
    }
};
exports.getTodoById = getTodoById;
/**
 * Update a todo
 */
const updateTodo = async (todoId, userId, updateData) => {
    try {
        const todo = await Todo_1.default.findOneAndUpdate({
            _id: todoId,
            owner: userId,
        }, updateData, { new: true });
        if (!todo) {
            throw new Error("Todo not found");
        }
        return todo;
    }
    catch (error) {
        console.error("Error updating todo:", error);
        throw new Error("Failed to update todo");
    }
};
exports.updateTodo = updateTodo;
/**
 * Delete a todo
 */
const deleteTodo = async (todoId, userId) => {
    try {
        const result = await Todo_1.default.deleteOne({
            _id: todoId,
            owner: userId,
        });
        if (result.deletedCount === 0) {
            throw new Error("Todo not found");
        }
        return true;
    }
    catch (error) {
        console.error("Error deleting todo:", error);
        throw new Error("Failed to delete todo");
    }
};
exports.deleteTodo = deleteTodo;
/**
 * Mark todo as completed
 */
const markAsCompleted = async (todoId, userId) => {
    try {
        const todo = await Todo_1.default.findOneAndUpdate({
            _id: todoId,
            owner: userId,
        }, { status: Todo_1.TodoStatus.COMPLETED }, { new: true });
        if (!todo) {
            throw new Error("Todo not found");
        }
        return todo;
    }
    catch (error) {
        console.error("Error marking todo as completed:", error);
        throw new Error("Failed to update todo status");
    }
};
exports.markAsCompleted = markAsCompleted;
exports.default = {
    createTodo: exports.createTodo,
    getAllTodos: exports.getAllTodos,
    getTodoById: exports.getTodoById,
    updateTodo: exports.updateTodo,
    deleteTodo: exports.deleteTodo,
    markAsCompleted: exports.markAsCompleted,
};
