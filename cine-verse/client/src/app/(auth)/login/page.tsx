/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/lib/store";
import {
  Film,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rememberMe, setRememberMe] = useState(false);

  // Load saved email if remember me was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Important: prevents page refresh

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Signing in...");

    try {
      const res = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      if (res.success) {
        // Handle custom endpoint response format
        const { accessToken, refreshToken, token, ...userData } = res.data;

        if (accessToken) {
          Cookies.set("accessToken", accessToken, {
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: rememberMe ? 30 : 1,
          });
        }

        if (refreshToken) {
          Cookies.set("refreshToken", refreshToken, {
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: rememberMe ? 30 : 7,
          });
        }

        if (token) {
          Cookies.set("better-auth.session_token", token, {
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: rememberMe ? 30 : 1,
          });
        }

        // Save email if remember me is checked
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // Handle tokens from cookies (better-auth sets cookies automatically)
        // Update user state and save to localStorage
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        // Force a small delay to ensure cookies are set
        await new Promise(resolve => setTimeout(resolve, 100));

        // Show success message
        toast.success(
          `Welcome back, ${res.data.user.name || "Cinema Lover"}!`,
          {
            id: toastId,
            duration: 3000,
          },
        );

        // Redirect based on user role
        setTimeout(() => {
          if (res.data.user.role === "ADMIN") {
            router.push("/admin/dashboard");
          } else {
            router.push("/");
          }
        }, 1500);
      } else {
        // Handle error response
        const errorMsg = res.message || "Invalid email or password";
        setErrors({
          email: errorMsg,
        });
        toast.error(errorMsg, { id: toastId });
        setIsLoading(false);
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.errorSources?.[0]?.message ||
        err.message ||
        "Something went wrong. Please try again.";

      setErrors({
        email: errorMsg,
      });

      toast.error(errorMsg, { id: toastId });
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleGoogleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    window.location.href = `${apiUrl}/auth/login/google`;
  };

  const handleDemoLogin = (type: "admin" | "user") => {
    const credentials = {
      admin: {
        email: "admin123@gmail.com",
        password: "12345678Jim"
      },
      user: {
        email: "user123@gmail.com", 
        password: "12345678As"
      }
    };
    
    setFormData(credentials[type]);
    setErrors({});
  };

  const handleForgotPassword = () => {
    if (formData.email && !errors.email) {
      router.push(
        `/forgot-password?email=${encodeURIComponent(formData.email)}`,
      );
    } else {
      router.push("/forgot-password");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-black to-black z-0" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 group mb-6">
            <div className="bg-primary/20 p-3 rounded-xl text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
              <Film className="w-8 h-8" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-white">
              Cine<span className="text-primary">Verse</span>
            </span>
          </Link>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Log in to your account to continue your cinematic journey.
          </p>
        </div>

        <div className="bg-[#0f1117]/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-[#15171e]/50 border-2 transition-colors ${
                    errors.email ? "border-red-500" : "border-white/10"
                  } text-white text-sm rounded-xl focus:ring-2 focus:ring-primary/20 outline-none py-3 pl-11 pr-4`}
                  placeholder="name@example.com"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/30"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errors.email}</span>
                </motion.div>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-medium text-primary hover:underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full bg-[#15171e]/50 border-2 transition-colors ${
                    errors.password ? "border-red-500" : "border-white/10"
                  } text-white text-sm rounded-xl focus:ring-2 focus:ring-primary/20 outline-none py-3 pl-11 pr-11`}
                  placeholder="••••••••"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/30"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errors.password}</span>
                </motion.div>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-[#15171e] text-primary focus:ring-primary/20 focus:ring-2"
                />
                <span className="text-sm text-muted-foreground">
                  Remember me
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-semibold py-3 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] flex items-center justify-center gap-2 mt-6 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>
        </div>

        {/* Google Login */}
        <div className="mt-6">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#0f1117] text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-[#15171e] hover:bg-[#1c1f28] disabled:bg-[#15171e]/50 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-3 border border-white/10 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 4.1 2.47 1.56 4.92l3.26 2.53C6.13 5.57 8.9 3.38 12 5.38z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>

          {/* Demo Login Buttons */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-muted-foreground text-center mb-3">
              Quick Demo Access
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleDemoLogin("admin")}
                disabled={isLoading}
                className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 font-medium py-2 px-3 rounded-lg transition-all text-sm disabled:cursor-not-allowed"
              >
                👑 Admin Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin("user")}
                disabled={isLoading}
                className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 font-medium py-2 px-3 rounded-lg transition-all text-sm disabled:cursor-not-allowed"
              >
                👤 User Demo
              </button>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
