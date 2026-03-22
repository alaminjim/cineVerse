"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
// @ts-ignore
import Cookies from "js-cookie";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/lib/store";
import { Film, Mail, Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill in all fields.");
    
    setLoading(true);

    try {
      const res = await authService.login({ email, password });
      
      if (res.success) {
        toast.success("Logged in successfully!");
        const { accessToken, refreshToken, token, ...userData } = res.data;
        
        Cookies.set("accessToken", accessToken, { secure: true, sameSite: "strict" });
        if (refreshToken) Cookies.set("refreshToken", refreshToken, { secure: true, sameSite: "strict" });
        if (token) Cookies.set("better-auth.session_token", token, { secure: true, sameSite: "strict" });
        
        setUser(userData);
        router.push("/");
      } else {
        toast.error(res.message || "Invalid email or password");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background aesthetics */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background z-0" />
      
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 group mb-6">
            <div className="bg-primary/20 p-3 rounded-xl text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
              <Film className="w-8 h-8" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-foreground">
              Cine<span className="text-primary">Verse</span>
            </span>
          </Link>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-2 text-center">Log in to your account to continue your cinematic journey.</p>
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-border p-8 rounded-2xl shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-secondary/50 border border-border text-foreground text-sm rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none py-3 pl-11 pr-4 transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-secondary/50 border border-border text-foreground text-sm rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none py-3 pl-11 pr-4 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card/50 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            
            <a 
              href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/auth/login/google?redirect=%2F%3Foauth%3Dsuccess`}
              className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-3 border border-border"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </a>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
          
          <div className="mt-6 flex items-center justify-center">
             <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
               &larr; Back to Home
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
