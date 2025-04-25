import api from "./api";
import { TodoStatus } from "../types";

interface CreateTodoData {
  title: string;
  description?: string;
  dueDate: Date;
}

interface UpdateTodoData {
  title?: string;
  description?: string;
  dueDate?: Date;
  status?: TodoStatus;
}

const getAllTodos = async (
  status?: TodoStatus,
  page?: number,
  limit?: number
) => {
  const params = new URLSearchParams();

  if (status) params.append("status", status);
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());

  const query = params.toString() ? `?${params.toString()}` : "";
  const response = await api.get(`/todos${query}`);
  return response.data.data;
};

const getTodoById = async (id: string) => {
  const response = await api.get(`/todos/${id}`);
  return response.data.data;
};

const createTodo = async (todoData: CreateTodoData) => {
  const response = await api.post("/todos", todoData);
  return response.data.data;
};

const updateTodo = async (id: string, todoData: UpdateTodoData) => {
  const response = await api.put(`/todos/${id}`, todoData);
  return response.data.data;
};

const deleteTodo = async (id: string) => {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
};

const markAsCompleted = async (id: string) => {
  const response = await api.patch(`/todos/${id}/complete`);
  return response.data.data;
};

const todoService = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  markAsCompleted,
};

export default todoService;
