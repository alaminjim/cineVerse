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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartRes] = await Promise.all([
          adminService.getAnalyticsStats(),
          adminService.getChartData(),
        ]);
        setStats(statsRes?.data || null);
        setChartData(chartRes?.data || null);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={card.label}
              className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6 hover:border-gray-700/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                  {card.label}
                </span>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-3xl font-black text-white">{card.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Revenue Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900/40 border border-gray-800/50 rounded-3xl p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Revenue Trend (7 Days)</h3>
            <div className="bg-green-500/10 text-green-400 text-[10px] font-bold px-2 py-1 rounded-full border border-green-500/20">
              Real-time Data
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData?.revenueStats || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                <YAxis stroke="#9ca3af" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
                  itemStyle={{ color: '#10b981', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* User Stats Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900/40 border border-gray-800/50 rounded-3xl p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">User Signups (7 Days)</h3>
            <div className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-1 rounded-full border border-blue-500/20">
              New Growth
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData?.userStats || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                <YAxis stroke="#9ca3af" fontSize={10} />
                <Tooltip 
                  cursor={{ fill: '#374151', opacity: 0.1 }}
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
                  itemStyle={{ color: '#8b5cf6', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Bar dataKey="users" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
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
