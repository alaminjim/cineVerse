"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";

export default function SubscriptionSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="text-center max-w-2xl mx-auto mb-16 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Choose Your <span className="gradient-text">Premium Tier</span></h2>
        <p className="text-lg text-muted-foreground">
          Unlock unlimited access to the best movies and series. Cancel anytime.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto relative z-10">
        {/* Monthly Plan */}
        <div className="glass-card rounded-3xl p-8 border border-border transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 flex flex-col">
          <div className="mb-4">
            <span className="text-primary font-semibold tracking-wider uppercase text-sm">Monthly Plan</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-5xl font-bold">$9.99</span>
              <span className="text-muted-foreground">/mo</span>
            </div>
          </div>
          <p className="text-muted-foreground mb-6">Perfect for casual viewers who want flexibility.</p>
          
          <ul className="space-y-4 mb-8 flex-1">
            {['Ad-free streaming', 'HD and 4K resolution', 'Watch on any device', 'Cancel anytime'].map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          <Button className="w-full h-12 text-base rounded-xl glass border-border hover:bg-white/10" variant="outline">
            Subscribe Monthly
          </Button>
        </div>

        {/* Yearly Plan */}
        <div className="rounded-3xl p-8 border border-primary gradient-bg shadow-2xl shadow-primary/20 relative flex flex-col overflow-hidden">
          <div className="absolute top-0 right-0 py-1.5 px-4 bg-primary text-primary-foreground text-xs font-bold rounded-bl-xl uppercase tracking-wider">
            Most Popular
          </div>
          <div className="mb-4 relative z-10">
            <span className="text-primary-foreground font-semibold tracking-wider uppercase text-sm">Yearly Plan</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-5xl font-bold text-white">$99.99</span>
              <span className="text-white/80">/yr</span>
            </div>
          </div>
          <p className="text-white/90 mb-6 relative z-10">Save 16% and enjoy year-round uninterrupted entertainment.</p>
          
          <ul className="space-y-4 mb-8 flex-1 relative z-10 text-white/90">
            {['Everything in Monthly', 'Download for offline viewing', 'Early access to premieres', '2 extra user profiles'].map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-white" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          <Button className="w-full h-12 text-base rounded-xl bg-white text-primary hover:bg-white/90 border-0 relative z-10 font-bold transition-transform hover:scale-[1.02]">
            Subscribe Yearly
          </Button>
        </div>
      </div>
    </section>
  );
}
