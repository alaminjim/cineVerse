"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { authService } from "@/services/auth.service";
import { Search, Menu, X, LogIn, LogOut, Film } from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();

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
    router.push("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-border py-4 shadow-sm"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group z-50">
          <div className="bg-primary/20 p-2 rounded-lg text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Film className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            Cine<span className="text-primary">Verse</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          <Link
            href="/"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/movies"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Movies
          </Link>
          <Link
            href="/series"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Series
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
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
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-2.5 px-6 rounded-full transition-all"
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
        <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-background flex flex-col items-center justify-center gap-8">
          <Link
            href="/"
            className="text-2xl font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/movies"
            className="text-2xl font-medium text-muted-foreground"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Movies
          </Link>
          <Link
            href="/series"
            className="text-2xl font-medium text-muted-foreground"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Series
          </Link>
          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-2xl font-medium mt-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-6 h-6" /> Log Out
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-2 text-2xl font-medium mt-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogIn className="w-6 h-6" /> Sign In
              </Link>
              <Link
                href="/register"
                className="bg-primary text-primary-foreground text-xl font-medium py-4 px-10 rounded-full mt-4"
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
