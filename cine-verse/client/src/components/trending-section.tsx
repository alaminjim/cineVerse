"use client";

import MovieCard, { MovieData } from "./movie-card";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const mockTrendingMovies: MovieData[] = [
  {
    id: "5",
    title: "Shogun",
    synopsis: "When a mysterious European ship is found marooned in a nearby fishing village...",
    thumbnail: "https://images.unsplash.com/photo-1558239023-e1898ff99c08?auto=format&fit=crop&q=80&w=2670",
    genre: ["Drama", "History"],
    releaseYear: 2024,
    type: "SERIES",
    pricing: "PREMIUM",
    avgRating: 4.9,
    reviewCount: 1500,
    director: "Rachel Kondo",
    streamingPlatform: ["CineVerse"],
    streamingLink: "#"
  },
  {
    id: "6",
    title: "Arcane",
    synopsis: "Set in utopian Piltover and the oppressed underground of Zaun...",
    thumbnail: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&q=80&w=2670",
    genre: ["Animation", "Action", "Adventure"],
    releaseYear: 2021,
    type: "SERIES",
    pricing: "FREE",
    avgRating: 4.8,
    reviewCount: 6200,
    director: "Christian Linke",
    streamingPlatform: ["CineVerse"],
    streamingLink: "#"
  },
  {
    id: "7",
    title: "Spider-Man: Across the Spider-Verse",
    synopsis: "Miles Morales catapults across the Multiverse...",
    thumbnail: "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=2574",
    genre: ["Animation", "Action", "Adventure"],
    releaseYear: 2023,
    type: "MOVIE",
    pricing: "PREMIUM",
    avgRating: 4.8,
    reviewCount: 4300,
    director: "Joaquim Dos Santos",
    streamingPlatform: ["CineVerse"],
    streamingLink: "#"
  },
  {
    id: "8",
    title: "Poor Things",
    synopsis: "The incredible tale about the fantastical evolution of Bella Baxter...",
    thumbnail: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=2670",
    genre: ["Comedy", "Drama", "Romance"],
    releaseYear: 2023,
    type: "MOVIE",
    pricing: "FREE",
    avgRating: 4.5,
    reviewCount: 2300,
    director: "Yorgos Lanthimos",
    streamingPlatform: ["CineVerse"],
    streamingLink: "#"
  }
];

export default function TrendingSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/50">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold mb-2">Trending <span className="gradient-text">Now</span></h2>
          <p className="text-muted-foreground">What everyone is watching this week.</p>
        </div>
        <Link href="/movies">
          <Button variant="ghost" className="hidden sm:flex group">
            View All <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mockTrendingMovies.map((movie, idx) => (
          <MovieCard key={movie.id} movie={movie} index={idx} />
        ))}
      </div>
      <div className="mt-8 text-center sm:hidden">
        <Link href="/movies">
          <Button variant="outline" className="w-full glass">
            View All Movies
          </Button>
        </Link>
      </div>
    </section>
  );
}
