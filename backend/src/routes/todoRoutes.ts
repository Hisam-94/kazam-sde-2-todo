import express from "express";
import todoController from "../controllers/todoController";
import protect from "../middlewares/authMiddleware";
import validate from "../middlewares/validationMiddleware";
import {
  createTodoValidation,
  updateTodoValidation,
  getTodoByIdValidation,
  deleteTodoValidation,
  markAsCompletedValidation,
  getTodosValidation,
} from "../utils/validationSchemas";

const router = express.Router();

// All routes are protected
router.use(protect);

// Get all todos with optional filtering
router.get("/", validate(getTodosValidation), todoController.getAllTodos);

// Create a new todo
router.post("/", validate(createTodoValidation), todoController.createTodo);

// Get todo by ID
router.get("/:id", validate(getTodoByIdValidation), todoController.getTodoById);

// Update todo
router.put("/:id", validate(updateTodoValidation), todoController.updateTodo);

// Delete todo
router.delete(
  "/:id",
  validate(deleteTodoValidation),
  todoController.deleteTodo
);

// Mark todo as completed
router.patch(
  "/:id/complete",
  validate(markAsCompletedValidation),
  todoController.markAsCompleted
);

export default router;
