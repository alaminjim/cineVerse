/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { authService } from "@/services/auth.service";
import SearchBar from "@/components/shared/SearchBar";
import {
  Menu,
  X,
  LogIn,
  LogOut,
  Film,
  Crown,
  LayoutDashboard,
  User as UserIcon,
  Settings,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
    { name: "Trending", path: "/trending" },
    { name: "Blog", path: "/blog" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-black/95 backdrop-blur-md border-white/10 py-4 shadow-lg"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-1.5 md:gap-2 group z-50 shrink-0">
          <div className="bg-primary/20 p-1 rounded-lg md:p-1.5 transition-colors group-hover:bg-primary/30">
            <img
              src="/logo.png"
              alt="CineVerse Logo"
              className="w-6 h-6 md:w-8 md:h-8 object-contain rounded-md"
            />
          </div>
          <span className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-white">
            Cine<span className="text-primary italic">Verse</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-6 xl:gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`relative text-[13px] xl:text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:text-primary ${
                isActive(link.path) ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3 lg:gap-5 shrink-0">
          {/* Search Bar */}
          <SearchBar />
          
          {/* Subscription Button — always visible */}
          <Link
            href="/subscription"
            className={`flex items-center gap-2 text-[10px] lg:text-xs font-black uppercase tracking-[0.1em] px-4 py-2.5 lg:px-6 lg:py-3 rounded-xl border transition-all ${
              isActive("/subscription")
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-[0_0_20px_rgba(147,51,234,0.2)]"
                : "border-purple-500/20 bg-white/5 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/40"
            }`}
          >
            <Crown className="w-3.5 h-3.5" /> Premium
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/5 transition-all text-white border border-white/10"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center font-bold text-xs">
                  {user.name?.[0].toUpperCase()}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold truncate max-w-[80px]">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{user.role?.toLowerCase()}</p>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-[-1]" 
                      onClick={() => setIsProfileOpen(false)}
                    />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-[#0f1117] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
                      >
                      <div className="px-3 py-2 border-b border-border/50 mb-1">
                        <p className="text-xs font-bold text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                      </div>

                      <Link
                        href={user.role === "ADMIN" ? "/admin/dashboard" : "/user/dashboard"}
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl hover:bg-white/5 transition-colors group"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        href={user.role === "ADMIN" ? "/admin/profile" : "/user/profile"}
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl hover:bg-white/5 transition-colors group"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <UserIcon className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                        <span>My Profile</span>
                      </Link>

                      {user.role === "ADMIN" && (
                        <Link
                          href="/admin/settings"
                          className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl hover:bg-white/5 transition-colors group"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                          <span>Settings</span>
                        </Link>
                      )}

                      <div className="h-px bg-border/50 my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive rounded-xl hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-xs lg:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </Link>
              <Link
                href="/register"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs lg:text-sm font-medium py-2 lg:py-2.5 px-4 lg:px-6 rounded-full transition-all shadow-md active:scale-95"
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
        <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-black flex flex-col items-center justify-center gap-8 animate-in slide-in-from-top duration-300">
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

          {/* Search in mobile menu */}
          <div onClick={() => setIsMobileMenuOpen(false)}>
            <SearchBar />
          </div>

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
