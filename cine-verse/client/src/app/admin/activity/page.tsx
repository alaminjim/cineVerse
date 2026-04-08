/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import Link from "next/link";
import { 
  Loader2, 
  ChevronLeft, 
  Activity, 
  Search, 
  Calendar as CalendarIcon,
  Filter,
  ArrowRight,
  User,
  Clock,
  History
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminActivityLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await adminService.getActivityLogs(page, 20);
        setLogs(res?.data || []);
        setMeta(res?.meta || null);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [page]);

  if (loading && page === 1)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
      </div>
    );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <div className="text-white pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
           <Link href="/admin/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-4">
              <ChevronLeft className="w-4 h-4" /> Back to Dashboard
           </Link>
           <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white flex items-center gap-4">
             <History className="w-10 h-10 text-purple-500" /> Platform <span className="text-purple-500">History.</span>
           </h1>
           <p className="text-gray-500 text-sm font-medium mt-2">Audit trail of all administrative and community actions.</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input 
                type="text" 
                placeholder="Search logs..." 
                className="bg-gray-900/50 border border-gray-800 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-purple-600/50 transition-all w-64"
              />
           </div>
           <button className="p-3 bg-gray-900 border border-gray-800 rounded-2xl text-gray-500 hover:text-white transition-all">
              <Filter className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-900/40 border border-gray-800/50 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
        <div className="p-8 border-b border-gray-800/50 flex items-center justify-between bg-white/[0.02]">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-500">
                 <Activity className="w-5 h-5" />
              </div>
              <div>
                 <p className="text-sm font-black text-white uppercase tracking-tight">Recent Activity</p>
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Showing {logs.length} operations</p>
              </div>
           </div>
           
           <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs font-bold disabled:opacity-30"
              >
                Prev
              </button>
              <span className="text-xs font-black px-3 text-purple-500">Page {page} of {meta?.totalPages || 1}</span>
              <button 
                onClick={() => setPage(prev => Math.min(meta?.totalPages || 1, prev + 1))}
                disabled={page === meta?.totalPages}
                className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs font-bold disabled:opacity-30"
              >
                Next
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
           <motion.table 
             variants={containerVariants}
             initial="hidden"
             animate="show"
             className="w-full text-left"
           >
             <thead>
                <tr className="bg-white/[0.01]">
                   <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Timestamp</th>
                   <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">User</th>
                   <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Action</th>
                   <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Entity</th>
                   <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Details</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-800/50">
                {logs.length > 0 ? logs.map((log, i) => (
                  <motion.tr 
                    key={log.id} 
                    variants={itemVariants}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-3">
                          <Clock className="w-3.5 h-3.5 text-gray-600" />
                          <span className="text-xs text-gray-400 font-medium">
                            {new Date(log.createdAt).toLocaleString(undefined, { 
                               month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                            })}
                          </span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                             <User className="w-4 h-4 text-gray-500" />
                          </div>
                          <div>
                             <p className="text-xs font-bold text-white uppercase tracking-tight">{log.user.name}</p>
                             <p className="text-[10px] text-gray-600 font-medium">{log.user.email}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="px-2.5 py-1 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest">
                          {log.action}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{log.entityType}:</span>
                          <span className="text-xs font-bold text-gray-300 truncate max-w-[120px]">{log.entityName}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2 group-hover:translate-x-1 transition-transform">
                          <span className="text-[10px] font-black text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Details</span>
                          <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-500 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-lg">
                             <ArrowRight className="w-4 h-4" />
                          </div>
                       </div>
                    </td>
                  </motion.tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                       <div className="flex flex-col items-center gap-4 text-gray-600">
                          <Activity className="w-12 h-12 opacity-20" />
                          <p className="text-sm font-bold uppercase tracking-widest">No activity logs found at this duration.</p>
                       </div>
                    </td>
                  </tr>
                )}
             </tbody>
           </motion.table>
        </div>
      </div>
    </div>
  );
}
