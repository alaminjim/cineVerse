"use client";

import { motion } from "framer-motion";
import { Film, Users, Shield, Globe } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Movies", value: "10K+", icon: Film },
    { label: "Community", value: "50K+", icon: Users },
    { label: "Privacy", value: "100%", icon: Shield },
    { label: "Global", value: "150+", icon: Globe },
  ];

  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6"
          >
            Our Story
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-8 max-w-4xl"
          >
            The Ultimate <span className="text-primary">Cinematic</span> Universe.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed"
          >
            CineVerse isn't just a streaming platform; it's a community for movie lovers, built with cutting-edge AI to personalize your cinematic journey.
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          {stats.map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              key={stat.label}
              className="bg-gray-900/40 border border-gray-800/50 rounded-3xl p-8 text-center hover:border-primary/30 transition-all group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary group-hover:scale-110 transition-transform">
                <stat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-black mb-2">{stat.value}</h3>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-8">
              Redefining How You <span className="text-primary">Discover</span> Movies.
            </h2>
            <div className="space-y-6 text-gray-400 font-medium text-lg leading-relaxed">
              <p>
                Founded in 2024, CineVerse was born from a simple idea: making movie discovery effortless and social. We believe every movie has a story to tell, and every viewer has a unique taste.
              </p>
              <p>
                By combining a massive database of world cinema with sophisticated AI algorithms, we provide recommendations that actually matter. No more scrolling for hours.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
            <img 
              src="https://images.unsplash.com/photo-1485846234645-a62644ef7467?q=80&w=2000&auto=format&fit=crop" 
              alt="Cinema" 
              className="relative rounded-3xl border border-gray-800 shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
