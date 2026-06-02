"use client";
import { Check, Crown, Zap, Star } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Start exploring the community",
    features: [
      "Standard quality (480p)",
      "Include ads",
      "1 device support",
      "Create reviews",
      "Basic watchlist",
    ],
    icon: Star,
    color: "purple",
    buttonText: "Get Started",
  },
  {
    name: "Monthly",
    price: "999",
    description: "Full cinematic experience",
    features: [
      "HD quality (1080p)",
      "No ads",
      "3 devices support",
      "Priority support",
      "Early access to reviews",
      "Exclusive badges",
    ],
    icon: Zap,
    color: "purple",
    buttonText: "Subscribe Monthly",
    recommended: true,
  },
  {
    name: "Yearly",
    price: "3999",
    description: "Best value for cinephiles",
    features: [
      "4K Ultra HD quality",
      "No ads",
      "5 devices support",
      "VIP support",
      "Exclusive content",
      "2 months for free",
    ],
    icon: Crown,
    color: "purple",
    buttonText: "Subscribe Yearly",
  },
];

export default function SubscriptionPlansSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-purple-600/5 to-transparent pointer-events-none" />

      <div className="text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tight leading-tight mb-4 text-white">
          Choose Your{" "}
          <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-600 px-2">
            Plan
          </span>
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base font-medium">
          Unlock unlimited access to the world&apos;s best movies and series. No
          hidden fees. Cancel anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative group bg-gray-900/40 border ${
              plan.recommended
                ? "border-purple-500 ring-2 ring-purple-500/20"
                : "border-gray-800"
            } rounded-[2.5rem] p-8 md:p-10 hover:border-purple-500/50 transition-all duration-500 flex flex-col`}
          >
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                Most Popular
              </div>
            )}

            <div className="mb-8">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-purple-500/10"
              >
                <plan.icon
                  className="w-7 h-7 text-purple-500"
                />
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-2">
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-black text-white">
                  ৳{plan.price}
                </span>
                <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                  {plan.name === "Free"
                    ? ""
                    : plan.name === "Monthly"
                      ? "/ Month"
                      : "/ Year"}
                </span>
              </div>
              <p className="text-gray-500 text-sm font-medium">
                {plan.description}
              </p>
            </div>

            <div className="space-y-4 mb-10 flex-1">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <div
                    className="mt-1 bg-purple-500/20 rounded-full p-0.5"
                  >
                    <Check
                      className="w-3.5 h-3.5 text-purple-500"
                    />
                  </div>
                  <span className="text-gray-300 text-sm font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href={
                plan.name === "Free"
                  ? "/register"
                  : `/subscription?plan=${plan.name.toLowerCase()}`
              }
              className={`w-full py-4 rounded-2xl font-black uppercase italic tracking-wider transition-all text-center ${
                plan.recommended
                  ? "bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-600/20"
                  : "bg-gray-800 text-gray-300 hover:bg-white hover:text-black"
              }`}
            >
              {plan.buttonText}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
