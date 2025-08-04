
import { create } from "zustand";
import { StateCreator } from "zustand";
import axios from "axios";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  created_at: string;
  due_date: string | null;
  priority: "low" | "medium" | "high";
  categories: string[] | null;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (
    newTask: Omit<Task, "id" | "user_id" | "created_at" | "is_completed">
  ) => Promise<void>;
  updateTask: (
    taskId: string,
    updates: Partial<Omit<Task, "id" | "user_id" | "created_at">>
  ) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/tasks`;

const taskStoreCreator: StateCreator<TaskState> = (set) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    const token = localStorage.getItem("token");

    if (!token) {
      set({ error: "Not authenticated.", loading: false });
      return;
    }

    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ tasks: response.data || [], loading: false });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        set({
          error: err.response?.data?.message || "Failed to fetch tasks.",
          loading: false,
        });
      } else {
        set({ error: "An unexpected error occurred.", loading: false });
      }
    }
  },

  addTask: async (newTask) => {
    set({ loading: true, error: null });
    const token = localStorage.getItem("token");

    if (!token) {
      set({ error: "Not authenticated.", loading: false });
      return;
    }

    try {
      const response = await axios.post(API_URL, newTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => ({
        tasks: [...state.tasks, response.data],
        loading: false,
      }));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        set({
          error: err.response?.data?.message || "Failed to add task.",
          loading: false,
        });
      } else {
        set({ error: "An unexpected error occurred.", loading: false });
      }
    }
  },

  updateTask: async (taskId, updates) => {
    set({ loading: true, error: null });
    const token = localStorage.getItem("token");

    if (!token) {
      set({ error: "Not authenticated.", loading: false });
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/${taskId}`, updates, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, ...response.data } : task
        ),
        loading: false,
      }));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        set({
          error: err.response?.data?.message || "Failed to update task.",
          loading: false,
        });
      } else {
        set({ error: "An unexpected error occurred.", loading: false });
      }
    }
  },

  deleteTask: async (taskId) => {
    set({ loading: true, error: null });
    const token = localStorage.getItem("token");

    if (!token) {
      set({ error: "Not authenticated.", loading: false });
      return;
    }

    try {
      await axios.delete(`${API_URL}/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
        loading: false,
      }));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        set({
          error: err.response?.data?.message || "Failed to delete task.",
          loading: false,
        });
      } else {
        set({ error: "An unexpected error occurred.", loading: false });
      }
    }
  },
});

export const useTaskStore = create<TaskState>(taskStoreCreator);
