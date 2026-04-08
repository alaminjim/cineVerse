/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { subscriptionService } from "@/services/subscription.service";
import { useAuthStore } from "@/lib/store";
import { motion } from "framer-motion";
import {
  Crown,
  Check,
  Zap,
  Shield,
  Star,
  Loader2,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

const plans = [
  {
    id: "MONTHLY",
    name: "Monthly",
    price: "৳999",
    period: "/month",
    description: "Full cinematic experience",
    features: [
      "HD quality playback",
      "Ad-free experience",
      "2 devices support",
      "New releases included",
      "Exclusive badges",
    ],
    icon: Zap,
    popular: false,
  },
  {
    id: "YEARLY",
    name: "Yearly",
    price: "৳3,999",
    period: "/year",
    description: "Best value — save 33%",
    features: [
      "4K Ultra HD streaming",
      "No ads forever",
      "4 devices support",
      "Priority support",
      "Exclusive early access",
      "Offline downloads",
    ],
    icon: Crown,
    popular: true,
  },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [activeSub, setActiveSub] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user) {
      setChecking(false);
      return;
    }

    const checkActive = async () => {
      try {
        const res = await subscriptionService.getActiveSubscription();
        if (res.isSubscribed && res.data) {
          setActiveSub(res.data);
        }
      } catch {
      } finally {
        setChecking(false);
      }
    };
    checkActive();
  }, [user]);

  const handleSubscribe = async (planType: "MONTHLY" | "YEARLY" | "FAMILY" | "FREE") => {
    if (planType === "FREE") {
      router.push("/register");
      return;
    }
    
    if (!user) {
      toast.error("Please login first!");
      router.push("/login");
      return;
    }

    try {
      setLoadingPlan(planType);
      const res = await subscriptionService.createSubscription(planType as any);
      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Something went wrong!"
      );
    } finally {
      setLoadingPlan(null);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-purple-500 w-10 h-10" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white pb-20 overflow-x-hidden">
      <div className="relative max-w-7xl mx-auto px-6 pt-28">
        {/* Active Subscription Banner */}
        {activeSub && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-16 max-w-2xl mx-auto"
          >
            <div className="bg-green-500/5 border border-green-500/10 rounded-3xl p-8 text-center backdrop-blur-md">
              <Shield className="w-10 h-10 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-black uppercase italic mb-2">
                You&apos;re Subscribed!
              </h3>
              <p className="text-gray-400 text-sm mb-1">
                Active Plan:{" "}
                <span className="text-green-400 font-bold tracking-widest">
                  {activeSub.planType}
                </span>
              </p>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                Valid until:{" "}
                {new Date(activeSub.endDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-purple-500/5 border border-purple-500/10 rounded-full px-5 py-2 mb-8"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-[10px] font-bold uppercase tracking-[0.2em]">
              Premium Cinematic Experience
            </span>
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tight leading-tight mb-8">
            <span className="block text-white">Unlock</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 px-4">
              Everything
            </span>
          </h1>
          
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Choose your gateway to an infinite world of stories. 
            <span className="block text-gray-600 text-sm mt-2">No hidden fees. Cancel anytime.</span>
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto relative z-10">
          {plans.map((plan, idx) => {
            const Icon = plan.icon;
            const isCurrentPlan = activeSub?.planType === plan.id;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative group rounded-[2.5rem] border border-white/5 bg-zinc-900/40 p-1 transition-all duration-300 hover:border-purple-500/30`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-purple-600 text-white text-[10px] font-black uppercase tracking-[0.1em] px-6 py-1.5 rounded-full shadow-xl">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="bg-black/50 backdrop-blur-xl rounded-[2.3rem] p-8 md:p-12 h-full flex flex-col items-center text-center">
                  {/* Plan Icon & Name */}
                  <div className="mb-8">
                    <div className="inline-flex bg-zinc-900 p-4 rounded-2xl border border-white/5 mb-6">
                      <Icon className="w-8 h-8 text-purple-500" />
                    </div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tight text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-10 w-full py-6 border-y border-white/5">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-black italic text-white tracking-tighter">
                        {plan.price}
                      </span>
                      <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 flex-1 mb-12 w-full text-left">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <span className="text-gray-400 text-sm font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    disabled={
                      isCurrentPlan || loadingPlan === plan.id || (activeSub && plan.id !== "FREE")
                    }
                    onClick={() =>
                      handleSubscribe(plan.id as any)
                    }
                    className={`w-full py-5 rounded-2xl font-black uppercase italic text-[11px] tracking-[0.15em] transition-all ${
                      isCurrentPlan
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : activeSub && plan.id !== "FREE"
                        ? "bg-zinc-900 text-gray-600 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-600/10 active:scale-[0.98]"
                    }`}
                  >
                    {loadingPlan === plan.id ? (
                      <Loader2 className="animate-spin w-5 h-5 mx-auto" />
                    ) : isCurrentPlan ? (
                      "Current Plan"
                    ) : (
                      "Get Started"
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Trust Section */}
        <div className="mt-32 border-t border-white/5 pt-20">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 text-gray-600 text-[10px] font-bold uppercase tracking-[0.25em]">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-purple-500" /> Secure SSL Encryption
            </div>
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-amber-500" /> Instant Activation
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-pink-500" /> 24/7 Priority Support
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
