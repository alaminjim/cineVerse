"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { authService } from "@/services/auth.service";
import Cookies from "js-cookie";

export default function AuthInitializer() {
  const { initializeAuth, setUser, setInitialized } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = Cookies.get("accessToken");
      const refreshToken = Cookies.get("refreshToken");
      const sessionToken = Cookies.get("better-auth.session_token");

      // If no auth cookies exist, user is definitely a guest. Avoid hitting the server.
      if (!accessToken && !refreshToken && !sessionToken) {
        initializeAuth(); // sets isInitialized: true internally
        return;
      }

      try {
        // First try to get current user from server
        const userResponse = await authService.getMe();
        if (userResponse.success && userResponse.data) {
          setUser(userResponse.data); // sets isInitialized: true internally
          localStorage.setItem("user", JSON.stringify(userResponse.data));
        } else {
          // Fallback to initializeAuth for cookie checking
          initializeAuth(); // sets isInitialized: true internally
        }
      } catch {
        // If server call fails, fallback to initializeAuth
        initializeAuth(); // sets isInitialized: true internally
      }
    };

    // Initialize authentication state on app load
    initAuth();
  }, [initializeAuth, setUser, setInitialized]);

  // Don't render anything, just handle auth initialization
  return null;
}

