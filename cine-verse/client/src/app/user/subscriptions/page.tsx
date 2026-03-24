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
          <div className="bg-gradient-to-br from-gray-900 to-[#111] border border-gray-800/50 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <Crown className="w-20 h-20 text-purple-500/10" />
            </div>

            <div className="relative z-10 flex items-start justify-between mb-8">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 mb-2 block">
                  Current Plan
                </span>
                <h2 className="text-4xl font-black uppercase tracking-tighter">
                  {subscription.planType} PACKAGE
                </h2>
              </div>
              <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 px-3 py-1 rounded-full border border-green-500/20 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-10">
              <div className="space-y-1">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Start Date
                </p>
                <p className="text-white font-bold">
                  {new Date(subscription.startDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Next Billing
                </p>
                <p className="text-white font-bold">
                  {new Date(subscription.endDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                disabled={cancelling}
                onClick={handleCancel}
                className="flex items-center gap-2 bg-red-600/10 text-red-400 border border-red-500/20 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
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

          <div className="mt-8 p-6 bg-gray-900/40 border border-gray-800/50 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4 text-gray-400">
               <Crown className="w-6 h-6" />
               <p className="text-sm">Enjoy unlimited 4K streaming and offline downloads on all devices.</p>
            </div>
            <Link href="/subscription" className="text-purple-400 font-bold text-sm hover:underline">
               Upgrade
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
