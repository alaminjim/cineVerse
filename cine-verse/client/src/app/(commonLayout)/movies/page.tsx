/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { moviesService } from "@/services/movies.service";
import { aiService } from "@/services/ai.service";
import { Loader2, Clapperboard, Search, ChevronLeft, ChevronRight, Filter, X, Sparkles, Wand2 } from "lucide-react";
import MovieCard from "@/components/card/movies";

const GENRES = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Thriller", "Romance", "Adventure", "Fantasy", "Animation", "Crime", "Mystery"];
const TYPES = ["MOVIE", "SERIES"];
const PLATFORMS = ["Netflix", "Disney+", "Amazon Prime", "Hulu", "HBO Max", "Apple TV+", "Paramount+", "Crunchyroll"];
const LANGUAGES = ["English", "Hindi", "Spanish", "French", "Japanese", "Korean", "German", "Bengali"];
const RATINGS = [
  { label: "Any Rating", value: "" },
  { label: "5+ Stars", value: "5" },
  { label: "7+ Stars", value: "7" },
  { label: "8+ Stars", value: "8" },
  { label: "9+ Stars", value: "9" },
];
const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() + 1 - i);

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
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  
  const [genre, setGenre] = useState("");
  const [type, setType] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [ratingFrom, setRatingFrom] = useState("");
  const [streamingPlatform, setStreamingPlatform] = useState("");
  const [language, setLanguage] = useState("");
  const [activeSort, setActiveSort] = useState(0);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerms);
      setPage(1); 
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerms]);

  // AI Smart Suggestions Logic
  useEffect(() => {
    const fetchAiSuggestions = async () => {
      if (debouncedSearch.length < 3) {
        setAiSuggestions([]);
        return;
      }
      try {
        setAiLoading(true);
        const res = await aiService.getMovieRecommendations(debouncedSearch);
        const suggestions = res.data?.recommendation?.split('\n').filter((s: string) => s.trim()).slice(0, 3) || [];
        setAiSuggestions(suggestions);
        setShowAiSuggestions(true);
      } catch (err) {
        console.error("AI Search Error:", err);
      } finally {
        setAiLoading(false);
      }
    };
    fetchAiSuggestions();
  }, [debouncedSearch]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const sortOpt = SORT_OPTIONS[activeSort];
        
        const res = await moviesService.getAllMovies({
          searchTerms: debouncedSearch,
          genre,
          type,
          releaseYear,
          ratingFrom,
          streamingPlatform,
          language,
          sortBy: sortOpt.value,
          sortOrder: sortOpt.order,
          page,
          limit: 12,
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
  }, [debouncedSearch, genre, type, releaseYear, ratingFrom, streamingPlatform, language, activeSort, page]);

  const clearFilters = () => {
    setSearchTerms("");
    setGenre("");
    setType("");
    setReleaseYear("");
    setRatingFrom("");
    setStreamingPlatform("");
    setLanguage("");
    setActiveSort(0);
    setPage(1);
  };

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
            <div className="bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500 p-3 rounded-2xl shadow-xl shadow-purple-900/10">
              <Clapperboard className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">
                {searchTerms ? "Search Results" : "Discovery"}
              </h1>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">
                {meta ? `Displaying ${movies.length} of ${meta.total} titles` : "Updating catalog..."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
              <form 
                onSubmit={(e) => e.preventDefault()}
                onBlur={() => setTimeout(() => setShowAiSuggestions(false), 200)}
                className="relative w-full md:w-80"
              >
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                 <input
                   type="text"
                   placeholder="Titles, people, stories..."
                   value={searchTerms}
                   onFocus={() => searchTerms.length > 2 && setShowAiSuggestions(true)}
                   className="w-full bg-gray-900/40 border border-gray-800 text-white pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600/50 transition-all placeholder:text-gray-600 text-sm font-medium"
                   onChange={(e) => setSearchTerms(e.target.value)}
                 />
                 
                 {/* AI Suggestions Dropdown */}
                 {showAiSuggestions && (aiLoading || aiSuggestions.length > 0) && (
                   <div className="absolute top-full mt-2 w-full bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-3 bg-purple-600/10 border-b border-gray-800 flex items-center gap-2">
                         <Sparkles className="w-3 h-3 text-purple-400" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">AI Smart Suggestions</span>
                      </div>
                      <div className="p-2">
                        {aiLoading ? (
                          <div className="p-4 flex items-center justify-center gap-3">
                             <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
                             <span className="text-xs text-gray-500 font-medium italic">Gemini is thinking...</span>
                          </div>
                        ) : (
                          aiSuggestions.map((s, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setSearchTerms(s.replace(/^\d+\.\s*/, ''));
                                setShowAiSuggestions(false);
                              }}
                              className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-all group flex items-start gap-3"
                            >
                               <Wand2 className="w-4 h-4 text-gray-600 group-hover:text-purple-500 transition-colors mt-0.5 shrink-0" />
                               <span className="text-sm text-gray-400 group-hover:text-white transition-colors line-clamp-2">{s.replace(/^\d+\.\s*/, '')}</span>
                            </button>
                          ))
                        )}
                      </div>
                   </div>
                 )}
              </form>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3 rounded-2xl border transition-all ${showFilters ? 'bg-purple-600 border-purple-500 text-white' : 'bg-gray-900/40 border-gray-800 text-gray-500 hover:text-white'}`}
              >
                <Filter className="w-5 h-5" />
              </button>
          </div>
        </div>

        {/* Expanded Filters */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showFilters ? 'max-h-[500px] mb-12' : 'max-h-0'}`}>
          <div className="bg-gray-900/20 border border-gray-800/50 rounded-[2rem] p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Format</label>
                <select
                  value={type}
                  onChange={(e) => { setType(e.target.value); setPage(1); }}
                  className="w-full bg-gray-900/50 border border-gray-800 text-gray-300 text-sm rounded-xl p-3 outline-none focus:border-purple-500 transition-colors appearance-none"
                >
                  <option value="">All Formats</option>
                  {TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Genre</label>
                <select
                  value={genre}
                  onChange={(e) => { setGenre(e.target.value); setPage(1); }}
                  className="w-full bg-gray-900/50 border border-gray-800 text-gray-300 text-sm rounded-xl p-3 outline-none focus:border-purple-500 transition-colors appearance-none"
                >
                  <option value="">All Genres</option>
                  {GENRES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Year</label>
                <select
                  value={releaseYear}
                  onChange={(e) => { setReleaseYear(e.target.value); setPage(1); }}
                  className="w-full bg-gray-900/50 border border-gray-800 text-gray-300 text-sm rounded-xl p-3 outline-none focus:border-purple-500 transition-colors appearance-none"
                >
                  <option value="">Any Year</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Rating</label>
                <select
                  value={ratingFrom}
                  onChange={(e) => { setRatingFrom(e.target.value); setPage(1); }}
                  className="w-full bg-gray-900/50 border border-gray-800 text-gray-300 text-sm rounded-xl p-3 outline-none focus:border-purple-500 transition-colors appearance-none"
                >
                  {RATINGS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Platform</label>
                <select
                  value={streamingPlatform}
                  onChange={(e) => { setStreamingPlatform(e.target.value); setPage(1); }}
                  className="w-full bg-gray-900/50 border border-gray-800 text-gray-300 text-sm rounded-xl p-3 outline-none focus:border-purple-500 transition-colors appearance-none"
                >
                  <option value="">Any Platform</option>
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Language</label>
                <select
                  value={language}
                  onChange={(e) => { setLanguage(e.target.value); setPage(1); }}
                  className="w-full bg-gray-900/50 border border-gray-800 text-gray-300 text-sm rounded-xl p-3 outline-none focus:border-purple-500 transition-colors appearance-none"
                >
                  <option value="">Any Language</option>
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-800/50 gap-6">
               <button 
                onClick={clearFilters}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
               >
                 <X className="w-3 h-3" /> Reset Filters
               </button>
               <div className="flex flex-wrap justify-center sm:justify-end gap-2">
                 {SORT_OPTIONS.map((opt, idx) => (
                    <button
                      key={opt.label}
                      onClick={() => { setActiveSort(idx); setPage(1); }}
                      className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-full border transition-all ${
                        activeSort === idx
                          ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/20"
                          : "bg-transparent border-gray-800 text-gray-500 hover:border-gray-600"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Syncing Archive...</p>
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
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
                  language={movie.language}
                  isPremium={movie.pricing === "PREMIUM"}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {meta && (
              <div className="mt-24 flex items-center justify-center gap-2 md:gap-3 flex-wrap">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 text-gray-500 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-gray-800 hover:text-white transition-all flex items-center justify-center shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 ml-4 mr-4">
                  {getPageNumbers().map((p, i) => (
                    <button
                      key={i}
                      disabled={p === "..."}
                      onClick={() => p !== "..." && setPage(p as number)}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-[10px] font-black tracking-widest transition-all ${
                        p === page
                          ? "bg-purple-600 text-white shadow-xl shadow-purple-600/30 ring-4 ring-purple-600/10"
                          : p === "..."
                          ? "bg-transparent text-gray-700 cursor-default"
                          : "bg-gray-900 border border-gray-800 text-gray-500 hover:bg-gray-800 hover:text-white shadow-lg"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={page === meta.totalPages}
                  className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 text-gray-500 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-gray-800 hover:text-white transition-all flex items-center justify-center shadow-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-40">
            <div className="inline-block p-10 bg-gray-900/20 rounded-[2.5rem] mb-6">
              <Search className="w-16 h-16 text-gray-800" />
            </div>
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">No Matches Found</h3>
            <p className="text-gray-500 text-sm font-medium max-w-xs mx-auto mb-8">
               Try adjusting your filters or search keywords to find what you&apos;re looking for.
            </p>
            <button
                onClick={clearFilters}
                className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase italic tracking-wider hover:bg-purple-600 hover:text-white transition-all shadow-xl shadow-purple-600/10"
            >
                Clear All Filters
            </button>
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
        <div className="h-screen flex flex-col items-center justify-center bg-black">
          <Loader2 className="animate-spin text-purple-600 w-12 h-12 mb-4" />
          <p className="text-gray-500 font-black uppercase tracking-widest text-[10px] animate-pulse">Initializing Discovery...</p>
        </div>
      }
    >
      <MoviesContent />
    </Suspense>
  );
}
