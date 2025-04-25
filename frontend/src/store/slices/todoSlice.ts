import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import todoService from "../../services/todoService";
import { Todo, TodoStatus } from "../../types";

interface TodoState {
  todos: Todo[];
  activeTodo: Todo | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  filter: TodoStatus | null;
}

const initialState: TodoState = {
  todos: [],
  activeTodo: null,
  isLoading: false,
  error: null,
  total: 0,
  totalPages: 0,
  currentPage: 1,
  limit: 10,
  filter: null,
};

// Async thunks
export const fetchTodos = createAsyncThunk(
  "todo/fetchTodos",
  async (
    {
      status,
      page,
      limit,
    }: { status?: TodoStatus; page?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await todoService.getAllTodos(status, page, limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch todos"
      );
    }
  }
);

export const fetchTodoById = createAsyncThunk(
  "todo/fetchTodoById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await todoService.getTodoById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch todo"
      );
    }
  }
);

export interface CreateTodoPayload {
  title: string;
  description?: string;
  dueDate: Date;
}

export const createTodo = createAsyncThunk(
  "todo/createTodo",
  async (todoData: CreateTodoPayload, { rejectWithValue }) => {
    try {
      const response = await todoService.createTodo(todoData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create todo"
      );
    }
  }
);

export interface UpdateTodoPayload {
  id: string;
  title?: string;
  description?: string;
  dueDate?: Date;
  status?: TodoStatus;
}

export const updateTodo = createAsyncThunk(
  "todo/updateTodo",
  async (todoData: UpdateTodoPayload, { rejectWithValue }) => {
    try {
      const { id, ...rest } = todoData;
      const response = await todoService.updateTodo(id, rest);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update todo"
      );
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todo/deleteTodo",
  async (id: string, { rejectWithValue }) => {
    try {
      await todoService.deleteTodo(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete todo"
      );
    }
  }
);

export const markTodoAsCompleted = createAsyncThunk(
  "todo/markAsCompleted",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await todoService.markAsCompleted(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark todo as completed"
      );
    }
  }
);

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<TodoStatus | null>) => {
      state.filter = action.payload;
    },
    setActiveTodo: (state, action: PayloadAction<Todo | null>) => {
      state.activeTodo = action.payload;
    },
    clearActiveTodo: (state) => {
      state.activeTodo = null;
    },
    resetError: (state) => {
      state.error = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Todos
    builder.addCase(fetchTodos.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      state.isLoading = false;
      // Handle both possible API response formats
      if (action.payload.todos && action.payload.pagination) {
        // Response has expected structure
        state.todos = action.payload.todos;
        state.total = action.payload.pagination.total;
        state.totalPages = action.payload.pagination.totalPages;
        state.currentPage = action.payload.pagination.currentPage;
        state.limit = action.payload.pagination.limit;
      } else {
        // Fallback if API doesn't return expected structure
        state.todos = Array.isArray(action.payload) ? action.payload : [];
        state.total = state.todos.length;
        state.totalPages = 1;
        state.currentPage = 1;
      }
    });
    builder.addCase(fetchTodos.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch Todo by ID
    builder.addCase(fetchTodoById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTodoById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.activeTodo = action.payload;
    });
    builder.addCase(fetchTodoById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create Todo
    builder.addCase(createTodo.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createTodo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.todos = [action.payload, ...state.todos];
      state.total += 1;
      state.totalPages = Math.ceil(state.total / state.limit);
    });
    builder.addCase(createTodo.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update Todo
    builder.addCase(updateTodo.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateTodo.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.todos.findIndex(
        (todo) => todo._id === action.payload._id
      );
      if (index !== -1) {
        state.todos[index] = action.payload;
      }
      if (state.activeTodo && state.activeTodo._id === action.payload._id) {
        state.activeTodo = action.payload;
      }
    });
    builder.addCase(updateTodo.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Delete Todo
    builder.addCase(deleteTodo.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteTodo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.todos = state.todos.filter((todo) => todo._id !== action.payload);
      state.total -= 1;
      state.totalPages = Math.ceil(state.total / state.limit);
      if (state.activeTodo && state.activeTodo._id === action.payload) {
        state.activeTodo = null;
      }
    });
    builder.addCase(deleteTodo.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Mark Todo as Completed
    builder.addCase(markTodoAsCompleted.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(markTodoAsCompleted.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.todos.findIndex(
        (todo) => todo._id === action.payload._id
      );
      if (index !== -1) {
        state.todos[index] = action.payload;
      }
      if (state.activeTodo && state.activeTodo._id === action.payload._id) {
        state.activeTodo = action.payload;
      }
    });
    builder.addCase(markTodoAsCompleted.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  setFilter,
  setActiveTodo,
  clearActiveTodo,
  resetError,
  setPage,
} = todoSlice.actions;
export default todoSlice.reducer;
