"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todoController_1 = __importDefault(require("../controllers/todoController"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const validationMiddleware_1 = __importDefault(require("../middlewares/validationMiddleware"));
const validationSchemas_1 = require("../utils/validationSchemas");
const router = express_1.default.Router();
// All routes are protected
router.use(authMiddleware_1.default);
// Get all todos with optional filtering
router.get("/", (0, validationMiddleware_1.default)(validationSchemas_1.getTodosValidation), todoController_1.default.getAllTodos);
// Create a new todo
router.post("/", (0, validationMiddleware_1.default)(validationSchemas_1.createTodoValidation), todoController_1.default.createTodo);
// Get todo by ID
router.get("/:id", (0, validationMiddleware_1.default)(validationSchemas_1.getTodoByIdValidation), todoController_1.default.getTodoById);
// Update todo
router.put("/:id", (0, validationMiddleware_1.default)(validationSchemas_1.updateTodoValidation), todoController_1.default.updateTodo);
// Delete todo
router.delete("/:id", (0, validationMiddleware_1.default)(validationSchemas_1.deleteTodoValidation), todoController_1.default.deleteTodo);
// Mark todo as completed
router.patch("/:id/complete", (0, validationMiddleware_1.default)(validationSchemas_1.markAsCompletedValidation), todoController_1.default.markAsCompleted);
exports.default = router;
