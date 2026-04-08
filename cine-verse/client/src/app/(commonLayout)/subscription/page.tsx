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
    gradient: "from-purple-600 to-indigo-500",
    borderColor: "border-purple-500/20",
    bgGlow: "bg-purple-500/5",
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
    gradient: "from-purple-600 to-pink-500",
    borderColor: "border-purple-500/30",
    bgGlow: "bg-purple-500/5",
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
    <main className="min-h-screen bg-black text-white overflow-hidden pb-20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[128px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-28">
        {/* Active Subscription Banner */}
        {activeSub && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-16 max-w-2xl mx-auto"
          >
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-3xl p-8 text-center backdrop-blur-md">
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
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full px-6 py-2.5 mb-10"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Premium Cinematic Experience
            </span>
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tight leading-tight mb-8">
            <span className="block">Unlock</span>
            <span className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent px-4">
              Everything
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Choose your gateway to an infinite world of stories. 
            <span className="block text-gray-500 text-sm mt-2">No hidden fees. Cancel anytime. Secure payments.</span>
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
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative group rounded-[2.5rem] border ${plan.borderColor} ${plan.bgGlow} p-1 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 w-full flex justify-center">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[9px] font-black uppercase tracking-[0.15em] px-8 py-2 rounded-full shadow-2xl"
                    >
                      <div className="flex items-center gap-2">
                        <Star className="w-3 h-3 fill-white" /> Most Popular
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-[#0A0A0A]/80 backdrop-blur-xl rounded-[2.3rem] p-8 h-full flex flex-col items-center text-center">
                  {/* Plan Icon & Name */}
                  <div className="mb-8">
                    <div
                      className={`inline-flex bg-gradient-to-br ${plan.gradient} p-4 rounded-2xl shadow-xl mb-6 transform group-hover:rotate-12 transition-transform duration-500`}
                    >
                      <Icon className="w-8 h-8 text-white" />
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
                      <span className="text-gray-500 text-xs font-black uppercase tracking-widest">
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 flex-1 mb-12 w-full text-left px-2">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div
                          className={`bg-gradient-to-br ${plan.gradient} w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg`}
                        >
                          <Check className="w-3 h-3 text-white stroke-[3px]" />
                        </div>
                        <span className="text-gray-400 text-[13px] font-semibold">
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
                    className={`w-full py-5 rounded-2xl font-black uppercase italic text-xs tracking-[0.15em] transition-all flex items-center justify-center gap-3 ${
                      isCurrentPlan
                        ? "bg-green-500/10 text-green-400 border border-green-500/30"
                        : activeSub && plan.id !== "FREE"
                        ? "bg-gray-800 text-gray-600"
                        : plan.id === "FREE"
                        ? "bg-white text-black hover:bg-gray-200"
                        : `bg-gradient-to-r ${plan.gradient} text-white shadow-xl hover:brightness-110 active:scale-95`
                    }`}
                  >
                    {loadingPlan === plan.id ? (
                      <Loader2 className="animate-spin w-5 h-5" />
                    ) : isCurrentPlan ? (
                      "Current Plan"
                    ) : plan.id === "FREE" ? (
                      "Join Free"
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
        <div className="mt-32">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 text-gray-500 text-[10px] font-black uppercase tracking-[0.25em]">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-purple-500" /> Secure SSL Encryption
            </div>
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-500" /> Instant Plan Activation
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-pink-500" /> Quality Guaranteed
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
