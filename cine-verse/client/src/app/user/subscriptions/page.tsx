/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { subscriptionService } from "@/services/subscription.service";
import Link from "next/link";
import {
  Loader2,
  Crown,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

export default function SubscriptionHistoryPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const fetchSubscription = async () => {
    try {
      const res = await subscriptionService.getActiveSubscription();
      setSubscription(res?.data || null);
    } catch (error) {
      console.error("Subscription history error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleCancel = async () => {
    if (!subscription?.id) return;
    if (!confirm("Are you sure you want to cancel your subscription?")) return;

    try {
      setCancelling(true);
      await subscriptionService.cancelSubscription(subscription.id);
      toast.success("Subscription cancelled successfully!");
      fetchSubscription();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to cancel subscription");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="text-white">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
          Subscription Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Plan details and billing status
        </p>
      </div>

      {loading ? (
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        </div>
      ) : !subscription ? (
        <div className="text-center py-20 bg-gray-900/20 rounded-2xl border border-gray-800/50">
          <Crown className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 text-lg italic mb-4">
            You don't have an active subscription.
          </p>
          <Link
            href="/subscription"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-3 rounded-xl hover:scale-105 transition-all shadow-lg shadow-purple-500/20"
          >
            Upgrade to Premium
          </Link>
        </div>
      ) : (
        <div className="max-w-2xl">
          <div className="bg-gradient-to-br from-gray-900 to-[#111] border border-gray-800/50 rounded-3xl p-5 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-20 sm:opacity-100">
              <Crown className="w-16 h-16 sm:w-20 sm:h-20 text-purple-500/10 sm:text-purple-500/20" />
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-0 mb-8">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 mb-1 block">
                  Current Plan
                </span>
                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter text-white">
                  {subscription.planType} PACKAGE
                </h2>
              </div>
              <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full border border-green-500/20 text-[10px] font-black uppercase tracking-wider w-max shadow-lg shadow-green-500/5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-10">
              <div className="space-y-1.5 p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-purple-500" /> Start Date
                </p>
                <p className="text-white font-bold text-sm sm:text-base">
                  {new Date(subscription.startDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="space-y-1.5 p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-purple-500" /> Next Billing
                </p>
                <p className="text-white font-bold text-sm sm:text-base">
                  {new Date(subscription.endDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <button
                disabled={cancelling}
                onClick={handleCancel}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600/10 text-red-400 border border-red-500/20 px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all disabled:opacity-50 shadow-lg shadow-red-600/5"
              >
                {cancelling ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                Cancel Subscription
              </button>
            </div>
          </div>

          <div className="mt-6 p-5 sm:p-6 bg-gray-900/40 border border-gray-800/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-gray-400">
               <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center shrink-0">
                 <Crown className="w-5 h-5 text-purple-500" />
               </div>
               <p className="text-xs sm:text-sm font-medium leading-relaxed">Enjoy unlimited 4K streaming and offline downloads on all devices.</p>
            </div>
            <Link href="/subscription" className="w-full sm:w-auto text-center px-6 py-2.5 bg-purple-600/10 text-purple-400 hover:bg-purple-600 hover:text-white rounded-xl font-black uppercase tracking-widest text-[10px] border border-purple-500/20 transition-all">
               Upgrade Plan
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
