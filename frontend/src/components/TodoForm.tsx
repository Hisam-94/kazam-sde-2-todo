import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { Todo, TodoStatus, CreateTodoDTO, UpdateTodoDTO } from "../types";
import { createTodo, updateTodo } from "../store/slices/todoSlice";
import {
  CreateTodoPayload,
  UpdateTodoPayload,
} from "../store/slices/todoSlice";
import { toast } from "react-toastify";

interface TodoFormProps {
  todo?: Todo;
  onClose: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ todo, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const isEditing = !!todo;

  const [formData, setFormData] = useState<CreateTodoDTO | UpdateTodoDTO>({
    title: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    status: TodoStatus.PENDING,
  });

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
        description: todo.description || "",
        dueDate: new Date(todo.dueDate).toISOString().split("T")[0],
        status: todo.status,
      });
    }
  }, [todo]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing && todo) {
        // Create a copy of the form data with any date strings converted to Date objects
        const todoData: UpdateTodoPayload = {
          id: todo._id,
          title: formData.title,
          description: formData.description,
          status: formData.status as TodoStatus,
          dueDate: formData.dueDate
            ? new Date(formData.dueDate as string)
            : undefined,
        };

        await dispatch(updateTodo(todoData)).unwrap();
        toast.success("Todo updated successfully");
      } else {
        // Create a copy of the form data with the date string converted to a Date object
        const todoData: CreateTodoPayload = {
          title: formData.title as string,
          description: formData.description,
          dueDate: new Date(formData.dueDate as string),
        };

        await dispatch(createTodo(todoData)).unwrap();
        toast.success("Todo added successfully");
      }
      onClose();
    } catch (error) {
      toast.error(`Failed to ${isEditing ? "update" : "add"} todo`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {isEditing ? "Edit Todo" : "Add Todo"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title">
            Title*
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter todo title"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description">
            Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter todo description"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dueDate">
            Due Date*
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="dueDate"
            type="date"
            name="dueDate"
            value={
              typeof formData.dueDate === "string"
                ? formData.dueDate
                : (formData.dueDate as Date).toISOString().split("T")[0]
            }
            onChange={handleChange}
            required
          />
        </div>

        {isEditing && (
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="status">
              Status
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}>
              <option value={TodoStatus.PENDING}>Pending</option>
              <option value={TodoStatus.IN_PROGRESS}>In Progress</option>
              <option value={TodoStatus.COMPLETED}>Completed</option>
            </select>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            {isEditing ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TodoForm;
