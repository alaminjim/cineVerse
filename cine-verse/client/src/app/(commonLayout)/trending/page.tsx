"use client";

import { TrendingUp, Flame, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { moviesService } from "@/services/movies.service";
import MovieCard from "@/components/card/movies";

export default function TrendingPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const res = await moviesService.getAllMovies({ sortBy: "avgRating", limit: 10 });
        setMovies(res?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-900 pb-8">
          <div className="flex items-center gap-4">
            <div className="bg-orange-600/20 p-4 rounded-2xl">
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase italic tracking-tighter">Trending Now</h1>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Most popular titles this week</p>
            </div>
          </div>
        </div>

        {loading ? (
             <div className="py-20 text-center text-gray-500 uppercase tracking-widest text-xs font-bold animate-pulse">
                Fetching Current Trends...
             </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((item: any) => (
               <MovieCard
               key={item.id}
               id={item.id}
               title={item.title}
               posterUrl={item.thumbnail}
               rating={item.avgRating}
               type={item.type}
               year={item.releaseYear}
               genres={item.genre}
               isPremium={item.pricing === "PREMIUM"}
             />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
