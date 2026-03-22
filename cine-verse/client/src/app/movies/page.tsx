"use client";

import { useState, useMemo } from "react";
import MovieCard, { MovieData } from "@/components/movie-card";
import { Search, SlidersHorizontal } from "lucide-react";

// Mock data including more movies for testing filtering and sorting
const allMovies: MovieData[] = [
  {
    id: "1", title: "Dune: Part Two", synopsis: "...", thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=2694",
    genre: ["Sci-Fi", "Action"], releaseYear: 2024, type: "MOVIE", pricing: "PREMIUM", avgRating: 4.8, reviewCount: 3400, director: "Denis Villeneuve", streamingPlatform: [], streamingLink: "#"
  },
  {
    id: "2", title: "The Bear", synopsis: "...", thumbnail: "https://images.unsplash.com/photo-1583339174068-07eeb39a77ce?auto=format&fit=crop&q=80&w=2670",
    genre: ["Drama", "Comedy"], releaseYear: 2022, type: "SERIES", pricing: "FREE", avgRating: 4.9, reviewCount: 2200, director: "Christopher Storer", streamingPlatform: [], streamingLink: "#"
  },
  {
    id: "3", title: "Oppenheimer", synopsis: "...", thumbnail: "https://images.unsplash.com/photo-1588692735955-a0bc583f7902?auto=format&fit=crop&q=80&w=2670",
    genre: ["Biography", "Drama"], releaseYear: 2023, type: "MOVIE", pricing: "PREMIUM", avgRating: 4.7, reviewCount: 5100, director: "Christopher Nolan", streamingPlatform: [], streamingLink: "#"
  },
  {
    id: "4", title: "Stranger Things", synopsis: "...", thumbnail: "https://images.unsplash.com/photo-1616091093714-c64882e9ab55?auto=format&fit=crop&q=80&w=2670",
    genre: ["Sci-Fi", "Horror"], releaseYear: 2016, type: "SERIES", pricing: "PREMIUM", avgRating: 4.6, reviewCount: 8900, director: "The Duffer Brothers", streamingPlatform: [], streamingLink: "#"
  },
  {
    id: "5", title: "Shogun", synopsis: "...", thumbnail: "https://images.unsplash.com/photo-1558239023-e1898ff99c08?auto=format&fit=crop&q=80&w=2670",
    genre: ["Drama", "History"], releaseYear: 2024, type: "SERIES", pricing: "PREMIUM", avgRating: 4.9, reviewCount: 1500, director: "Rachel Kondo", streamingPlatform: [], streamingLink: "#"
  },
  {
    id: "6", title: "Arcane", synopsis: "...", thumbnail: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&q=80&w=2670",
    genre: ["Animation", "Action"], releaseYear: 2021, type: "SERIES", pricing: "FREE", avgRating: 4.8, reviewCount: 6200, director: "Christian Linke", streamingPlatform: [], streamingLink: "#"
  },
];

export default function MoviesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"Newest" | "Rating">("Newest");

  const genres = ["All", "Action", "Drama", "Sci-Fi", "Comedy", "Horror", "Animation"];

  const filteredAndSortedMovies = useMemo(() => {
    let result = allMovies;

    // Search filter
    if (searchTerm) {
      result = result.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Genre filter
    if (selectedGenre !== "All") {
      result = result.filter(m => m.genre.includes(selectedGenre));
    }

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === "Newest") return b.releaseYear - a.releaseYear;
      if (sortBy === "Rating") return b.avgRating - a.avgRating;
      return 0;
    });

    return result;
  }, [searchTerm, selectedGenre, sortBy]);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-10 space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Discover <span className="gradient-text">Movies & Series</span></h1>
          <p className="text-muted-foreground">Browse our entire premium catalog.</p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center glass p-4 rounded-2xl border border-border">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search titles..."
              className="w-full bg-background/50 border border-border rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 px-3 py-2 bg-background/50 border border-border rounded-xl overflow-x-auto">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground mr-1" />
              {genres.map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${selectedGenre === g ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}
                >
                  {g}
                </button>
              ))}
            </div>

            <select
              title="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "Newest" | "Rating")}
              className="bg-background/50 border border-border rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="Newest">Newest First</option>
              <option value="Rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredAndSortedMovies.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredAndSortedMovies.map((movie, idx) => (
            <MovieCard key={movie.id} movie={movie} index={idx} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-card rounded-2xl border border-border">
          <h3 className="text-2xl font-bold mb-2">No results found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
