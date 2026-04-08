"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2, Play, Info, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { aiService } from "@/services/ai.service";
import Link from "next/link";

export default function AIRecommendationsSection() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        // Using a general prompt to get diverse AI recommendations
        const res = await aiService.getMovieRecommendations("Recommend 4 trending blockbuster movies for a movie enthusiast.");
        if (res && res.success && res.data?.movies) {
          setRecommendations(res.data.movies);
        }
      } catch (error) {
        console.error("AI Recommendations fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading && !recommendations.length) {
    return (
      <div className="py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black italic uppercase tracking-tight">AI Personalized Picks</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-video bg-zinc-900 animate-pulse rounded-3xl border border-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (!recommendations.length) return null;

  return (
    <section className="py-12 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black italic uppercase tracking-tight">AI Personalized Picks</h2>
            <p className="text-[10px] text-purple-400 font-bold uppercase tracking-[0.2em] mt-0.5 mt-1">Curated by CineBuddy</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((movie, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="group relative aspect-video rounded-[32px] overflow-hidden border border-white/5 bg-zinc-900 shadow-2xl shadow-black/40 hover:border-purple-500/30 transition-all cursor-pointer"
          >
            <img 
              src={movie.thumbnail || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800"} 
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-60"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform">
              <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="px-2 py-1 rounded-md bg-purple-600 text-[8px] font-black uppercase tracking-widest text-white">
                  98% Match
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-3 h-3 fill-yellow-500" />
                  <span className="text-[10px] font-bold">{movie.avgRating || "8.5"}</span>
                </div>
              </div>
              
              <h3 className="text-lg font-black italic uppercase leading-tight text-white mb-2 truncate">
                {movie.title}
              </h3>
              
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link 
                  href={`/movies/${movie.id}`}
                  className="p-2 rounded-xl bg-white text-black hover:bg-gray-200 transition-all shadow-lg"
                >
                  <Play className="w-4 h-4 fill-black" />
                </Link>
                <Link 
                  href={`/movies/${movie.id}`}
                   className="p-2 rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all"
                >
                  <Info className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
