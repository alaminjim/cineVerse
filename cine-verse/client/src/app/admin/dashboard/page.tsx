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
    { label: "Total Revenue", value: `৳${stats?.revenue?.total || 0}`, icon: DollarSign, trend: "+12.5%", color: "emerald", chart: "colorRev" },
    { label: "Active Users", value: stats?.totalUsers || 0, icon: Users, trend: "+5.2%", color: "blue", chart: "colorUsers" },
    { label: "New Releases", value: stats?.totalMovies || 0, icon: Film, trend: "+2", color: "purple", chart: "colorMovies" },
    { label: "Avg Rating", value: "8.4", icon: Star, trend: "+0.1", color: "yellow", chart: "colorRatings" },
  ];

  return (
    <div className="text-white space-y-10 pb-20">
      
      {/* Top Header - Search & Profile (Desktop View) */}
      <div className="hidden lg:flex items-center justify-between mb-8">
         <div className="relative w-96 flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search platform analytics..." 
              className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-purple-600/50 transition-all font-medium placeholder:text-gray-600"
            />
            <div className="absolute right-4 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-[10px] text-gray-400 font-bold uppercase tracking-tighter">⌘ F</div>
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

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        {mainStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.label}
              className="bg-gray-900/40 border border-gray-800/50 rounded-[2rem] p-8 hover:border-gray-700/50 transition-all group relative overflow-hidden backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 border border-${stat.color}-500/20 flex items-center justify-center text-${stat.color}-500 group-hover:scale-110 transition-transform`}>
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
        {/* Large Analytics Chart (Col Span 2) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="xl:col-span-2 bg-gray-900/40 border border-gray-800/50 rounded-[2.5rem] p-10 backdrop-blur-xl"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter text-white mb-1">Platform Analytics</h3>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Revenue and engagement performance</p>
            </div>
            <div className="flex items-center gap-2 bg-gray-950 p-1.5 rounded-2xl border border-gray-800">
               <button className="px-5 py-2.5 bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-purple-600/20">Monthly</button>
               <button className="px-5 py-2.5 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:text-white transition-colors">Weekly</button>
            </div>
          </div>

          <div className="h-[350px] w-full mt-4">
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
                <YAxis stroke="#525252" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ stroke: '#8b5cf6', strokeWidth: 2 }}
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #262626', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                  itemStyle={{ color: '#8b5cf6', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRev)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Reminders / Content Pulse (Col Span 1) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900/40 border border-gray-800/50 rounded-[2.5rem] p-10 flex flex-col backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Content Pulse</h3>
             <MoreHorizontal className="text-gray-600 cursor-pointer hover:text-white transition-colors" />
          </div>

          <div className="flex-1 space-y-6">
             <div className="p-6 bg-purple-600/10 border border-purple-500/20 rounded-3xl group cursor-pointer hover:bg-purple-600 transition-all">
                <div className="flex items-start justify-between mb-2">
                   <h4 className="text-sm font-bold text-white group-hover:text-white transition-colors">Review Moderation</h4>
                   <Clock className="w-4 h-4 text-purple-400 group-hover:text-white transition-colors" />
                </div>
                <p className="text-xs text-gray-400 group-hover:text-purple-100 transition-colors mb-4 line-clamp-2">42 pending reviews require AI sentiment validation.</p>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 group-hover:bg-white text-white group-hover:text-black text-[9px] font-black uppercase tracking-widest rounded-lg w-fit transition-all">
                   Start Session
                </div>
             </div>

             <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                   <button className="flex flex-col items-center gap-3 p-4 bg-gray-800/40 border border-gray-700/50 rounded-2xl hover:border-purple-500/50 transition-all group">
                      <Plus className="w-4 h-4 text-gray-500 group-hover:text-purple-500" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-white">Add Content</span>
                   </button>
                   <button className="flex flex-col items-center gap-3 p-4 bg-gray-800/40 border border-gray-700/50 rounded-2xl hover:border-blue-500/50 transition-all group">
                      <Calendar className="w-4 h-4 text-gray-500 group-hover:text-blue-500" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-white">Schedule</span>
                   </button>
                </div>
             </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800/50 text-center">
             <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest cursor-pointer hover:underline">View All Notifications</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {/* Team Collaboration / Top Rated */}
         <div className="lg:col-span-1 bg-gray-900/40 border border-gray-800/50 rounded-[2.5rem] p-10 flex flex-col backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Top Content</h3>
               <button className="p-2 bg-gray-800 rounded-lg hover:text-purple-500 transition-all"><TrendingUp className="w-4 h-4" /></button>
            </div>
            <div className="space-y-6 flex-1">
               {stats?.topRatedMovies?.slice(0, 4).map((movie: any, i: number) => (
                 <div key={movie.id} className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-12 h-16 rounded-xl overflow-hidden border border-gray-800 shrink-0 group-hover:border-purple-500/50 transition-all">
                       <img src={movie.thumbnail} alt={movie.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="font-bold text-white text-sm truncate mb-0.5">{movie.title}</p>
                       <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{movie.reviewCount} Ratings</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                       <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                       <span className="text-[10px] font-black text-yellow-500">{movie.avgRating?.toFixed(1)}</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Project Progress / System Health */}
         <div className="lg:col-span-1 bg-gray-900/40 border border-gray-800/50 rounded-[2.5rem] p-10 flex flex-col backdrop-blur-xl">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-8 text-center md:text-left">System Health</h3>
            
            <div className="flex-1 flex flex-col items-center justify-center py-4">
               <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                     <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-800" />
                     <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={2 * Math.PI * 88} strokeDashoffset={2 * Math.PI * 88 * (1 - 0.84)} className="text-purple-600" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <p className="text-4xl font-black text-white italic tracking-tighter">84%</p>
                     <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Optimized</p>
                  </div>
               </div>
               
               <div className="mt-10 grid grid-cols-2 gap-8 w-full">
                  <div className="text-center">
                     <div className="flex items-center justify-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-purple-600 rounded-full" />
                        <span className="text-xs font-bold text-white">Stable</span>
                     </div>
                     <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Database</p>
                  </div>
                  <div className="text-center border-l border-gray-800">
                     <div className="flex items-center justify-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-gray-700 rounded-full" />
                        <span className="text-xs font-bold text-white">41ms</span>
                     </div>
                     <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Pings</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Time Tracker / Platform Growth */}
         <div className="lg:col-span-1 bg-[#101010] border border-gray-800/50 rounded-[2.5rem] p-10 flex flex-col backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8">
               <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-purple-500 transition-colors">
                  <Clock className="w-6 h-6" />
               </div>
            </div>
            
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-10">Uptime Session</h3>
            
            <div className="flex-1 flex flex-col justify-center">
               <p className="text-[4.5rem] font-black text-white italic tracking-tighter leading-none mb-4">24:08</p>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black cursor-pointer hover:bg-purple-600 hover:text-white transition-all shadow-xl"><Plus className="w-5 h-5 rotate-45" /></div>
                  <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white cursor-pointer hover:bg-red-500 transition-all shadow-xl"><div className="w-3 h-3 bg-white" /></div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] ml-2">Monitor Live</p>
               </div>
            </div>

            <div className="mt-10 overflow-hidden relative h-20">
               <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent" />
               <div className="flex items-end gap-1 h-full">
                  {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85].map((h, i) => (
                    <div key={i} className="flex-1 bg-purple-600/30 rounded-t-md group-hover:bg-purple-600/50 transition-all" style={{ height: `${h}%` }} />
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
