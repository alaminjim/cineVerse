"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bookmark,
  UserCircle,
  Film,
  ChevronLeft,
  LogOut,
  ShoppingBag,
  Crown,
  Menu,
  X,
  Loader2,
} from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { authService } from "@/services/auth.service";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

const sidebarLinks = [
  { href: "/user/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/user/watchlist", label: "Watchlist", icon: Bookmark },
  { href: "/user/purchases", label: "Purchase History", icon: ShoppingBag },
  { href: "/user/subscriptions", label: "My Subscription", icon: Crown },
  { href: "/user/profile", label: "Profile", icon: UserCircle },
];

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Client-side auth guard
  useEffect(() => {
    const checkAuth = async () => {
      if (user) {
        setAuthChecked(true);
        return;
      }
      try {
        const res = await authService.getMe();
        if (res?.success && res.data) {
          setUser(res.data);
          setAuthChecked(true);
        } else {
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          logout();
          toast.error("Please login to access dashboard");
          router.replace("/login");
        }
      } catch {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        logout();
        router.replace("/login");
      }
    };
    checkAuth();
  }, [user, setUser, logout, router]);

  if (!authChecked) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black">
        <Loader2 className="animate-spin text-blue-500 w-12 h-12 mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Verifying access...</p>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-black flex overflow-x-hidden">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 w-full h-16 bg-[#0A0A0A] border-b border-gray-800/50 flex items-center justify-between px-6 z-40">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
            <Film className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-white font-black text-base tracking-tight italic">CineVerse</h1>
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-45 lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-[#0A0A0A] border-r border-gray-800/50 flex flex-col fixed h-screen z-50 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-gray-800/50 flex items-center justify-between lg:block">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-black text-lg tracking-tight">CineVerse</h1>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">My Dashboard</p>
            </div>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/20"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800/50 space-y-2">
          {user?.role === "ADMIN" && (
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-bold transition-all px-4 py-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin Panel
            </Link>
          )}
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm transition-all px-4 py-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-gray-500 hover:text-red-500 text-sm transition-all px-4 py-2 text-left"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-4 sm:p-8 md:p-12">{children}</div>
      </main>
    </div>
  );
}
