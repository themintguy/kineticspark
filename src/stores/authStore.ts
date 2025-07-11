
import { create } from "zustand";
import { User } from "@supabase/supabase-js";
import { StateCreator } from "zustand"; 


interface AuthState {
  user: User | null; 
  isAuthenticated: boolean; 
  loadingUser: boolean; 
  setUser: (user: User | null) => void; 
  setLoadingUser: (loading: boolean) => void; 
}

const authStoreCreator: StateCreator<AuthState> = (set) => ({
  user: null,
  isAuthenticated: false,
  loadingUser: true, 

  setUser: (user) =>
    set({
      user,
      isAuthenticated: user !== null, 
    }),

  setLoadingUser: (loading) => set({ loadingUser: loading }),
});


export const useAuthStore = create<AuthState>(authStoreCreator);
