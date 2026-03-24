"use client";

import Link from "next/link";
import { Star, Bookmark, BookmarkPlus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { watchlistService } from "@/services/watchlist.service";
import toast from "react-hot-toast";

interface MovieCardProps {
  id: string;
  title: string;
  posterUrl: string;
  rating: number;
  type: "MOVIE" | "SERIES";
  year?: number;
  genres?: string[];
  isPremium?: boolean;
}

export default function MovieCard({
  id,
  title,
  posterUrl,
  rating,
  type,
  year,
  genres = [],
  isPremium = false,
}: MovieCardProps) {
  const { user } = useAuthStore();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [loadingWatchlist, setLoadingWatchlist] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (!user) return;
      try {
        setLoadingWatchlist(true);
        const res = await watchlistService.checkWatchlist(id);
        setIsInWatchlist(res.success && res.isInWatchlist);
      } catch (error) {
        console.error("Watchlist check error:", error);
      } finally {
        setLoadingWatchlist(false);
      }
    };
    checkStatus();
  }, [id, user]);

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to add to watchlist!");
      return;
    }

    try {
      setIsToggling(true);
      if (isInWatchlist) {
        await watchlistService.removeFromWatchlist(id);
        setIsInWatchlist(false);
        toast.success("Removed from watchlist");
      } else {
        await watchlistService.addToWatchlist(id);
        setIsInWatchlist(true);
        toast.success("Added to watchlist");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update watchlist");
    } finally {
      setIsToggling(false);
    }
  };
  return (
    <Link href={`/movies/${id}`}>
      <motion.div
        whileHover={{ scale: 1.05, y: -8 }}
        whileTap={{ scale: 0.95 }}
        className="group cursor-pointer"
      >
        <div className="rounded-xl overflow-hidden bg-gray-900 shadow-xl border border-gray-800 hover:border-primary/50 transition-colors duration-300">
          <div className="relative h-80 overflow-hidden bg-gray-800">
            <img
              src={posterUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />

            <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
              <span className="bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur">
                {isPremium ? " PREMIUM" : type === "MOVIE" ? "MOVIE" : "SERIES"}
              </span>

              <div className="flex flex-col gap-2 items-end">
                <div className="bg-black/70 backdrop-blur rounded-lg px-2 py-1 flex items-center gap-1 border border-primary/30">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-white text-sm font-bold">
                    {rating.toFixed(1)}
                  </span>
                </div>

                <button
                  onClick={handleWatchlistToggle}
                  disabled={isToggling || loadingWatchlist}
                  className={`p-2 rounded-full backdrop-blur-md border transition-all duration-300 ${
                    isInWatchlist
                      ? "bg-primary text-white border-primary"
                      : "bg-black/50 text-white border-white/20 hover:bg-primary/20 hover:border-primary/50"
                  }`}
                >
                  {isToggling ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isInWatchlist ? (
                    <Bookmark className="w-4 h-4 fill-current" />
                  ) : (
                    <BookmarkPlus className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div className="p-4 bg-gradient-to-b from-gray-800 to-gray-900">
            <h3 className="text-white font-bold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {title}
            </h3>

            <div className="flex items-center justify-between mb-3">
              {year && (
                <span className="text-xs text-gray-400 font-semibold">
                  {year}
                </span>
              )}
              <span className="text-xs text-gray-500">
                {type === "MOVIE" ? "Movie" : "Series"}
              </span>
            </div>

            {genres.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {genres.slice(0, 2).map((genre, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-gray-700/50 text-gray-300 px-2 py-0.5 rounded border border-gray-600"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
