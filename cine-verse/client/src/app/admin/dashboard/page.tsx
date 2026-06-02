/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import Link from "next/link";
import {
  Film,
  Users,
  Star,
  DollarSign,
  TrendingUp,
  Crown,
  ShoppingBag,
  Loader2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  MoreHorizontal,
  Plus,
  Search,
  Bell,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uptime, setUptime] = useState("24:08");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '1'); // Small offset to avoid 00:00 immediately
      setUptime(`${h}:${m}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const mainStats = [
    { label: "Total Revenue", value: `৳${stats?.revenue?.total || 0}`, icon: DollarSign, trend: "+12.5%", color: "emerald" },
    { label: "Active Users", value: stats?.totalUsers || 0, icon: Users, trend: "+5.2%", color: "blue" },
    { label: "New Releases", value: stats?.totalMovies || 0, icon: Film, trend: "+2", color: "purple" },
    { label: "Avg Rating", value: "8.4", icon: Star, trend: "+0.1", color: "yellow" },
  ];

  return (
    <div className="text-white space-y-10 pb-20">
      
      {/* Top Header */}
      <div className="hidden lg:flex items-center justify-between mb-8">
         <div className="relative w-96 flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search platform analytics..." 
              className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-purple-600/50 transition-all font-medium placeholder:text-gray-600"
            />
         </div>
         <div className="flex items-center gap-6">
            <button className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-500 hover:text-white hover:border-gray-700 transition-all relative">
               <Bell className="w-5 h-5" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-purple-600 rounded-full border-2 border-gray-900" />
            </button>
            <div className="flex items-center gap-3">
               <div className="text-right">
                  <p className="text-sm font-black text-white italic tracking-tighter uppercase">Admin Panel</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">Super Admin</p>
               </div>
               <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 p-0.5 shadow-lg shadow-purple-600/20">
                  <div className="w-full h-full rounded-[10px] bg-gray-900 flex items-center justify-center font-black text-xs">A</div>
               </div>
            </div>
         </div>
      </div>

      <div className="flex flex-col gap-2 mb-10">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
          Dashboard <span className="text-purple-500">Overview.</span>
        </h1>
        <p className="text-gray-500 text-sm font-medium">Plan, monitor, and scale your content ecosystem with ease.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        {mainStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.label}
              className="bg-gray-900/40 border border-gray-800/50 rounded-[2rem] p-8 hover:border-gray-700/50 transition-all group backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                  <ArrowUpRight className="w-3 h-3 text-green-500" />
                  <span className="text-[10px] font-black text-green-500">{stat.trend}</span>
                </div>
              </div>
              <p className="text-4xl font-black text-white mb-2 tracking-tighter leading-none">{stat.value}</p>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
        {/* Analytics Chart */}
        <motion.div className="xl:col-span-2 bg-gray-900/40 border border-gray-800/50 rounded-[2.5rem] p-10 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Platform Analytics</h3>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Revenue performance</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData?.revenueStats || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="date" stroke="#525252" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                <Tooltip 
                  cursor={{ stroke: '#8b5cf6', strokeWidth: 2 }}
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #262626', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRev)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pulse & Actions */}
        <motion.div className="bg-gray-900/40 border border-gray-800/50 rounded-[2.5rem] p-10 flex flex-col backdrop-blur-xl">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Content Pulse</h3>
              <MoreHorizontal className="text-gray-600" />
           </div>
           <div className="flex-1 space-y-6">
              <Link href="/admin/reviews" className="p-6 bg-purple-600/10 border border-purple-500/20 rounded-3xl group cursor-pointer hover:bg-purple-600 transition-all block">
                <div className="flex items-start justify-between mb-2">
                   <h4 className="text-sm font-bold text-white group-hover:text-white transition-colors">Review Moderation</h4>
                   <Clock className="w-4 h-4 text-purple-400 group-hover:text-white transition-colors" />
                </div>
                <p className="text-xs text-gray-400 group-hover:text-purple-100 transition-colors mb-4 italic">
                  {stats?.pendingReviews || 0} reviews pending action.
                </p>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 group-hover:bg-white text-white group-hover:text-black text-[9px] font-black uppercase tracking-widest rounded-lg w-fit transition-all">
                   Manage Reviews
                </div>
              </Link>
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600 leading-none">Quick Actions</h3>
                 <div className="grid grid-cols-2 gap-3">
                    <Link href="/admin/movies" className="flex flex-col items-center gap-3 p-4 bg-gray-800/40 border border-gray-700/50 rounded-2xl hover:border-purple-500/50 transition-all group">
                       <Plus className="w-4 h-4 text-gray-500 group-hover:text-purple-500" />
                       <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-white">Add Movie</span>
                    </Link>
                    <Link href="/admin/activity" className="flex flex-col items-center gap-3 p-4 bg-gray-800/40 border border-gray-700/50 rounded-2xl hover:border-blue-500/50 transition-all group">
                       <Calendar className="w-4 h-4 text-gray-500 group-hover:text-blue-500" />
                       <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-white">Activity</span>
                    </Link>
                 </div>
              </div>
           </div>
           <Link href="/admin/activity" className="mt-8 pt-8 border-t border-gray-800/50 text-center block">
              <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest hover:underline">View Notifications</p>
           </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {/* Top Content */}
         <div className="bg-gray-900/40 border border-gray-800/50 rounded-[2.5rem] p-10 backdrop-blur-xl">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-8">Top Content</h3>
            <div className="space-y-6">
               {stats?.topRatedMovies?.slice(0, 4).map((movie: any) => (
                 <div key={movie.id} className="flex items-center gap-4 group">
                    <div className="w-12 h-16 rounded-xl overflow-hidden border border-gray-800 shrink-0">
                       <img src={movie.thumbnail} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="font-bold text-white text-sm truncate">{movie.title}</p>
                       <p className="text-[9px] text-gray-500 font-bold uppercase">{movie.reviewCount} Ratings</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500/10 rounded-xl">
                       <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                       <span className="text-[10px] font-black text-yellow-500">{movie.avgRating?.toFixed(1)}</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* System Health */}
         <div className="bg-gray-900/40 border border-gray-800/50 rounded-[2.5rem] p-10 flex flex-col backdrop-blur-xl items-center">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-8 self-start">System Health</h3>
            <div className="relative w-44 h-44 flex items-center justify-center">
               <svg className="w-full h-full -rotate-90">
                  <circle cx="88" cy="88" r="80" stroke="#1f2937" strokeWidth="12" fill="transparent" />
                  <circle 
                    cx="88" cy="88" r="80" stroke="#8b5cf6" strokeWidth="12" fill="transparent" 
                    strokeDasharray={2 * Math.PI * 80} 
                    strokeDashoffset={2 * Math.PI * 80 * (1 - (stats?.systemHealth?.score / 100 || 0.84))} 
                  />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-4xl font-black text-white italic">{stats?.systemHealth?.score || 84}%</p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">{stats?.systemHealth?.status || "Stable"}</p>
               </div>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-6 w-full">
               <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                     <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
                     <span className="text-xs font-bold text-white">{stats?.systemHealth?.database || "Online"}</span>
                  </div>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">Database</p>
               </div>
               <div className="text-center border-l border-gray-800">
                  <div className="flex items-center justify-center gap-2 mb-1">
                     <span className="text-xs font-bold text-white">{stats?.systemHealth?.latency || "41ms"}</span>
                  </div>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">Latency</p>
               </div>
            </div>
         </div>

         {/* Uptime */}
         <div className="bg-gray-950 border border-gray-800/50 rounded-[2.5rem] p-10 flex flex-col backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-white/10 group-hover:text-purple-500 transition-all">
               <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-10">Uptime Timer</h3>
            <div className="flex-1 flex flex-col justify-center">
               <p className="text-[4.5rem] font-black text-white italic tracking-tighter leading-none mb-6">{uptime}</p>
               <div className="flex items-center gap-4">
                  <div className="px-6 py-2 bg-purple-600 rounded-xl text-white font-black text-[10px] uppercase tracking-widest cursor-pointer hover:bg-purple-700 transition-all shadow-xl shadow-purple-600/20">Monitor Live</div>
                  <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-red-500 font-black cursor-pointer hover:bg-gray-800 transition-all">OFF</div>
               </div>
            </div>
            <div className="mt-10 flex items-end gap-1 h-12 overflow-hidden opacity-30 group-hover:opacity-100 transition-all">
               {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85].map((h, i) => (
                  <div key={i} className="flex-1 bg-purple-600 rounded-t-sm" style={{ height: `${h}%` }} />
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
