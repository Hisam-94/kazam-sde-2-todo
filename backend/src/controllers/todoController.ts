import { Request, Response } from "express";
import todoService from "../services/todoService";
import { TodoStatus } from "../models/Todo";

/**
 * @desc    Create a new todo
 * @route   POST /api/todos
 * @access  Private
 */
export const createTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, dueDate } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    const todo = await todoService.createTodo({
      title,
      description,
      dueDate: new Date(dueDate),
      userId,
    });

    res.status(201).json({
      success: true,
      data: todo,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create todo",
    });
  }
};

/**
 * @desc    Get all todos
 * @route   GET /api/todos
 * @access  Private
 */
export const getAllTodos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    // Get query parameters
    const status = req.query.status as TodoStatus | undefined;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const result = await todoService.getAllTodos(userId, status, page, limit);

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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get todos",
    });
  }
};

/**
 * @desc    Get todo by ID
 * @route   GET /api/todos/:id
 * @access  Private
 */
export const getTodoById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const todoId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    const todo = await todoService.getTodoById(todoId, userId);

    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Todo not found",
    });
  }
};

/**
 * @desc    Update todo
 * @route   PUT /api/todos/:id
 * @access  Private
 */
export const updateTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const todoId = req.params.id;
    const userId = req.user?.id;
    const { title, description, dueDate, status } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (dueDate !== undefined) updateData.dueDate = new Date(dueDate);
    if (status !== undefined) updateData.status = status;

    const todo = await todoService.updateTodo(todoId, userId, updateData);

    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Failed to update todo",
    });
  }
};

/**
 * @desc    Delete todo
 * @route   DELETE /api/todos/:id
 * @access  Private
 */
export const deleteTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const todoId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    await todoService.deleteTodo(todoId, userId);

    res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Failed to delete todo",
    });
  }
};

/**
 * @desc    Mark todo as completed
 * @route   PATCH /api/todos/:id/complete
 * @access  Private
 */
export const markAsCompleted = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const todoId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    const todo = await todoService.markAsCompleted(todoId, userId);

    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Failed to update todo status",
    });
  }
};

export default {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  markAsCompleted,
};
