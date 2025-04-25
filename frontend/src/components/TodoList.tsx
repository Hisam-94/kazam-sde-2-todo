import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchTodos, setPage } from "../store/slices/todoSlice";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";
import { Todo, TodoStatus } from "../types";
import { FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-toastify";

const TodoList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, isLoading, error, currentPage, totalPages, total } =
    useSelector((state: RootState) => state.todo);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<TodoStatus | undefined>(
    undefined
  );

  // Use useCallback to memoize the fetchTodosData function
  const fetchTodosData = useCallback(async () => {
    try {
      await dispatch(
        fetchTodos({
          page: currentPage,
          status: statusFilter,
          limit: 9, // Show 9 todos per page (3x3 grid)
        })
      ).unwrap();
    } catch (error: any) {
      // The axios interceptor will handle 401 errors and token refresh
      // We only need to handle non-auth errors here
      toast.error("Failed to fetch todos");
    }
  }, [currentPage, statusFilter, dispatch]);

  useEffect(() => {
    fetchTodosData();
  }, [fetchTodosData]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setPage(newPage));
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatusFilter(value ? (value as TodoStatus) : undefined);
    dispatch(setPage(1)); // Reset to first page when changing filter
  };

  const handleAddTodo = () => {
    setSelectedTodo(undefined);
    setIsFormOpen(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedTodo(undefined);
  };

  if (isLoading && todos.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && todos.length === 0) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error loading todos. Please try again later.</p>
        <button
          onClick={fetchTodosData}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Todos</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <label htmlFor="status-filter" className="sr-only">
              Filter by status
            </label>
            <select
              id="status-filter"
              value={statusFilter || ""}
              onChange={handleFilterChange}
              aria-label="Filter todos by status"
              className="rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500">
              <option value="">All</option>
              <option value={TodoStatus.PENDING}>Pending</option>
              <option value={TodoStatus.IN_PROGRESS}>In Progress</option>
              <option value={TodoStatus.COMPLETED}>Completed</option>
            </select>
          </div>
          <button
            onClick={handleAddTodo}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2">
            <FaPlus /> Add Todo
          </button>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <TodoForm todo={selectedTodo} onClose={closeForm} />
          </div>
        </div>
      )}

      {todos.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-600">
            No todos found
          </h3>
          <p className="text-gray-500 mt-2">
            {statusFilter
              ? `No ${statusFilter} todos found. Try a different filter or add a new todo.`
              : "Get started by adding your first todo!"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {todos.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onEdit={() => handleEditTodo(todo)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center px-3 py-1 rounded ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:bg-blue-100"
                }`}>
                <FaChevronLeft className="mr-1" size={14} /> Prev
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 rounded-full ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-blue-600 hover:bg-blue-100"
                      }`}>
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:bg-blue-100"
                }`}>
                Next <FaChevronRight className="ml-1" size={14} />
              </button>
            </div>
          )}

          {/* Showing count */}
          <div className="text-center mt-4 text-sm text-gray-500">
            Showing {todos.length} of {total} todo{total !== 1 ? "s" : ""}
          </div>
        </>
      )}
    </div>
  );
};

export default TodoList;
