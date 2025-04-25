"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodosValidation = exports.markAsCompletedValidation = exports.deleteTodoValidation = exports.getTodoByIdValidation = exports.updateTodoValidation = exports.createTodoValidation = exports.refreshTokenValidation = exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
const Todo_1 = require("../models/Todo");
// Auth validation
exports.registerValidation = [
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];
exports.loginValidation = [
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
];
// Make refreshToken validation empty since we'll handle it in the controller
exports.refreshTokenValidation = [
// Empty validation array - we'll handle this in the controller
];
// Todo validation
exports.createTodoValidation = [
    (0, express_validator_1.body)("title")
        .notEmpty()
        .withMessage("Title is required")
        .trim()
        .isLength({ max: 100 })
        .withMessage("Title cannot be more than 100 characters"),
    (0, express_validator_1.body)("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot be more than 500 characters"),
    (0, express_validator_1.body)("dueDate")
        .notEmpty()
        .withMessage("Due date is required")
        .isISO8601()
        .withMessage("Please provide a valid date"),
];
exports.updateTodoValidation = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Invalid todo ID"),
    (0, express_validator_1.body)("title")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Title cannot be more than 100 characters"),
    (0, express_validator_1.body)("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot be more than 500 characters"),
    (0, express_validator_1.body)("dueDate")
        .optional()
        .isISO8601()
        .withMessage("Please provide a valid date"),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(Object.values(Todo_1.TodoStatus))
        .withMessage("Invalid status value"),
];
exports.getTodoByIdValidation = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Invalid todo ID"),
];
exports.deleteTodoValidation = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Invalid todo ID"),
];
exports.markAsCompletedValidation = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Invalid todo ID"),
];
exports.getTodosValidation = [
    (0, express_validator_1.query)("status")
        .optional()
        .isIn(Object.values(Todo_1.TodoStatus))
        .withMessage("Invalid status value"),
    (0, express_validator_1.query)("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),
    (0, express_validator_1.query)("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100"),
];
