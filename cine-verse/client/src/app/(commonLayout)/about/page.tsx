"use client";

import { motion } from "framer-motion";
import { Film, Users, Trophy, Zap, Play, Sparkles, Star } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Movies", value: "10K+", icon: Film },
    { label: "Users", value: "2M+", icon: Users },
    { label: "Awards", value: "45+", icon: Trophy },
    { label: "Speed", value: "0.2s", icon: Zap },
  ];

  const features = [
    {
      title: "AI-Powered Discovery",
      description: "Our proprietary CineBuddy AI understands your taste better than your best friend.",
      icon: Sparkles,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Ultra 4K Streaming",
      description: "Experience cinema-grade quality from the comfort of your living room.",
      icon: Play,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Community Driven",
      description: "Join millions of film buffs in discussing and rating the latest releases.",
      icon: Users,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Expert Curation",
      description: "Hand-picked collections from world-renowned directors and critics.",
      icon: Star,
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden text-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/10 blur-[100px] rounded-full" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6 bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent">
              Redefining <br /> The Cinema Experience
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
              CineVerse isn't just a streaming platform. It's a universe built for those who live and breathe film.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-colors group"
              >
                <stat.icon className="w-8 h-8 text-purple-400 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-black italic">{stat.value}</div>
                <div className="text-gray-500 text-xs uppercase tracking-widest font-bold mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-zinc-950/50 relative border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group">
                <img
                  src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1000"
                  alt="Cinematic background"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <Play className="w-8 h-8 fill-white" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-black italic uppercase tracking-tight mb-6">
                Our Mission is <span className="text-purple-500">Simple.</span>
              </h2>
              <div className="space-y-6 text-gray-400 leading-relaxed">
                <p>
                  Founded in 2024, CineVerse was born out of a frustration with generic, algorithm-driven stores. We believed that technology should serve art, not stifle it.
                </p>
                <p>
                  Today, we leverage cutting-edge AI to personalize every frame of your journey, while maintaining the human touch through curated collections and deep cinematic analysis.
                </p>
                <button className="px-8 py-3 rounded-full bg-white text-black font-black uppercase text-sm italic hover:bg-gray-200 transition-colors mt-4">
                  Explore The Collection
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black italic uppercase tracking-tight mb-4">
            Why Choose CineVerse?
          </h2>
          <div className="w-20 h-1 bg-purple-600 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-all relative overflow-hidden group"
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg shadow-black/40`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto p-12 md:p-20 rounded-[40px] bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Film className="w-64 h-64" />
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tight mb-6">
              Ready to start your <br /> cinematic journey?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <button className="px-10 py-4 rounded-full bg-purple-600 text-white font-black uppercase italic hover:bg-purple-500 transition-all shadow-xl shadow-purple-600/20">
                Join Premium
              </button>
              <button className="px-10 py-4 rounded-full bg-white/10 text-white font-black uppercase italic hover:bg-white/20 transition-all border border-white/10 backdrop-blur-sm">
                Browse Content
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
