"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardCheck,
  Activity,
  Film,
  ChevronLeft,
  Video,
  Users,
  LogOut,
  User,
  ShoppingBag,
  Crown,
  Menu,
  X,
} from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { authService } from "@/services/auth.service";
import toast from "react-hot-toast";
import { useState } from "react";

const sidebarLinks = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/movies", label: "Manage Movies", icon: Video },
  { href: "/admin/users", label: "Manage Users", icon: Users },
  { href: "/admin/reviews", label: "Pending Reviews", icon: ClipboardCheck },
  { href: "/admin/activity", label: "Activity Logs", icon: Activity },
  { href: "/admin/my-activity", label: "Personal Dashboard", icon: User },
  { href: "/admin/purchases", label: "Purchase History", icon: ShoppingBag },
  { href: "/admin/subscriptions", label: "My Subscription", icon: Crown },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
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
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-black text-lg tracking-tight">CineVerse</h1>
              <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Admin Panel</p>
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
                    ? "bg-purple-600/15 text-purple-400 border border-purple-500/20"
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
