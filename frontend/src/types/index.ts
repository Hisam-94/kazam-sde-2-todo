export interface User {
  id: string;
  email: string;
}

export enum TodoStatus {
  PENDING = "pending",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
}

export interface Todo {
  _id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  dueDate: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoDTO {
  title: string;
  description?: string;
  dueDate: Date | string;
  status?: TodoStatus;
}

export interface UpdateTodoDTO {
  title?: string;
  description?: string;
  dueDate?: Date | string;
  status?: TodoStatus;
}
