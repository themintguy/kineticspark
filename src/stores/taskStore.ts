
import { create } from "zustand";
import { supabase } from "@/utils/supbase";
import { StateCreator } from "zustand"; 


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
  fetchTasks: (userId: string) => Promise<void>;
  addTask: (
    newTask: Omit<Task, "id" | "user_id" | "created_at" | "is_completed">,
    userId: string
  ) => Promise<void>;
  updateTask: (
    taskId: string,
    updates: Partial<Omit<Task, "id" | "user_id" | "created_at">>
  ) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}


const taskStoreCreator: StateCreator<TaskState> = (set) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async (userId) => {
    set({ loading: true, error: null }); 
    const { data, error } = await supabase
      .from("tasks")
      .select("*") 
      .eq("user_id", userId) 
      .order("created_at", { ascending: true }); 

    if (error) {
      set({ error: error.message, loading: false }); 
    } else {
      set({ tasks: data || [], loading: false }); 
    }
  },

  addTask: async (newTask, userId) => {
    set({ loading: true, error: null }); 
    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          ...newTask,
          user_id: userId,
          is_completed: false, 
          created_at: new Date().toISOString(),
          priority: newTask.priority || "medium",
        },
      ])
      .select(); 

    if (error) {
      set({ error: error.message, loading: false });
    } else if (data && data.length > 0) {
      set((state) => ({
        tasks: [...state.tasks, data[0]], 
        loading: false,
      }));
    } else {
      set({ error: "Failed to add task: No data returned.", loading: false }); 
    }
  },

  updateTask: async (taskId, updates) => {
    set({ loading: true, error: null });
    const { error } = await supabase
      .from("tasks")
      .update(updates) 
      .eq("id", taskId); 

    if (error) {
      set({ error: error.message, loading: false });
    } else {
      set((state) => ({
        tasks: state.tasks.map(
          (task) => (task.id === taskId ? { ...task, ...updates } : task) 
        ),
        loading: false, 
      }));
    }
  },

  deleteTask: async (taskId) => {
    set({ loading: true, error: null });
    const { error } = await supabase.from("tasks").delete().eq("id", taskId); 

    if (error) {
      set({ error: error.message, loading: false });
    } else {
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
        loading: false, 
      }));
    }
  },
});

export const useTaskStore = create<TaskState>(taskStoreCreator);
