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
  User,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain an uppercase letter";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Password must contain a lowercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain a number";
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
    const toastId = toast.loading("Creating account...");

    try {
      const res = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Handle custom endpoint response format
      if (res.success) {
        const { accessToken, refreshToken, token, ...userData } = res.data;

        if (accessToken) {
          Cookies.set("accessToken", accessToken, {
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: 7,
          });
        }

        if (refreshToken) {
          Cookies.set("refreshToken", refreshToken, {
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: 30,
          });
        }

        if (token) {
          Cookies.set("better-auth.session_token", token, {
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });
        }

        // Update user state and save to localStorage
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // Show success message
        toast.success("Registration successful! Welcome to CineVerse!", {
          id: toastId,
          duration: 3000,
        });

        // Optional: Redirect after 2 seconds (remove this line if you don't want redirect)
        setTimeout(() => {
          router.push("/"); // Change to "/dashboard" or wherever you want
        }, 2000);
      } else {
        // Handle error response
        const errorMsg = res.message || "Registration failed";
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

  const handleGoogleRegister = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    window.location.href = `${apiUrl}/auth/login/google`;
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-black py-16">
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
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Join thousands of movie lovers around the world.
          </p>
        </div>

        <div className="bg-[#0f1117]/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full bg-[#15171e]/50 border-2 transition-colors ${
                    errors.name ? "border-red-500" : "border-white/10"
                  } text-white text-sm rounded-xl focus:ring-2 focus:ring-primary/20 outline-none py-3 pl-11 pr-4`}
                  placeholder="John Doe"
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/30"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errors.name}</span>
                </motion.div>
              )}
            </div>

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
              <label className="text-sm font-medium text-white">Password</label>
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
              <p className="text-xs text-muted-foreground mt-1">
                Must contain: uppercase, lowercase, number (min 8 chars)
              </p>
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
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Google Sign Up */}
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
              onClick={handleGoogleRegister}
              disabled={isLoading}
              className="w-full bg-[#15171e] hover:bg-[#1c202a] disabled:bg-[#15171e]/50 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-3 border border-white/10 disabled:cursor-not-allowed"
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
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
