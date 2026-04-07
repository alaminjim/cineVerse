"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, Film, Star, Loader2, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/lib/axiosInstance";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  title: string;
  thumbnail: string | null;
  avgRating: number;
  genre: string[];
  releaseYear: number;
  type: string;
}

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Debounced search
  const searchMovies = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/ai/search-suggestions?query=${encodeURIComponent(searchQuery.trim())}`
      );
      setResults(response.data?.data || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length >= 2) {
      setLoading(true);
      debounceRef.current = setTimeout(() => {
        searchMovies(query);
      }, 350);
    } else {
      setResults([]);
      setLoading(false);
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, searchMovies]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      // Escape to close
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Keyboard navigation in results
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < results.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : results.length - 1
      );
    } else if (e.key === "Enter" && selectedIndex >= 0 && results[selectedIndex]) {
      e.preventDefault();
      router.push(`/movies/${results[selectedIndex].id}`);
      closeSearch();
    } else if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      router.push(`/movies?searchTerms=${encodeURIComponent(query.trim())}`);
      closeSearch();
    }
  };

  const closeSearch = () => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
  };

  const openSearch = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search Trigger Button */}
      <button
        onClick={openSearch}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 hover:border-purple-500/30 hover:bg-white/5 transition-all group"
      >
        <Search className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
        <span className="text-xs text-gray-500 hidden lg:inline font-medium">
          Search...
        </span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-gray-500 bg-white/5 rounded border border-white/10">
          ⌘K
        </kbd>
      </button>

      {/* Search Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              onClick={closeSearch}
            />

            {/* Search Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[90vw] max-w-[580px] z-[101]"
            >
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(20,20,35,0.98), rgba(12,12,24,0.99))",
                  border: "1px solid rgba(139, 92, 246, 0.15)",
                  boxShadow:
                    "0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(139, 92, 246, 0.08)",
                }}
              >
                {/* Search Input */}
                <div
                  className="flex items-center gap-3 px-5 py-4"
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <Search className="w-5 h-5 text-purple-400 shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSelectedIndex(-1);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Search movies, series, actors, directors..."
                    className="flex-1 bg-transparent text-white text-sm font-medium placeholder:text-gray-500 focus:outline-none"
                    autoFocus
                  />
                  {loading && (
                    <Loader2 className="w-4 h-4 text-purple-400 animate-spin shrink-0" />
                  )}
                  {query && !loading && (
                    <button
                      onClick={() => {
                        setQuery("");
                        setResults([]);
                        inputRef.current?.focus();
                      }}
                      className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                  <button
                    onClick={closeSearch}
                    className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    ESC
                  </button>
                </div>

                {/* Results */}
                <div className="max-h-[50vh] overflow-y-auto">
                  {/* No query state */}
                  {!query.trim() && (
                    <div className="p-6 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-3">
                        <TrendingUp className="w-6 h-6 text-purple-400" />
                      </div>
                      <p className="text-sm text-gray-400 font-medium">
                        Start typing to search movies & series
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Search by title, director, genre, or actor
                      </p>
                    </div>
                  )}

                  {/* Loading state */}
                  {query.trim().length >= 2 && loading && results.length === 0 && (
                    <div className="p-6 flex items-center justify-center gap-3">
                      <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                      <span className="text-sm text-gray-400">
                        Searching...
                      </span>
                    </div>
                  )}

                  {/* No results */}
                  {query.trim().length >= 2 &&
                    !loading &&
                    results.length === 0 && (
                      <div className="p-6 text-center">
                        <Film className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">
                          No results for &ldquo;{query}&rdquo;
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Try a different search term
                        </p>
                      </div>
                    )}

                  {/* Results list */}
                  {results.length > 0 && (
                    <div className="py-2">
                      <div className="px-5 py-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                          Results ({results.length})
                        </span>
                      </div>
                      {results.map((movie, index) => (
                        <Link
                          key={movie.id}
                          href={`/movies/${movie.id}`}
                          onClick={closeSearch}
                          className={`flex items-center gap-3 px-5 py-3 transition-all ${
                            selectedIndex === index
                              ? "bg-purple-500/10"
                              : "hover:bg-white/5"
                          }`}
                          onMouseEnter={() => setSelectedIndex(index)}
                        >
                          {/* Thumbnail */}
                          <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-800">
                            {movie.thumbnail ? (
                              <img
                                src={movie.thumbnail}
                                alt={movie.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Film className="w-5 h-5 text-gray-600" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {movie.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] text-gray-500">
                                {movie.releaseYear}
                              </span>
                              <span className="text-gray-700">•</span>
                              <span className="text-[11px] text-purple-400 font-medium">
                                {movie.type}
                              </span>
                              {movie.genre?.length > 0 && (
                                <>
                                  <span className="text-gray-700">•</span>
                                  <span className="text-[11px] text-gray-500 truncate">
                                    {movie.genre.slice(0, 2).join(", ")}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Rating */}
                          {movie.avgRating > 0 && (
                            <div className="flex items-center gap-1 shrink-0">
                              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                              <span className="text-xs font-bold text-yellow-500">
                                {movie.avgRating.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </Link>
                      ))}

                      {/* View all results */}
                      <div
                        className="px-5 py-3"
                        style={{
                          borderTop: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        <Link
                          href={`/movies?searchTerms=${encodeURIComponent(query.trim())}`}
                          onClick={closeSearch}
                          className="text-xs text-purple-400 hover:text-purple-300 font-semibold transition-colors flex items-center gap-1.5"
                        >
                          <Search className="w-3.5 h-3.5" />
                          View all results for &ldquo;{query}&rdquo;
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
