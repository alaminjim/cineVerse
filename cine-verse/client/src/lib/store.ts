/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => {
        // Clear cookies
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("better-auth.session_token");
        // Clear state
        set({ user: null, isLoading: false });
      },
      initializeAuth: () => {
        const accessToken = Cookies.get("accessToken");
        const refreshToken = Cookies.get("refreshToken");
        const sessionToken = Cookies.get("better-auth.session_token");
        
        if (accessToken || refreshToken || sessionToken) {
          // Try to get user data from server or stored data
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            try {
              const user = JSON.parse(storedUser);
              set({ user, isLoading: false });
            } catch {
              // Invalid stored data, clear everything
              get().logout();
            }
          } else {
            // No stored user, but tokens exist - set loading to false
            set({ isLoading: false });
          }
        } else {
          // No tokens, user is not authenticated
          set({ user: null, isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }), // Only persist user data
    }
  )
);
