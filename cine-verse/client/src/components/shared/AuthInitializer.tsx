"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { authService } from "@/services/auth.service";

export default function AuthInitializer() {
  const { initializeAuth, setUser, isLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // First try to get current user from server
        const userResponse = await authService.getMe();
        if (userResponse.success && userResponse.data) {
          setUser(userResponse.data);
          localStorage.setItem("user", JSON.stringify(userResponse.data));
        } else {
          // Fallback to initializeAuth for cookie checking
          initializeAuth();
        }
      } catch (error) {
        // If server call fails, fallback to initializeAuth
        initializeAuth();
      }
    };

    // Initialize authentication state on app load
    initAuth();
  }, [initializeAuth, setUser]);

  // Don't render anything, just handle auth initialization
  return null;
}
