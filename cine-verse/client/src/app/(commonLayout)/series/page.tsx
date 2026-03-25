"use client";

import { Tv, Sparkles, LayoutGrid } from "lucide-react";
import MovieCard from "@/components/card/movies";
import { useEffect, useState } from "react";
import { moviesService } from "@/services/movies.service";

export default function SeriesPage() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);
        const res = await moviesService.getAllMovies({ type: "SERIES", limit: 10 });
        setSeries(res?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeries();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-900 pb-8">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-600/20 p-4 rounded-2xl">
              <Tv className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase italic tracking-tighter">TV Series</h1>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Discover premium episodic content</p>
            </div>
          </div>
        </div>

        {loading ? (
             <div className="py-20 text-center text-gray-600 uppercase tracking-widest text-xs font-bold animate-pulse">
                Loading Series Catalog...
             </div>
        ) : series.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {series.map((item: any) => (
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
        ) : (
          <div className="py-20 text-center text-gray-600">
             <LayoutGrid className="w-16 h-16 mx-auto mb-4 opacity-20" />
             <p className="font-bold uppercase tracking-widest text-xs">No series found in the catalog.</p>
          </div>
        )}
      </div>
    </div>
  );
}
