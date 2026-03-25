/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { Loader2, Activity } from "lucide-react";

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await adminService.getActivityLogs(page);
        setLogs(res?.data || []);
        setMeta(res?.meta || null);
      } catch (error) {
        console.error("Failed to load logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [page]);

  return (
    <div className="text-white">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
          Activity Logs
        </h1>
        <p className="text-gray-500 text-sm mt-1">Recent platform activity</p>
      </div>

      {loading ? (
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-20">
          <Activity className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 text-lg italic">No activity logs yet.</p>
        </div>
      ) : (
        <>
      {/* Mobile/Tablet List View */}
      <div className="lg:hidden space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-5 hover:border-gray-700/50 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-lg">
                {log.user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white font-bold text-base truncate">{log.user?.name || "Unknown"}</p>
                <p className="text-gray-500 text-xs">{new Date(log.createdAt).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-gray-800/50">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Action</span>
                <span className="bg-purple-600/15 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                  {log.action}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1 block">Details</span>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {log.userAction}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View (lg & above) */}
      <div className="hidden lg:block bg-gray-900/40 border border-gray-800/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800/50">
                <th className="text-left px-6 py-4 text-gray-500 text-[10px] font-bold uppercase tracking-widest">User</th>
                <th className="text-left px-6 py-4 text-gray-500 text-[10px] font-bold uppercase tracking-widest">Action</th>
                <th className="text-left px-6 py-4 text-gray-500 text-[10px] font-bold uppercase tracking-widest">Details</th>
                <th className="text-left px-6 py-4 text-gray-500 text-[10px] font-bold uppercase tracking-widest">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-gray-800/30 hover:bg-white/[0.02] transition-all"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {log.user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <span className="text-white text-sm font-medium truncate max-w-[120px]">
                        {log.user?.name || "Unknown"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-purple-600/15 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-400 text-sm truncate max-w-[300px]">
                      {log.userAction}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 disabled:opacity-30 hover:bg-gray-800 transition-all text-sm font-bold"
              >
                Previous
              </button>
              <span className="text-gray-500 text-sm">
                Page {meta.page} of {meta.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
                className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 disabled:opacity-30 hover:bg-gray-800 transition-all text-sm font-bold"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
