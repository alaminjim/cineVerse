/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import Link from "next/link";
import {
  Loader2,
  Star,
  ShoppingBag,
  Bookmark,
  Crown,
  DollarSign,
  Clock,
  TrendingUp,
  Activity,
  ArrowUpRight,
  MonitorPlay
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// --- Mock Data for Charts ---
const activityData = [
  { name: "Oct", watchHours: 24, reviews: 4 },
  { name: "Nov", watchHours: 35, reviews: 7 },
  { name: "Dec", watchHours: 18, reviews: 2 },
  { name: "Jan", watchHours: 42, reviews: 9 },
  { name: "Feb", watchHours: 30, reviews: 5 },
  { name: "Mar", watchHours: 55, reviews: 12 },
];

const engagementData = [
  { day: "Mon", score: 40 },
  { day: "Tue", score: 85 },
  { day: "Wed", score: 45 },
  { day: "Thu", score: 60 },
  { day: "Fri", score: 90 },
  { day: "Sat", score: 110 },
  { day: "Sun", score: 70 },
];

const genreData = [
  { name: "Action", value: 35 },
  { name: "Sci-Fi", value: 25 },
  { name: "Drama", value: 20 },
  { name: "Thriller", value: 20 },
];

const COLORS = ["#8b5cf6", "#ec4899", "#f59e0b", "#3b82f6"];

export default function UserDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await userService.getUserDashboard();
        setData(res?.data || null);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
      </div>
    );

  const stats = data?.stats;

  const topCards = [
    {
      label: "Total Spent",
      value: `৳${stats?.totalSpent || 0}`,
      trend: "+12.5%",
      positive: true,
      icon: DollarSign,
      color: "text-emerald-400",
      bgInfo: "bg-emerald-500/10",
    },
    {
      label: "Total Reviews",
      value: stats?.totalReviews || 0,
      trend: "+4.2%",
      positive: true,
      icon: Star,
      color: "text-yellow-400",
      bgInfo: "bg-yellow-500/10",
    },
    {
      label: "Active Rentals",
      value: stats?.activeRentals || 0,
      trend: "Current",
      positive: true,
      icon: Clock,
      color: "text-orange-400",
      bgInfo: "bg-orange-500/10",
    },
    {
      label: "Watchlist Items",
      value: stats?.watchlistCount || 0,
      trend: "+8 new",
      positive: true,
      icon: Bookmark,
      color: "text-purple-400",
      bgInfo: "bg-purple-500/10",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <div className="text-white pb-10">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white">
            Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
            Welcome back, <span className="font-semibold text-white">{data?.user?.name || "User"}</span>
            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
            {data?.user?.email}
          </p>
        </div>

        {data?.subscription ? (
          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600/15 to-pink-600/15 border border-purple-500/30 px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.15)]">
            <Crown className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm font-bold uppercase tracking-wider">
              {data.subscription.planType} Plan
            </span>
          </div>
        ) : (
          <Link
            href="/subscription"
            className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-xl hover:bg-gray-200 transition-all font-bold text-sm shadow-xl hover:shadow-white/20"
          >
            <Crown className="w-4 h-4" />
            Upgrade Plan
          </Link>
        )}
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-[#0f0f13] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${card.bgInfo} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${card.color}`} />
                    </div>
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                      {card.label}
                    </span>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-black text-white tracking-tight">{card.value}</p>
                  <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-[10px] font-bold">{card.trend}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Area Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-[#0f0f13] border border-white/5 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-white font-bold tracking-wide flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" /> Activity Overview
                </h3>
                <p className="text-xs text-gray-400 mt-1">Watch hours & reviews over last 6 months</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Watch Hours</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-pink-500"></div> Reviews</div>
              </div>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWatch" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorReview" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Area type="monotone" dataKey="watchHours" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorWatch)" />
                  <Area type="monotone" dataKey="reviews" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorReview)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Bar Chart - Engagement */}
          <motion.div variants={itemVariants} className="bg-[#0f0f13] border border-white/5 rounded-2xl p-6 shadow-lg">
             <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-white font-bold tracking-wide">Weekly Engagement</h3>
                <p className="text-xs text-gray-400 mt-1">Daily interactions</p>
              </div>
            </div>
            <div className="flex items-end gap-2 mb-6">
              <span className="text-3xl font-black">8.4k</span>
              <span className="text-emerald-400 text-xs font-bold mb-1 flex items-center"><ArrowUpRight className="w-3 h-3" /> 12%</span>
            </div>
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 10 }} dy={10} />
                  <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: "#18181b", border: "none", borderRadius: "8px" }} />
                  <Bar dataKey="score" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Genre Pie Chart */}
          <motion.div variants={itemVariants} className="bg-[#0f0f13] border border-white/5 rounded-2xl p-6 shadow-lg">
             <h3 className="text-white font-bold tracking-wide mb-6">Genre Preferences</h3>
             <div className="h-[200px] w-full relative">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={genreData}
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                     stroke="none"
                   >
                     {genreData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <RechartsTooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
                 </PieChart>
               </ResponsiveContainer>
               {/* Center Text */}
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                 <span className="text-2xl font-black text-white">4</span>
                 <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Top Genres</span>
               </div>
             </div>
             <div className="grid grid-cols-2 gap-4 mt-4">
                {genreData.map((genre, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[i] }}></div>
                    <span className="text-xs text-gray-400 font-medium">{genre.name}</span>
                    <span className="text-xs text-white font-bold ml-auto">{genre.value}%</span>
                  </div>
                ))}
             </div>
          </motion.div>

          {/* Recent List (Purchases/Activities) */}
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-[#0f0f13] border border-white/5 rounded-2xl p-6 shadow-lg flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold tracking-wide">Recent Transactions</h3>
              <Link href="/user/purchases" className="text-xs font-bold text-purple-400 hover:text-purple-300">View All</Link>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-gray-500 uppercase tracking-widest bg-white/5">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg font-semibold">Movie</th>
                    <th className="px-4 py-3 font-semibold">Type</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold rounded-r-lg text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data?.recentPurchases?.length > 0 ? (
                    data.recentPurchases.map((purchase: any, index: number) => (
                      <tr key={purchase.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden">
                              {purchase.movie?.thumbnail ? (
                                <img src={purchase.movie.thumbnail} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <MonitorPlay className="w-4 h-4 text-gray-500" />
                              )}
                            </div>
                            <span className="font-semibold text-white truncate max-w-[150px]">{purchase.movie?.title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-400 font-medium text-xs">
                          {purchase.purchaseType === "BUY" ? "Lifetime Access" : "Rental"}
                        </td>
                        <td className="px-4 py-3">
                           <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400">
                             Completed
                           </span>
                        </td>
                        <td className="px-4 py-3 text-right font-black text-white">
                          ৳{purchase.amount}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500 text-sm">
                        No recent transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
