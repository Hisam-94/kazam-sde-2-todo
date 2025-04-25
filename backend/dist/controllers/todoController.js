"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsCompleted = exports.deleteTodo = exports.updateTodo = exports.getTodoById = exports.getAllTodos = exports.createTodo = void 0;
const todoService_1 = __importDefault(require("../services/todoService"));
/**
 * @desc    Create a new todo
 * @route   POST /api/todos
 * @access  Private
 */
const createTodo = async (req, res) => {
    var _a;
    try {
        const { title, description, dueDate } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }
        const todo = await todoService_1.default.createTodo({
            title,
            description,
            dueDate: new Date(dueDate),
            userId,
        });
        res.status(201).json({
            success: true,
            data: todo,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to create todo",
        });
    }
};
exports.createTodo = createTodo;
/**
 * @desc    Get all todos
 * @route   GET /api/todos
 * @access  Private
 */
const getAllTodos = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }
        // Get query parameters
        const status = req.query.status;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const result = await todoService_1.default.getAllTodos(userId, status, page, limit);
        res.status(200).json({
            success: true,
            data: {
                todos: result.todos,
                pagination: {
                    total: result.total,
                    totalPages: result.totalPages,
                    currentPage: page,
                    limit,
                },
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get todos",
        });
    }
};
exports.getAllTodos = getAllTodos;
/**
 * @desc    Get todo by ID
 * @route   GET /api/todos/:id
 * @access  Private
 */
const getTodoById = async (req, res) => {
    var _a;
    try {
        const todoId = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }
        const todo = await todoService_1.default.getTodoById(todoId, userId);
        res.status(200).json({
            success: true,
            data: todo,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || "Todo not found",
        });
    }
};
exports.getTodoById = getTodoById;
/**
 * @desc    Update todo
 * @route   PUT /api/todos/:id
 * @access  Private
 */
const updateTodo = async (req, res) => {
    var _a;
    try {
        const todoId = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { title, description, dueDate, status } = req.body;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }
        const updateData = {};
        if (title !== undefined)
            updateData.title = title;
        if (description !== undefined)
            updateData.description = description;
        if (dueDate !== undefined)
            updateData.dueDate = new Date(dueDate);
        if (status !== undefined)
            updateData.status = status;
        const todo = await todoService_1.default.updateTodo(todoId, userId, updateData);
        res.status(200).json({
            success: true,
            data: todo,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || "Failed to update todo",
        });
    }
};
exports.updateTodo = updateTodo;
/**
 * @desc    Delete todo
 * @route   DELETE /api/todos/:id
 * @access  Private
 */
const deleteTodo = async (req, res) => {
    var _a;
    try {
        const todoId = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }
        await todoService_1.default.deleteTodo(todoId, userId);
        res.status(200).json({
            success: true,
            message: "Todo deleted successfully",
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || "Failed to delete todo",
        });
    }
};
exports.deleteTodo = deleteTodo;
/**
 * @desc    Mark todo as completed
 * @route   PATCH /api/todos/:id/complete
 * @access  Private
 */
const markAsCompleted = async (req, res) => {
    var _a;
    try {
        const todoId = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }
        const todo = await todoService_1.default.markAsCompleted(todoId, userId);
        res.status(200).json({
            success: true,
            data: todo,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || "Failed to update todo status",
        });
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
