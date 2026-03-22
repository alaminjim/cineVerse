"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SubscriptionSection() {
  return (
    <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your <span className="gradient-text">Plan</span></h2>
        <p className="text-gray-400 max-w-2xl mx-auto">Unlock premium features, exclusive content, and ad-free experience.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Basic Plan */}
        <motion.div 
          whileHover={{ y: -10 }}
          className="border border-gray-800 rounded-2xl p-8 bg-black/40 backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold text-gray-300 mb-2">Basic</h3>
          <div className="my-4">
            <span className="text-4xl font-extrabold">$8.99</span>
            <span className="text-gray-500"> /month</span>
          </div>
          <p className="text-gray-400 text-sm mb-6">Perfect for individuals who want standard quality.</p>
          
          <ul className="space-y-4 mb-8">
            <li className="flex gap-2 text-sm text-gray-300"><CheckCircle2 className="w-5 h-5 text-purple-500" /> Watch on 1 screen</li>
            <li className="flex gap-2 text-sm text-gray-300"><CheckCircle2 className="w-5 h-5 text-purple-500" /> 720p resolution</li>
            <li className="flex gap-2 text-sm text-gray-300"><CheckCircle2 className="w-5 h-5 text-purple-500" /> Ad-supported</li>
          </ul>
          
          <button className="w-full btn-secondary">Get Basic</button>
        </motion.div>

        {/* Pro Plan */}
        <motion.div 
          whileHover={{ y: -10 }}
          className="border border-purple-600 rounded-2xl p-8 relative glass-effect shadow-[0_0_30px_rgba(147,51,234,0.15)] transform scale-105 z-10"
        >
          <div className="absolute top-0 right-8 transform -translate-y-1/2">
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              MOST POPULAR
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Premium</h3>
          <div className="my-4">
            <span className="text-4xl font-extrabold">$14.99</span>
            <span className="text-gray-400"> /month</span>
          </div>
          <p className="text-gray-300 text-sm mb-6">For the ultimate cinematic experience.</p>
          
          <ul className="space-y-4 mb-8">
            <li className="flex gap-2 text-sm text-white"><CheckCircle2 className="w-5 h-5 text-purple-400" /> Watch on 4 screens</li>
            <li className="flex gap-2 text-sm text-white"><CheckCircle2 className="w-5 h-5 text-purple-400" /> 4K Ultra HD & HDR</li>
            <li className="flex gap-2 text-sm text-white"><CheckCircle2 className="w-5 h-5 text-purple-400" /> Ad-free experience</li>
            <li className="flex gap-2 text-sm text-white"><CheckCircle2 className="w-5 h-5 text-purple-400" /> Download for offline</li>
          </ul>
          
          <button className="w-full btn-primary">Subscribe Now</button>
        </motion.div>

        {/* Family Plan */}
        <motion.div 
          whileHover={{ y: -10 }}
          className="border border-gray-800 rounded-2xl p-8 bg-black/40 backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold text-gray-300 mb-2">Family</h3>
          <div className="my-4">
            <span className="text-4xl font-extrabold">$19.99</span>
            <span className="text-gray-500"> /month</span>
          </div>
          <p className="text-gray-400 text-sm mb-6">Everything in Premium for up to 6 members.</p>
          
          <ul className="space-y-4 mb-8">
            <li className="flex gap-2 text-sm text-gray-300"><CheckCircle2 className="w-5 h-5 text-purple-500" /> Watch on 6 screens</li>
            <li className="flex gap-2 text-sm text-gray-300"><CheckCircle2 className="w-5 h-5 text-purple-500" /> 4K Ultra HD & HDR</li>
            <li className="flex gap-2 text-sm text-gray-300"><CheckCircle2 className="w-5 h-5 text-purple-500" /> Kids profiles available</li>
          </ul>
          
          <button className="w-full btn-secondary">Get Family</button>
        </motion.div>
      </div>
    </section>
  );
}
