/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { moviesService } from "@/services/movies.service";
import { Loader2, Clapperboard, Search } from "lucide-react";
import MovieCard from "@/components/card/movies";

export default function AllMoviesPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await moviesService.getAllMovies();
        const movieData = res?.data || res;
        setMovies(Array.isArray(movieData) ? movieData : []);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black">
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 blur-2xl opacity-20 animate-pulse"></div>

          <div className="relative p-1 bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500 rounded-full animate-spin">
            <div className="bg-black rounded-full p-2">
              <Loader2 className="text-purple-400 w-12 h-12 stroke-[2px]" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-black tracking-widest uppercase italic bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-pulse">
            CineVerse
          </h2>

          <div className="mt-4 flex gap-1.5">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
          </div>

          <p className="mt-6 text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] opacity-50">
            Loading Catalog...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-black min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-900 pb-8">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500 p-3 rounded-xl shadow-lg shadow-red-900/20">
              <Clapperboard className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                All Movies
              </h1>
              <p className="text-gray-500 text-sm font-medium">
                Total <span className="text-red-300">{movies.length}</span>{" "}
                titles in catalog
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title..."
              className="w-full bg-gray-900/50 border border-gray-800 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all placeholder:text-gray-600"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
            {filteredMovies.map((movie: any) => (
              <MovieCard
                key={movie._id}
                id={movie._id}
                title={movie.title}
                posterUrl={movie.thumbnail}
                rating={movie.avgRating || 0}
                type={movie.type || "MOVIE"}
                year={movie.year}
                genres={movie.genres || []}
                isPremium={movie.isPremium}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-40">
            <div className="inline-block p-6 bg-gray-900/30 rounded-full mb-4">
              <Search className="w-12 h-12 text-gray-700" />
            </div>
            <p className="text-gray-500 text-xl font-light italic">
              {searchTerm
                ? `No results found for "${searchTerm}"`
                : "The catalog is empty."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
