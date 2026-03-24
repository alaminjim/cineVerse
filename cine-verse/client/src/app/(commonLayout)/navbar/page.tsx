/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { authService } from "@/services/auth.service";
import {
  Menu,
  X,
  LogIn,
  LogOut,
  Film,
  Crown,
  LayoutDashboard,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, logout } = useAuthStore();

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("oauth") === "success") {
        toast.success("Successfully logged in with Google!");
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      }
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authService.getMe();
        if (res?.success) {
          setUser(res.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      }
    };

    if (!user) {
      fetchUser();
    }
  }, [user, setUser]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {}
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Movies", path: "/movies" },
    { name: "Info", path: "/info" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-border py-4 shadow-lg"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group z-50">
          <div className="bg-primary/20 p-1.5 rounded-lg transition-colors group-hover:bg-primary/30">
            <img
              src="/logo.png"
              alt="CineVerse Logo"
              className="w-8 h-8 object-contain rounded-md"
            />
          </div>
          <span className="text-2xl font-black uppercase italic tracking-tighter text-white">
            Cine<span className="text-primary italic">Verse</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`relative text-sm font-medium transition-all duration-300 hover:text-primary ${
                isActive(link.path) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.name}

              {isActive(link.path) && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full animate-in fade-in zoom-in duration-300" />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {/* Subscription Button — always visible */}
          <Link
            href="/subscription"
            className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-full border transition-all ${
              isActive("/subscription")
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-lg shadow-purple-500/20"
                : "border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/50"
            }`}
          >
            <Crown className="w-3.5 h-3.5" /> Premium
          </Link>

          {user ? (
            <>
              <Link
                href={
                  user.role === "ADMIN" ? "/admin/dashboard" : "/user/dashboard"
                }
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                {user.role === "ADMIN" ? "Admin" : "Dashboard"}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </Link>
              <Link
                href="/register"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-2.5 px-6 rounded-full transition-all shadow-md active:scale-95"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-foreground p-2 z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-background flex flex-col items-center justify-center gap-8 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-2xl font-bold transition-colors ${
                isActive(link.path) ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {/* Subscription in mobile menu */}
          <Link
            href="/subscription"
            className="flex items-center gap-2 text-xl font-bold text-purple-400"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Crown className="w-5 h-5" /> Premium
          </Link>

          <div className="h-px w-20 bg-border my-2" />

          {user ? (
            <>
              <Link
                href={
                  user.role === "ADMIN" ? "/admin/dashboard" : "/user/dashboard"
                }
                className="flex items-center gap-2 text-2xl font-bold text-blue-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LayoutDashboard className="w-5 h-5" />
                {user.role === "ADMIN" ? "Admin Panel" : "Dashboard"}
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-2xl font-medium text-destructive"
              >
                <LogOut className="w-6 h-6" /> Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-2 text-2xl font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogIn className="w-6 h-6" /> Sign In
              </Link>
              <Link
                href="/register"
                className="bg-primary text-primary-foreground text-xl font-bold py-4 px-10 rounded-full shadow-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
