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
} from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { authService } from "@/services/auth.service";

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
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {}
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A0A0A] border-r border-gray-800/50 flex flex-col fixed h-screen z-30">
        <div className="p-6 border-b border-gray-800/50">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-black text-lg tracking-tight">CineVerse</h1>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">My Dashboard</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
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
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-8 md:p-12">{children}</div>
      </main>
    </div>
  );
}
