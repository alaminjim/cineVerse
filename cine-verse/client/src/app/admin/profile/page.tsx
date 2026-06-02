"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { 
  ShieldCheck, 
  Settings, 
  Activity, 
  Users, 
  Film, 
  Star,
  Loader2,
  Calendar,
  Mail,
  User as UserIcon,
  ShoppingBag
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminProfilePage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center bg-black">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white pt-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Header Section */}
          <div className="lg:col-span-12 mb-6">
             <div className="flex items-center gap-4">
                <div className="bg-gradient-to-tr from-purple-600 to-pink-600 p-3 rounded-2xl shadow-xl shadow-purple-600/20">
                   <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <div>
                   <h1 className="text-4xl font-black uppercase italic tracking-tighter">Admin <span className="text-purple-500">Identity.</span></h1>
                   <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Superuser access & settings overview</p>
                </div>
             </div>
          </div>

          {/* Left Column: Profile Card */}
          <div className="lg:col-span-4 space-y-6">
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-gray-900/40 border border-gray-800/50 rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-8 h-full w-2 bg-gradient-to-b from-purple-600 to-pink-600 opacity-20" />
                
                <div className="flex flex-col items-center text-center">
                   <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 p-1 mb-6">
                      <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center font-black text-4xl border-4 border-gray-900">
                         {user?.name?.[0].toUpperCase()}
                      </div>
                   </div>
                   <h2 className="text-2xl font-black uppercase text-white mb-2">{user?.name}</h2>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-purple-600 text-white px-4 py-1 rounded-full mb-8">Administrator</span>
                </div>

                <div className="space-y-4 pt-8 border-t border-gray-800/50">
                   <div className="flex items-center gap-4 text-sm">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-300 font-medium truncate">{user?.email}</span>
                   </div>
                   <div className="flex items-center gap-4 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-300 font-medium">Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                   </div>
                </div>

                <Link href="/admin/settings" className="block w-full mt-10">
                   <button className="w-full py-4 bg-white text-black font-black uppercase italic tracking-widest text-[10px] rounded-2xl hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-2">
                       <Settings className="w-4 h-4" /> System Settings
                   </button>
                </Link>
             </motion.div>
          </div>

          {/* Right Column: Admin Quick Actions & Stats */}
          <div className="lg:col-span-8 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Movies Managed", icon: Film, value: "100+", link: "/admin/movies", color: "blue" },
                  { label: "User Management", icon: Users, value: "Verified", link: "/admin/users", color: "purple" },
                  { label: "Active Revenue", icon: ShoppingBag, value: "Real-time", link: "/admin/activity", color: "emerald" },
                  { label: "Personal Dashboard", icon: Activity, value: "Active", link: "/admin/dashboard", color: "pink" }
                ].map((action, i) => (
                  <Link key={i} href={action.link}>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-gray-900/20 border border-gray-800/50 rounded-3xl p-6 flex items-center justify-between group cursor-pointer"
                    >
                       <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl bg-gray-800 group-hover:bg-${action.color}-600/20 group-hover:text-${action.color}-400 transition-all`}>
                             <action.icon className="w-5 h-5" />
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-0.5">{action.label}</p>
                             <p className="font-bold text-white uppercase italic">{action.value} <span className="opacity-0 group-hover:opacity-100 transition-all font-normal">→</span></p>
                          </div>
                       </div>
                    </motion.div>
                  </Link>
                ))}
             </div>

             <div className="bg-gradient-to-r from-gray-900/60 to-purple-900/20 border border-gray-800/50 rounded-[2.5rem] p-12 relative overflow-hidden">
                <div className="relative z-10">
                   <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-4">Security Lockdown Level</h3>
                   <p className="text-gray-400 text-sm font-medium max-w-lg mb-8">
                      Your administrator privileges allow you to override system blocks, manage movie pricing, andmoderate all user reviews. 
                      Please ensure all actions adhere to the <span className="text-white font-bold underline">Platform Governance Policy.</span>
                   </p>
                   <div className="flex gap-4">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-400 bg-green-400/10 px-4 py-2 rounded-full border border-green-400/20">
                         <Star className="w-3 h-3 fill-current" /> High Clearance
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-400/10 px-4 py-2 rounded-full border border-blue-400/20">
                         2FA ENABLED
                      </div>
                   </div>
                </div>
                <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-5 pointer-events-none p-12">
                   <ShieldCheck className="w-64 h-64 text-white" />
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
