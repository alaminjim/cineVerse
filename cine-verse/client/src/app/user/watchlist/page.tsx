/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { watchlistService } from "@/services/watchlist.service";
import Link from "next/link";
import {
  Loader2,
  Bookmark,
  Star,
  Trash2,
  Film,
} from "lucide-react";
import toast from "react-hot-toast";

export default function WatchlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [removeLoading, setRemoveLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await watchlistService.getWatchlist();
        setItems(res || []);
      } catch (error) {
        console.error("Watchlist error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, []);

  const handleRemove = async (movieId: string) => {
    try {
      setRemoveLoading(movieId);
      await watchlistService.removeFromWatchlist(movieId);
      setItems((prev) => prev.filter((item) => item.movie?.id !== movieId));
      toast.success("Removed from watchlist!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to remove");
    } finally {
      setRemoveLoading(null);
    }
  };

  return (
    <div className="text-white">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
          My Watchlist
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Movies you saved to watch later
        </p>
      </div>

      {loading ? (
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <Bookmark className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 text-lg italic mb-4">
            Your watchlist is empty.
          </p>
          <Link
            href="/movies"
            className="text-purple-400 font-bold hover:text-purple-300 underline underline-offset-4"
          >
            Browse Movies →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {items.map((item) => (
            <div key={item.id} className="group relative">
              <Link href={`/movies/${item.movie?.id}`}>
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={item.movie?.thumbnail}
                    alt={item.movie?.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-yellow-500 text-xs font-bold">
                        {item.movie?.avgRating?.toFixed(1) || "0.0"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
              <div className="mt-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm truncate">
                    {item.movie?.title}
                  </p>
                  <p className="text-gray-500 text-xs mt-1 truncate">
                    {item.movie?.genre?.join(", ")}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(item.movie?.id)}
                  disabled={removeLoading === item.movie?.id}
                  className="text-gray-600 hover:text-red-500 transition-all p-1 shrink-0"
                >
                  {removeLoading === item.movie?.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
