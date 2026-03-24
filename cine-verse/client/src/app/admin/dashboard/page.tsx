/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import {
  Film,
  Users,
  Star,
  DollarSign,
  TrendingUp,
  Crown,
  ShoppingBag,
  Loader2,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getAnalyticsStats();
        setStats(res?.data || null);
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
      </div>
    );

  const statCards = [
    { label: "Total Movies", value: stats?.totalMovies || 0, icon: Film, color: "from-purple-600 to-blue-600" },
    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "from-blue-600 to-cyan-600" },
    { label: "Total Reviews", value: stats?.totalReviews || 0, icon: Star, color: "from-yellow-600 to-orange-600" },
    { label: "Revenue", value: `৳${stats?.revenue?.total || 0}`, icon: DollarSign, color: "from-green-600 to-emerald-600" },
    { label: "Active Subscriptions", value: stats?.totalSubscriptions || 0, icon: Crown, color: "from-pink-600 to-rose-600" },
    { label: "Total Purchases", value: stats?.totalPurchases || 0, icon: ShoppingBag, color: "from-indigo-600 to-violet-600" },
  ];

  return (
    <div className="text-white">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">Platform overview and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6 hover:border-gray-700/50 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                  {card.label}
                </span>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-3xl font-black text-white">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* User Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">Active Users</p>
          <p className="text-2xl font-black text-green-400">{stats?.totalStatus || 0}</p>
        </div>
        <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">Banned Users</p>
          <p className="text-2xl font-black text-red-400">{stats?.totalStatus1 || 0}</p>
        </div>
        <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">Deleted Users</p>
          <p className="text-2xl font-black text-gray-400">{stats?.totalStatus2 || 0}</p>
        </div>
      </div>

      {/* Top Rated & Most Reviewed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Rated */}
        <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-yellow-500" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Top Rated Movies</h3>
          </div>
          <div className="space-y-4">
            {stats?.topRatedMovies?.map((movie: any, i: number) => (
              <div key={movie.id} className="flex items-center gap-4">
                <span className="text-gray-600 font-black text-lg w-6">{i + 1}</span>
                <img src={movie.thumbnail} alt={movie.title} className="w-12 h-16 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm truncate">{movie.title}</p>
                  <p className="text-gray-500 text-xs">{movie.reviewCount} reviews</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-yellow-500 font-bold text-sm">{movie.avgRating?.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Recent Users</h3>
          </div>
          <div className="space-y-4">
            {stats?.recentUsers?.map((u: any) => (
              <div key={u.id} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {u.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm truncate">{u.name}</p>
                  <p className="text-gray-500 text-xs truncate">{u.email}</p>
                </div>
                <span className="text-gray-600 text-xs">
                  {new Date(u.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
