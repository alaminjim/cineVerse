/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/lib/store";
import { Film, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useState } from "react";

const loginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

const getErrorMessage = (error: any): string => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return error.message;
  }
  return "An error occurred";
};

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginFormSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Signing in...");
      setServerErrors({}); 

      try {
        const res = await authService.login({
          email: value.email,
          password: value.password,
        });

        if (res.success) {
          const { accessToken, refreshToken, token, ...userData } = res.data;

          Cookies.set("accessToken", accessToken, {
            secure: true,
            sameSite: "lax",
            path: "/",
            expires: 7,
          });
          if (refreshToken)
            Cookies.set("refreshToken", refreshToken, {
              secure: true,
              sameSite: "lax",
              path: "/",
            });
          if (token)
            Cookies.set("better-auth.session_token", token, {
              secure: true,
              sameSite: "lax",
              path: "/",
            });

          setUser(res.data.user);
          toast.success("Welcome back!", { id: toastId });
          setTimeout(() => router.push("/"), 500);
        } else {
          const errorField = res.field || "email";
          setServerErrors({
            [errorField]: res.message,
          });
          toast.error(res.message || "Invalid email or password", {
            id: toastId,
          });
        }
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Something went wrong while logging in.";

        setServerErrors({
          email: errorMsg,
        });

        toast.error(errorMsg, { id: toastId });
      }
    },
  });

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const toastId = toast.loading("Redirecting to Google...");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://cine-verse-server-pi.vercel.app/api/v1";
      window.location.href = `${apiUrl}/auth/login/google`;
    } catch (error: any) {
      console.error("Google login error:", error);
      toast.error("Failed to initiate Google login", { id: toastId });
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
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
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Log in to your account to continue your cinematic journey.
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-border p-8 rounded-2xl shadow-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-5"
          >
            <form.Field name="email">
              {(field) => {
                const isTouched = field.state.meta.isTouched;
                const isInvalid =
                  isTouched && field.state.meta.errors.length > 0;
                const errorMessage =
                  (isInvalid
                    ? getErrorMessage(field.state.meta.errors[0])
                    : null) || serverErrors.email;

                return (
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
                        id="email"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className={`w-full bg-secondary/50 border-2 transition-colors ${
                          isInvalid || serverErrors.email
                            ? "border-red-500"
                            : "border-border"
                        } text-foreground text-sm rounded-xl focus:ring-2 focus:ring-primary/20 outline-none py-3 pl-11 pr-4`}
                        placeholder="name@example.com"
                        required
                      />
                    </div>
                    {(isInvalid || serverErrors.email) && errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/30"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{errorMessage}</span>
                      </motion.div>
                    )}
                  </div>
                );
              }}
            </form.Field>

            <form.Field name="password">
              {(field) => {
                const isTouched = field.state.meta.isTouched;
                const isInvalid =
                  isTouched && field.state.meta.errors.length > 0;
                const errorMessage =
                  (isInvalid
                    ? getErrorMessage(field.state.meta.errors[0])
                    : null) || serverErrors.password;

                return (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground">
                        Password
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className={`w-full bg-secondary/50 border-2 transition-colors ${
                          isInvalid || serverErrors.password
                            ? "border-red-500"
                            : "border-border"
                        } text-foreground text-sm rounded-xl focus:ring-2 focus:ring-primary/20 outline-none py-3 pl-11 pr-11`}
                        placeholder="••••••••"
                        required
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
                    {(isInvalid || serverErrors.password) && errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/30"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{errorMessage}</span>
                      </motion.div>
                    )}
                  </div>
                );
              }}
            </form.Field>

            <button
              type="submit"
              disabled={form.state.isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-semibold py-3 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] flex items-center justify-center gap-2 mt-6 disabled:cursor-not-allowed"
            >
              {form.state.isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
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
              onClick={handleGoogleLogin}
              disabled={googleLoading || form.state.isSubmitting}
              className="w-full bg-secondary hover:bg-secondary/80 disabled:bg-secondary/50 text-secondary-foreground font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-3 border border-border disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
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
                </>
              )}
            </button>
          </div>

          <div className="mt-8 text-center flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-primary font-medium hover:underline"
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
        </div>
      </motion.div>
    </div>
  );
}
