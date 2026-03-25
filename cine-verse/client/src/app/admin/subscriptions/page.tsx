/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { subscriptionService } from "@/services/subscription.service";
import {
  Loader2,
  Crown,
  User,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await subscriptionService.getAllSubscriptions();
        setSubscriptions(res?.data || []);
      } catch (error) {
        console.error("Fetch subscriptions error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  return (
    <div className="text-white">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
          Subscription Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Monitor all user subscription plans and billing cycles
        </p>
      </div>

      {loading ? (
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden space-y-4">
            {subscriptions.length > 0 ? (
              subscriptions.map((sub) => (
                <div key={sub.id} className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-5 hover:border-gray-700/50 transition-all">
                  <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-800/50">
                    <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center shrink-0 border border-purple-500/10">
                      <User className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-bold text-base truncate">{sub.user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{sub.user?.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Plan Type</span>
                      <div className="flex items-center gap-1.5 text-purple-400 font-black text-xs uppercase tracking-widest">
                        <Crown className="w-3.5 h-3.5" />
                        {sub.planType}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 py-4 bg-black/20 rounded-xl px-4 border border-gray-800/30">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Start Date</span>
                        <p className="text-gray-300 font-bold text-[10px]">{new Date(sub.startDate).toLocaleDateString()}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">End Date</span>
                        <p className="text-gray-300 font-bold text-[10px]">{new Date(sub.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center gap-1.5 font-black uppercase tracking-widest text-[10px]">
                      {sub.status === "ACTIVE" ? (
                        <span className="flex items-center gap-1.5 text-green-400 bg-green-500/5 px-2.5 py-1.5 rounded-lg border border-green-500/10 shadow-lg shadow-green-500/5">
                          <CheckCircle2 className="w-3 h-3" /> ACTIVE
                        </span>
                      ) : sub.status === "EXPIRED" ? (
                        <span className="flex items-center gap-1.5 text-red-400 bg-red-500/5 px-2.5 py-1.5 rounded-lg border border-red-500/10">
                          <AlertCircle className="w-3 h-3" /> EXPIRED
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-gray-500 bg-gray-700/10 px-2.5 py-1.5 rounded-lg border border-gray-700/10">
                          {sub.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-10 text-center text-gray-500 italic">
                No subscriptions found.
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block bg-gray-900/40 border border-gray-800/50 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-800/50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    <th className="px-6 py-5">User</th>
                    <th className="px-6 py-5">Plan</th>
                    <th className="px-6 py-5">Start Date</th>
                    <th className="px-6 py-5">End Date</th>
                    <th className="px-6 py-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-600/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-purple-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold truncate">{sub.user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{sub.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                          <Crown className="w-4 h-4" />
                          {sub.planType}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium">
                        {new Date(sub.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium">
                        {new Date(sub.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
                          {sub.status === "ACTIVE" ? (
                            <span className="flex items-center gap-1 text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                              <CheckCircle2 className="w-3 h-3" /> ACTIVE
                            </span>
                          ) : sub.status === "EXPIRED" ? (
                            <span className="flex items-center gap-1 text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                              <AlertCircle className="w-3 h-3" /> EXPIRED
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-gray-500 bg-gray-700/20 px-2.5 py-1 rounded-full">
                              {sub.status}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {subscriptions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <XCircle className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                        <p className="text-gray-500 italic">No active subscriptions found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
