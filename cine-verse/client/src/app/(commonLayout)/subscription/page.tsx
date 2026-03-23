/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { subscriptionService } from "@/services/subscription.service";
import { useAuthStore } from "@/lib/store";
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
    price: "৳499",
    period: "/month",
    description: "Perfect for casual viewers",
    features: [
      "Unlimited movie streaming",
      "HD quality playback",
      "Watch on any device",
      "Cancel anytime",
      "New releases included",
    ],
    icon: Zap,
    popular: false,
    gradient: "from-blue-600 to-cyan-500",
    borderColor: "border-blue-500/20",
    bgGlow: "bg-blue-500/5",
  },
  {
    id: "YEARLY",
    name: "Yearly",
    price: "৳3,999",
    period: "/year",
    description: "Best value — save 33%",
    features: [
      "Everything in Monthly",
      "4K Ultra HD streaming",
      "Offline downloads",
      "Priority support",
      "Exclusive early access",
      "Family sharing (up to 4)",
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
  }, []);

  const handleSubscribe = async (planType: "MONTHLY" | "YEARLY") => {
    if (!user) {
      toast.error("Please login first!");
      router.push("/login");
      return;
    }

    try {
      setLoadingPlan(planType);
      const res = await subscriptionService.createSubscription(planType);
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
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-5 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-xs font-bold uppercase tracking-widest">
              Premium Plans
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-6">
            Unlock{" "}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Everything
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto font-light">
            Subscribe once and get unlimited access to every movie in our
            library. No per-movie charges, no restrictions.
          </p>
        </div>

        {/* Active Subscription Banner */}
        {activeSub && (
          <div className="mb-16 max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-3xl p-8 text-center">
              <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-black uppercase italic mb-2">
                You&apos;re Subscribed!
              </h3>
              <p className="text-gray-400 text-sm mb-1">
                Plan:{" "}
                <span className="text-green-400 font-bold">
                  {activeSub.planType}
                </span>
              </p>
              <p className="text-gray-500 text-xs">
                Valid until:{" "}
                {new Date(activeSub.endDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = activeSub?.planType === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative group rounded-[2.5rem] border ${plan.borderColor} ${plan.bgGlow} p-1 transition-all duration-500 hover:scale-[1.02]`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div
                      className={`bg-gradient-to-r ${plan.gradient} text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3 h-3" /> Most Popular
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-[#0A0A0A] rounded-[2.3rem] p-10 h-full flex flex-col">
                  {/* Plan Icon & Name */}
                  <div className="flex items-center gap-4 mb-8">
                    <div
                      className={`bg-gradient-to-br ${plan.gradient} p-4 rounded-2xl shadow-lg`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase italic">
                        {plan.name}
                      </h3>
                      <p className="text-gray-500 text-xs">{plan.description}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-10">
                    <span className="text-5xl font-black italic">
                      {plan.price}
                    </span>
                    <span className="text-gray-500 text-sm font-medium">
                      {plan.period}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 flex-1 mb-10">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div
                          className={`bg-gradient-to-br ${plan.gradient} w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0`}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-300 text-sm font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    disabled={
                      isCurrentPlan || loadingPlan === plan.id || !!activeSub
                    }
                    onClick={() =>
                      handleSubscribe(plan.id as "MONTHLY" | "YEARLY")
                    }
                    className={`w-full py-5 rounded-2xl font-black uppercase italic text-sm tracking-wider transition-all flex items-center justify-center gap-3 ${
                      isCurrentPlan
                        ? "bg-green-500/10 text-green-500 border border-green-500/20 cursor-not-allowed"
                        : activeSub
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                        : plan.popular
                        ? `bg-gradient-to-r ${plan.gradient} text-white shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98]`
                        : "bg-white text-black hover:bg-gray-200 active:scale-[0.98]"
                    }`}
                  >
                    {loadingPlan === plan.id ? (
                      <Loader2 className="animate-spin w-5 h-5" />
                    ) : isCurrentPlan ? (
                      <>
                        <Check className="w-5 h-5" /> Current Plan
                      </>
                    ) : activeSub ? (
                      "Already Subscribed"
                    ) : (
                      <>
                        <Zap className="w-5 h-5" /> Get {plan.name}
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Section */}
        <div className="mt-20 text-center">
          <div className="flex items-center justify-center gap-8 text-gray-600 text-xs font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" /> Secure Payment
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" /> Instant Access
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" /> Cancel Anytime
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
