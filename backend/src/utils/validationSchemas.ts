import { body, param, query } from "express-validator";
import { TodoStatus } from "../models/Todo";
import { Request } from "express";

// Auth validation
export const registerValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

// Make refreshToken validation empty since we'll handle it in the controller
export const refreshTokenValidation = [
  // Empty validation array - we'll handle this in the controller
];

// Todo validation
export const createTodoValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Title cannot be more than 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot be more than 500 characters"),
  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Please provide a valid date"),
];

export const updateTodoValidation = [
  param("id").isMongoId().withMessage("Invalid todo ID"),
  body("title")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Title cannot be more than 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot be more than 500 characters"),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Please provide a valid date"),
  body("status")
    .optional()
    .isIn(Object.values(TodoStatus))
    .withMessage("Invalid status value"),
];

export const getTodoByIdValidation = [
  param("id").isMongoId().withMessage("Invalid todo ID"),
];

export const deleteTodoValidation = [
  param("id").isMongoId().withMessage("Invalid todo ID"),
];

export const markAsCompletedValidation = [
  param("id").isMongoId().withMessage("Invalid todo ID"),
];

export const getTodosValidation = [
  query("status")
    .optional()
    .isIn(Object.values(TodoStatus))
    .withMessage("Invalid status value"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];
