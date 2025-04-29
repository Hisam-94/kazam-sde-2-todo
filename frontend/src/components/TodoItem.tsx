import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { Todo, TodoStatus } from "../types";
import { deleteTodo, updateTodo } from "../store/slices/todoSlice";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { FaCheck, FaTrash, FaEdit } from "react-icons/fa";
import { formatDate } from "../utils/helpers";

interface TodoItemProps {
  todo: Todo;
  onEdit: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit }) => {
  const dispatch = useDispatch<AppDispatch>();
  console.log("todo", todo);
  const getStatusColor = (status: TodoStatus) => {
    switch (status) {
      case TodoStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case TodoStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-800";
      case TodoStatus.COMPLETED:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteTodo(todo._id));
      toast.success("Todo deleted successfully");
    } catch (error) {
      toast.error("Failed to delete todo");
    }
  };

  const handleToggleComplete = async () => {
    try {
      const newStatus =
        todo.status === TodoStatus.COMPLETED
          ? TodoStatus.PENDING
          : TodoStatus.COMPLETED;

      await dispatch(
        updateTodo({
          id: todo._id,
          status: newStatus,
          title: todo.title,
          description: todo.description,
          dueDate: new Date(todo.dueDate),
        })
      );

      toast.success(
        newStatus === TodoStatus.COMPLETED
          ? "Todo marked as completed"
          : "Todo marked as not completed"
      );
    } catch (error) {
      toast.error("Failed to update todo status");
    }
  };

  const isPastDue = () => {
    if (!todo.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(todo.dueDate);
    return dueDate < today && todo.status !== TodoStatus.COMPLETED;
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
        todo.status === TodoStatus.COMPLETED
          ? "border-green-500"
          : isPastDue()
          ? "border-red-500"
          : "border-blue-500"
      }`}>
      <div className="flex justify-between items-start mb-2">
        <h3
          className={`text-lg font-semibold ${
            todo.status === TodoStatus.COMPLETED
              ? "line-through text-gray-500"
              : "text-gray-800"
          }`}>
          {todo.title}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            todo.status
          )}`}>
          {todo.status.replace("_", " ")}
        </span>
      </div>

      <p
        className={`text-sm text-gray-600 mb-4 ${
          todo.status === TodoStatus.COMPLETED
            ? "line-through text-gray-400"
            : ""
        }`}>
        {todo.description}
      </p>

      {todo.dueDate && (
        <div
          className={`text-xs mb-4 ${
            isPastDue() ? "text-red-600 font-semibold" : "text-gray-500"
          }`}>
          Due: {formatDate(todo.dueDate)}
          {isPastDue() && " (Overdue)"}
        </div>
      )}

      <div className="flex justify-between mt-6 items-center">
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
            aria-label="Edit todo">
            <FaEdit />
            <span>Edit</span>
          </button>

          <button
            onClick={handleDelete}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition"
            aria-label="Delete todo">
            <FaTrash />
            <span>Delete</span>
          </button>
        </div>

        <button
          onClick={handleToggleComplete}
          className={`flex items-center gap-2 px-4 py-1.5 text-sm rounded-full font-medium transition ${
            todo.status === TodoStatus.COMPLETED
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          aria-label={
            todo.status === TodoStatus.COMPLETED
              ? "Mark as incomplete"
              : "Mark as complete"
          }>
          <FaCheck />
          {todo.status === TodoStatus.COMPLETED
            ? "Mark Incomplete"
            : "Mark Complete"}
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
