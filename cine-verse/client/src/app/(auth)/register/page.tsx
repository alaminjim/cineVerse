/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/lib/store";
import { Film, Mail, Lock, User, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { authRegisterValidationSchema } from "../validations";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateField = (name: string, value: string) => {
    try {
      const fieldSchema = authRegisterValidationSchema.pick({
        [name]: true,
      } as any);
      fieldSchema.parse({ [name]: value });
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    } catch (error: any) {
      if (error.errors) {
        setErrors((prev) => ({
          ...prev,
          [name]: error.errors[0].message,
        }));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      authRegisterValidationSchema.parse(formData);
    } catch (error: any) {
      const newErrors: Record<string, string> = {};
      error.errors.forEach((err: any) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await authService.register(formData);

      if (res.success) {
        toast.success("Registration successful!");
        const { accessToken, refreshToken, token, ...userData } = res.data;

        Cookies.set("accessToken", accessToken, {
          secure: true,
          sameSite: "lax",
          path: "/",
          expires: 7,
        });

        if (refreshToken) {
          Cookies.set("refreshToken", refreshToken, {
            secure: true,
            sameSite: "lax",
            path: "/",
            expires: 30,
          });
        }

        if (token) {
          Cookies.set("better-auth.session_token", token, {
            secure: true,
            sameSite: "lax",
            path: "/",
          });
        }

        setUser(userData);
        router.push("/");
      } else {
        toast.error(res.message || "Registration failed");
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.errorSources?.[0]?.message ||
        err.response?.data?.message ||
        err.message ||
        "Something went wrong while registering.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    router.push(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/google`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-background py-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0" />

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
            <span className="text-3xl font-bold tracking-tight text-foreground">
              Cine<span className="text-primary">Verse</span>
            </span>
          </Link>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Join thousands of movie lovers around the world.
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-border p-8 rounded-2xl shadow-2xl">
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
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
                  className={`w-full bg-secondary/50 border ${
                    errors.name ? "border-red-500" : "border-border"
                  } text-foreground text-sm rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none py-3 pl-11 pr-4 transition-all`}
                  placeholder="John Doe"
                  required
                />
              </div>
              {errors.name && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
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
                  className={`w-full bg-secondary/50 border ${
                    errors.email ? "border-red-500" : "border-border"
                  } text-foreground text-sm rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none py-3 pl-11 pr-4 transition-all`}
                  placeholder="name@example.com"
                  required
                />
              </div>
              {errors.email && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full bg-secondary/50 border ${
                    errors.password ? "border-red-500" : "border-border"
                  } text-foreground text-sm rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none py-3 pl-11 pr-4 transition-all`}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              {errors.password && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Must contain: uppercase, lowercase, number (min 6 chars)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || Object.keys(errors).length > 0}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card/50 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleRegister}
              className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-3 border border-border"
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
