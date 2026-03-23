/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { subscriptionService } from "@/services/subscription.service";
import { CheckCircle2, Loader2, Crown, Home, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subData, setSubData] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await subscriptionService.confirmSubscription(sessionId);
        if (res) {
          setSubData(res);
          toast.success("Subscription Activated! 🎉");
        } else {
          setError(true);
        }
      } catch (err: any) {
        setError(true);
        console.error("Subscription Confirmation Error:", err);
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [sessionId]);

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black">
        <Loader2 className="animate-spin text-purple-500 w-12 h-12 mb-4" />
        <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">
          Activating Subscription...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-white text-center px-6">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Activation Failed</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Something went wrong while activating your subscription.
        </p>
        <button
          onClick={() => router.push("/subscription")}
          className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase text-xs"
        >
          Try Again
        </button>
      </div>
    );

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full bg-[#0A0A0A] border border-white/5 p-12 rounded-[3rem] text-center shadow-2xl">
        {/* Animated glow */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-30 animate-pulse" />
          <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
            <Crown className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-3">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Premium
          </span>
        </h1>

        <p className="text-gray-500 text-sm mb-2">
          Your <span className="text-purple-400 font-bold">{subData?.planType}</span> subscription is now active
        </p>

        <div className="flex items-center justify-center gap-2 text-green-500 text-xs font-bold uppercase tracking-widest mb-10">
          <CheckCircle2 className="w-4 h-4" /> All Movies Unlocked
        </div>

        <div className="space-y-4">
          <button
            onClick={() => router.push("/movies")}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black py-5 rounded-2xl transition-all uppercase italic hover:scale-[1.02] active:scale-[0.98]"
          >
            <Crown className="w-5 h-5" /> Browse Movies
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center justify-center gap-2 text-gray-500 font-bold py-3 uppercase text-[10px] tracking-widest hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" /> Back to Home
          </button>
        </div>
      </div>
    </main>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={<div className="bg-black h-screen" />}>
      <SuccessContent />
    </Suspense>
  );
}
