"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { 
  User as UserIcon, 
  Settings, 
  Film, 
  Star, 
  ShoppingBag, 
  History, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { userService } from "@/services/user.service";

export default function UserProfilePage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await userService.getUserDashboard();
        if (res.success) {
          setStats(res.data);
        }
      } catch (error) {
        console.error("Profile stats error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
      </div>
    );
  }

  const userStats = stats?.stats || {};

  return (
    <div className="bg-black min-h-screen text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar / Left Column */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900/40 border border-gray-800/50 rounded-[2.5rem] p-10 flex flex-col items-center text-center relative overflow-hidden backdrop-blur-xl"
            >
              <div className="absolute top-0 right-0 p-6">
                 <div className="bg-purple-600/20 text-purple-400 p-2 rounded-xl border border-purple-500/20">
                    <ShieldCheck className="w-5 h-5" />
                 </div>
              </div>

              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-blue-600 p-1.5 mb-6 shadow-2xl shadow-purple-500/30">
                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center border-4 border-gray-900 overflow-hidden">
                   <span className="text-5xl font-black text-white">{user?.name?.[0]?.toUpperCase() || "U"}</span>
                </div>
              </div>

              <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2">{user?.name}</h1>
              <p className="text-gray-500 font-medium text-sm mb-8">{user?.email}</p>

              <div className="w-full grid grid-cols-2 gap-4">
                 <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Status</p>
                    <p className="text-xs font-bold text-green-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                       <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                       Active
                    </p>
                 </div>
                 <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Rank</p>
                    <p className="text-xs font-bold text-purple-400 uppercase tracking-widest">{stats?.subscription ? stats.subscription.planType : "Basic"}</p>
                 </div>
              </div>

              <Link 
                href="/user/dashboard" 
                className="w-full mt-8 py-4 bg-white text-black font-black uppercase italic tracking-widest rounded-2xl hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Go to Dashboard
              </Link>
            </motion.div>

            <div className="bg-gray-900/40 border border-gray-800/50 rounded-3xl p-8 space-y-6 backdrop-blur-xl">
               <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Account Stats</h3>
               <div className="space-y-4">
                  {[
                    { label: "Watchlist Items", value: userStats.watchlistCount || 0, icon: Film },
                    { label: "Reviews Posted", value: userStats.totalReviews || 0, icon: Star },
                    { label: "Total Spent", value: `৳${userStats.totalSpent || 0}`, icon: ShoppingBag }
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                       <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-gray-800 text-gray-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
                             <stat.icon className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{stat.label}</span>
                       </div>
                       <span className="text-sm font-black text-white">{stat.value}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Main Content / Right Column */}
          <div className="lg:col-span-8 space-y-10">
            <div className="flex items-center gap-4 mb-2">
               <div className="bg-purple-600 p-2.5 rounded-xl">
                  <Zap className="w-6 h-6 text-white" />
               </div>
               <div>
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter">Your <span className="text-purple-500">CineSync.</span></h2>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Personal collection and activity history</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Recent Content */}
               <Link href="/user/watchlist">
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.1 }}
                   className="bg-gray-900/40 border border-gray-800/50 rounded-3xl p-8 backdrop-blur-xl group hover:border-purple-500/30 transition-all cursor-pointer h-full"
                 >
                   <div className="flex items-center justify-between mb-8">
                      <History className="w-6 h-6 text-purple-400" />
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2">My Collections</h3>
                   <p className="text-gray-500 text-sm font-medium">Items you've saved for later. {userStats.watchlistCount || 0} movies in list.</p>
                 </motion.div>
               </Link>

               {/* Purchases */}
               <Link href="/user/purchases">
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2 }}
                   className="bg-gray-900/40 border border-gray-800/50 rounded-3xl p-8 backdrop-blur-xl group hover:border-blue-500/30 transition-all cursor-pointer h-full"
                 >
                   <div className="flex items-center justify-between mb-8">
                      <ShoppingBag className="w-6 h-6 text-blue-400" />
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2">My Purchases</h3>
                   <p className="text-gray-500 text-sm font-medium">Access your lifetime library. {userStats.totalPurchases || 0} items purchased.</p>
                 </motion.div>
               </Link>
            </div>

            {/* Achievement / Membership Card */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-purple-900/40 via-purple-600/10 to-blue-900/40 border border-purple-500/20 p-12"
            >
               <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full" />
               <div className="relative z-10">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-4">
                    {stats?.subscription ? `${stats.subscription.planType} Membership` : "Free Tier"}
                  </h3>
                  <p className="text-gray-400 text-sm font-medium max-w-lg mb-8">
                     {stats?.subscription 
                       ? `Your premium subscription is active until ${new Date(stats.subscription.endDate).toLocaleDateString()}. Enjoy ad-free streaming and early access.`
                       : "Upgrade to Premium to unlock ad-free streaming, early access to new releases, and priority support."}
                  </p>
                  <Link href="/subscription">
                    <button className="bg-purple-600 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition-all">
                       {stats?.subscription ? "Manage Plans" : "Upgrade Now"}
                    </button>
                  </Link>
               </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
