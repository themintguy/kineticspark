"use client";

import React, { useEffect, useState } from "react";
import { useTaskStore, Task } from "@/stores/taskStore";
import { useAuthStore } from "@/stores/authStore";
import toast from "react-hot-toast";
import {
  CheckCircle,
  Circle,
  Trash2,
  Edit,
  Save,
  X,
  Clock,
} from "lucide-react";

export default function TaskList() {
  const tasks = useTaskStore((state) => state.tasks);
  const loadingTasks = useTaskStore((state) => state.loading);
  const error = useTaskStore((state) => state.error);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const currentUser = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.loadingUser);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [newTaskCategories, setNewTaskCategories] = useState("");

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingDueDate, setEditingDueDate] = useState("");
  const [editingPriority, setEditingPriority] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [editingCategories, setEditingCategories] = useState("");

  useEffect(() => {
    // FIXED: Call fetchTasks directly, it gets the token internally.
    if (!authLoading && currentUser) {
      fetchTasks();
    }
  }, [authLoading, currentUser, fetchTasks]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      toast.error("Task title cannot be empty!");
      return;
    }
    if (!currentUser) {
      toast.error("You must be logged in to add tasks.");
      return;
    }

    const isoDueDate = newTaskDueDate
      ? new Date(newTaskDueDate + "T00:00:00Z").toISOString()
      : null;

    const taskData = {
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim() || null,
      due_date: isoDueDate,
      priority: newTaskPriority,
      categories: newTaskCategories.trim()
        ? newTaskCategories
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag)
        : null,
    };

    // FIXED: The store no longer needs the userId.
    const addPromise = addTask(taskData);
    toast.promise(addPromise, {
      loading: "Adding task...",
      success: "Task added successfully!",
      error: (err) =>
        `Failed to add task: ${err.message || "An error occurred"}`,
    });

    await addPromise;
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskDueDate("");
    setNewTaskPriority("medium");
    setNewTaskCategories("");
  };

  const handleToggleComplete = async (taskId: string, isCompleted: boolean) => {
    const updatePromise = updateTask(taskId, { is_completed: isCompleted });
    toast.promise(updatePromise, {
      loading: isCompleted ? "Marking incomplete..." : "Marking complete...",
      success: isCompleted
        ? "Task marked incomplete!"
        : "Task marked complete!",
      error: (err) =>
        `Failed to update task: ${err.message || "An error occurred"}`,
    });
  };

  const handleEditClick = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
    setEditingDescription(task.description || "");
    setEditingDueDate(task.due_date ? task.due_date.substring(0, 10) : "");
    setEditingPriority(task.priority);
    setEditingCategories(task.categories?.join(", ") || "");
  };

  const handleSaveEdit = async (taskId: string) => {
    if (!editingTitle.trim()) {
      toast.error("Task title cannot be empty!");
      return;
    }

    const isoDueDate = editingDueDate
      ? new Date(editingDueDate + "T00:00:00Z").toISOString()
      : null;

    const updatedData = {
      title: editingTitle.trim(),
      description: editingDescription.trim() || null,
      due_date: isoDueDate,
      priority: editingPriority,
      categories: editingCategories.trim()
        ? editingCategories
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag)
        : null,
    };

    const updatePromise = updateTask(taskId, updatedData);
    toast.promise(updatePromise, {
      loading: "Saving changes...",
      success: "Task updated successfully!",
      error: (err) =>
        `Failed to save changes: ${err.message || "An error occurred"}`,
    });

    await updatePromise;
    setEditingTaskId(null);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
  };

  const handleDeleteTask = async (taskId: string) => {
    const deletePromise = deleteTask(taskId);
    toast.promise(deletePromise, {
      loading: "Deleting task...",
      success: "Task deleted successfully!",
      error: (err) =>
        `Failed to delete task: ${err.message || "An error occurred"}`,
    });
  };

  if (authLoading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Loading user information...
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
        <p className="text-red-500 dark:text-red-400">
          Please log in to manage your tasks.
        </p>
      </div>
    );
  }

  if (loadingTasks && tasks.length === 0) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
        <p className="text-gray-500 dark:text-gray-400">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md text-center">
        <p>Error: {error}</p>
        <p>Please try again or refresh the page.</p>
      </div>
    );
  }

  return (
    <div className="sm:p-6  bg-white dark:bg-gray-800 rounded-lg shadow-md mx-auto w-full max-w-xl">
      <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">
        Your Tasks
      </h3>

      <form
        onSubmit={handleAddTask}
        className="space-y-4 mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
      >
        <div>
          <label
            htmlFor="newTaskTitle"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Task Title
          </label>
          <input
            id="newTaskTitle"
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="e.g., conquer Stacks"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emeral-500 dark:bg-gray-700 dark:text-white"
            disabled={loadingTasks}
            required
          />
        </div>

        <div>
          <label
            htmlFor="newTaskDescription"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Description (Optional)
          </label>
          <textarea
            id="newTaskDescription"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Add more details about the task..."
            rows={2}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            disabled={loadingTasks}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="newTaskDueDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Due Date (Optional)
            </label>
            <input
              id="newTaskDueDate"
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              disabled={loadingTasks}
            />
          </div>
          <div>
            <label
              htmlFor="newTaskPriority"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Priority
            </label>
            <select
              id="newTaskPriority"
              value={newTaskPriority}
              onChange={(e) =>
                setNewTaskPriority(e.target.value as "low" | "medium" | "high")
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              disabled={loadingTasks}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <div>
          <label
            htmlFor="newTaskCategories"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Categories (Comma-separated, e.g., work, personal)
          </label>
          <input
            id="newTaskCategories"
            type="text"
            value={newTaskCategories}
            onChange={(e) => setNewTaskCategories(e.target.value)}
            placeholder="e.g., home, coding, urgent"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            disabled={loadingTasks}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loadingTasks}
        >
          {loadingTasks ? "Adding..." : "Add Task"}
        </button>
      </form>

      {tasks.length === 0 && !loadingTasks ? (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
          No tasks yet. Add one above!
        </p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm transition-all duration-200 ${
                task.is_completed
                  ? "opacity-70 border-l-4 border-green-500"
                  : "border-l-4 border-transparent"
              }`}
            >
              {editingTaskId === task.id ? (
                // Edit Mode
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor={`editTitle-${task.id}`}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Title
                    </label>
                    <input
                      id={`editTitle-${task.id}`}
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-600 dark:text-white"
                      disabled={loadingTasks}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`editDescription-${task.id}`}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id={`editDescription-${task.id}`}
                      value={editingDescription}
                      onChange={(e) => setEditingDescription(e.target.value)}
                      rows={2}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-600 dark:text-white"
                      disabled={loadingTasks}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor={`editDueDate-${task.id}`}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Due Date
                      </label>
                      <input
                        id={`editDueDate-${task.id}`}
                        type="date"
                        value={editingDueDate}
                        onChange={(e) => setEditingDueDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-600 dark:text-white"
                        disabled={loadingTasks}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`editPriority-${task.id}`}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Priority
                      </label>
                      <select
                        id={`editPriority-${task.id}`}
                        value={editingPriority}
                        onChange={(e) =>
                          setEditingPriority(
                            e.target.value as "low" | "medium" | "high"
                          )
                        }
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500
    ${editingPriority === "low" ? "bg-green-200" : ""}
    ${editingPriority === "medium" ? "bg-blue-500 text-white" : ""}
    ${editingPriority === "high" ? "bg-red-500 text-white" : ""}
    dark:text-white dark:border-gray-600`}
                        disabled={loadingTasks}
                      >
                        <option value="low" className="bg-green-200">
                          Low
                        </option>
                        <option value="medium" className="bg-blue-500">
                          Medium
                        </option>
                        <option value="high" className="bg-red-500">
                          High
                        </option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor={`editCategories-${task.id}`}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Categories
                    </label>
                    <input
                      id={`editCategories-${task.id}`}
                      type="text"
                      value={editingCategories}
                      onChange={(e) => setEditingCategories(e.target.value)}
                      placeholder="comma, separated, tags"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-600 dark:text-white"
                      disabled={loadingTasks}
                    />
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => handleSaveEdit(task.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      disabled={loadingTasks}
                    >
                      <Save className="h-4 w-4 mr-1" /> Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      disabled={loadingTasks}
                    >
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1 min-w-0">
                    <button
                      onClick={() =>
                        handleToggleComplete(task.id, !task.is_completed)
                      }
                      className="flex-shrink-0 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3 mt-1"
                      aria-label={
                        task.is_completed ? "Mark incomplete" : "Mark complete"
                      }
                      disabled={loadingTasks}
                    >
                      {task.is_completed ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <Circle className="h-6 w-6" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-lg font-semibold ${
                          task.is_completed
                            ? "line-through text-gray-500 dark:text-gray-400"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 truncate">
                          {task.description}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400">
                        {task.due_date && (
                          <span className="mr-3 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(task.due_date).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        )}
                        <span
                          className={`mr-3 px-2 py-1 rounded-full text-white ${
                            task.priority === "high"
                              ? "bg-red-500"
                              : task.priority === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        >
                          {task.priority.charAt(0).toUpperCase() +
                            task.priority.slice(1)}
                        </span>
                        {task.categories && task.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {task.categories.map((category, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs"
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEditClick(task)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Edit task"
                      disabled={loadingTasks}
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Delete task"
                      disabled={loadingTasks}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
