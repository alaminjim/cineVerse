/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { moviesService } from "@/services/movies.service";
import { Loader2, Clapperboard, Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import MovieCard from "@/components/card/movies";

const GENRES = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Thriller", "Romance", "Adventure", "Fantasy", "Animation", "Crime", "Mystery"];
const TYPES = ["MOVIE", "SERIES"];
const SORT_OPTIONS = [
  { label: "Newest Arrivals", value: "createdAt", order: "desc" },
  { label: "Highest Rated", value: "avgRating", order: "desc" },
  { label: "Most Popular", value: "reviewCount", order: "desc" },
];

function MoviesContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [movies, setMovies] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [searchTerms, setSearchTerms] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [genre, setGenre] = useState("");
  const [type, setType] = useState("");
  const [activeSort, setActiveSort] = useState(0);
  const [page, setPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerms);
      setPage(1); 
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerms]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const sortOpt = SORT_OPTIONS[activeSort];
        
        const res = await moviesService.getAllMovies({
          searchTerms: debouncedSearch,
          genre,
          type,
          sortBy: sortOpt.value,
          sortOrder: sortOpt.order,
          page,
          limit: 15,
        });
        
        setMovies(res?.data || []);
        setMeta(res?.meta || null);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [debouncedSearch, genre, type, activeSort, page]);

  const getPageNumbers = () => {
    if (!meta) return [];
    const total = meta.totalPages;
    const current = page;
    const delta = 2;

    if (total <= 7) {
      return Array.from({ length: total }).map((_, i) => i + 1);
    }

    const range = [];
    for (
      let i = Math.max(2, current - delta);
      i <= Math.min(total - 1, current + delta);
      i++
    ) {
      range.push(i);
    }

    if (current - delta > 2) range.unshift("...");
    if (current + delta < total - 1) range.push("...");

    range.unshift(1);
    range.push(total);

    return range;
  };

  return (
    <main className="bg-black min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-gray-900 pb-8">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500 p-3 rounded-xl shadow-lg shadow-red-900/20">
              <Clapperboard className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                {searchTerms ? "Search Results" : "All Movies"}
              </h1>
              <p className="text-gray-500 text-sm font-medium">
                {meta ? `Showing ${movies.length} of ${meta.total} titles` : "Loading..."}
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, director, cast..."
              value={searchTerms}
              className="w-full bg-gray-900/50 border border-gray-800 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all placeholder:text-gray-600"
              onChange={(e) => setSearchTerms(e.target.value)}
            />
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col lg:flex-row justify-between gap-6 mb-12">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-gray-500 mr-2">
              <Filter className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest font-bold">Filters</span>
            </div>
            
            <select
              value={type}
              onChange={(e) => { setType(e.target.value); setPage(1); }}
              className="bg-gray-900 border border-gray-800 text-gray-300 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5 outline-none custom-select"
            >
              <option value="">Any Type</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <select
              value={genre}
              onChange={(e) => { setGenre(e.target.value); setPage(1); }}
              className="bg-gray-900 border border-gray-800 text-gray-300 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5 outline-none custom-select"
            >
              <option value="">All Genres</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            {SORT_OPTIONS.map((opt, idx) => (
              <button
                key={opt.label}
                onClick={() => { setActiveSort(idx); setPage(1); }}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${
                  activeSort === idx
                    ? "bg-purple-600/20 border-purple-500 text-purple-400"
                    : "bg-transparent border-gray-800 text-gray-500 hover:border-gray-600"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-40 flex justify-center">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
              {movies.map((movie: any) => (
                <MovieCard
                  key={movie.id || movie._id}
                  id={movie.id || movie._id}
                  title={movie.title}
                  posterUrl={movie.thumbnail}
                  rating={movie.avgRating || 0}
                  type={movie.type}
                  year={movie.releaseYear}
                  genres={movie.genre || []}
                  isPremium={movie.pricing === "PREMIUM"}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {meta && (
              <div className="mt-16 flex items-center justify-center gap-2 md:gap-3 flex-wrap">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-800 text-gray-300 font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800 transition-all flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="hidden sm:inline">Prev Page</span>
                </button>

                <div className="flex items-center gap-2">
                  {getPageNumbers().map((p, i) => (
                    <button
                      key={i}
                      disabled={p === "..."}
                      onClick={() => p !== "..." && setPage(p as number)}
                      className={`min-w-[44px] h-11 px-2 rounded-xl flex items-center justify-center text-sm font-black transition-all ${
                        p === page
                          ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                          : p === "..."
                          ? "bg-transparent text-gray-500 cursor-default"
                          : "bg-gray-900 border border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={page === meta.totalPages}
                  className="px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-800 text-gray-300 font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800 transition-all flex items-center gap-2"
                >
                  <span className="hidden sm:inline">Next Page</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-40">
            <div className="inline-block p-6 bg-gray-900/30 rounded-full mb-4">
              <Search className="w-12 h-12 text-gray-700" />
            </div>
            <p className="text-gray-500 text-xl font-light italic">
              {searchTerms || genre || type
                ? "No movies found matching your filters."
                : "The catalog is empty."}
            </p>
            {(searchTerms || genre || type) && (
              <button
                onClick={() => {
                  setSearchTerms("");
                  setGenre("");
                  setType("");
                  setActiveSort(0);
                  setPage(1);
                }}
                className="mt-6 text-purple-400 hover:text-purple-300 font-bold tracking-wider text-sm uppercase underline underline-offset-4"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function AllMoviesPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-black">
          <Loader2 className="animate-spin text-purple-600 w-10 h-10" />
        </div>
      }
    >
      <MoviesContent />
    </Suspense>
  );
}
