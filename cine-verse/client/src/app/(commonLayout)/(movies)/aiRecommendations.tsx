"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { aiService } from "@/services/ai.service";
import MovieCard from "@/components/card/movies";

export default function AIRecommendationsSection() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        // Request 4 movies to ensure a full row
        const res = await aiService.getMovieRecommendations("Recommend 4 top-rated blockbuster movies.");
        if (res && res.success && res.data?.movies) {
          setRecommendations(res.data.movies.slice(0, 4));
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
          <h2 className="text-2xl font-black italic uppercase tracking-tight text-white">AI Personalized Picks</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[2/3] bg-zinc-900 animate-pulse rounded-2xl border border-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (!recommendations.length) return null;

  return (
    <section className="py-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black italic uppercase tracking-tight text-white">AI Personalized Picks</h2>
            <p className="text-[10px] text-purple-400 font-bold uppercase tracking-[0.2em] mt-1">Curated by CineBuddy</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 relative z-10">
        {recommendations.map((movie, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <MovieCard
              id={movie.id}
              title={movie.title}
              posterUrl={movie.thumbnail || movie.posterUrl}
              rating={movie.avgRating || 0}
              year={movie.year || 2024}
              type={movie.type === "SERIES" ? "SERIES" : "MOVIE"}
              genres={movie.genres || ["Action", "Sci-fi"]}
              isPremium={movie.isPremium || movie.pricing === "PREMIUM"}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
