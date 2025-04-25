import Todo, { ITodo, TodoStatus } from "../models/Todo";
import mongoose from "mongoose";

interface CreateTodoParams {
  title: string;
  description?: string;
  dueDate: Date;
  userId: string;
}

interface UpdateTodoParams {
  title?: string;
  description?: string;
  dueDate?: Date;
  status?: TodoStatus;
}

/**
 * Create a new todo
 */
export const createTodo = async (params: CreateTodoParams): Promise<ITodo> => {
  const { title, description, dueDate, userId } = params;

  try {
    const todo = await Todo.create({
      title,
      description,
      dueDate,
      owner: userId,
    });

    return todo;
  } catch (error) {
    console.error("Error creating todo:", error);
    throw new Error("Failed to create todo");
  }
};

/**
 * Get all todos for a user
 */
export const getAllTodos = async (
  userId: string,
  status?: TodoStatus,
  page: number = 1,
  limit: number = 10
): Promise<{ todos: ITodo[]; total: number; totalPages: number }> => {
  try {
    const query: { owner: mongoose.Types.ObjectId; status?: TodoStatus } = {
      owner: new mongoose.Types.ObjectId(userId),
    };

    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Todo.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Get todos with pagination
    const todos = await Todo.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      todos,
      total,
      totalPages,
    };
  } catch (error) {
    console.error("Error getting todos:", error);
    throw new Error("Failed to get todos");
  }
};

/**
 * Get a todo by ID
 */
export const getTodoById = async (
  todoId: string,
  userId: string
): Promise<ITodo> => {
  try {
    const todo = await Todo.findOne({
      _id: todoId,
      owner: userId,
    });

    if (!todo) {
      throw new Error("Todo not found");
    }

    return todo;
  } catch (error) {
    console.error("Error getting todo:", error);
    throw new Error("Failed to get todo");
  }
};

/**
 * Update a todo
 */
export const updateTodo = async (
  todoId: string,
  userId: string,
  updateData: UpdateTodoParams
): Promise<ITodo> => {
  try {
    const todo = await Todo.findOneAndUpdate(
      {
        _id: todoId,
        owner: userId,
      },
      updateData,
      { new: true }
    );

    if (!todo) {
      throw new Error("Todo not found");
    }

    return todo;
  } catch (error) {
    console.error("Error updating todo:", error);
    throw new Error("Failed to update todo");
  }
};

/**
 * Delete a todo
 */
export const deleteTodo = async (
  todoId: string,
  userId: string
): Promise<boolean> => {
  try {
    const result = await Todo.deleteOne({
      _id: todoId,
      owner: userId,
    });

    if (result.deletedCount === 0) {
      throw new Error("Todo not found");
    }

    return true;
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw new Error("Failed to delete todo");
  }
};

/**
 * Mark todo as completed
 */
export const markAsCompleted = async (
  todoId: string,
  userId: string
): Promise<ITodo> => {
  try {
    const todo = await Todo.findOneAndUpdate(
      {
        _id: todoId,
        owner: userId,
      },
      { status: TodoStatus.COMPLETED },
      { new: true }
    );

    if (!todo) {
      throw new Error("Todo not found");
    }

    return todo;
  } catch (error) {
    console.error("Error marking todo as completed:", error);
    throw new Error("Failed to update todo status");
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
