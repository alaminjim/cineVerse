"use client";

import { motion } from "framer-motion";
import MovieCard, { MovieData } from "./movie-card";

const mockFeaturedMovies: MovieData[] = [
  {
    id: "1",
    title: "Dune: Part Two",
    synopsis: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=2694",
    genre: ["Sci-Fi", "Action", "Adventure"],
    releaseYear: 2024,
    type: "MOVIE",
    pricing: "PREMIUM",
    avgRating: 4.8,
    reviewCount: 3400,
    director: "Denis Villeneuve",
    streamingPlatform: ["CineVerse"],
    streamingLink: "#"
  },
  {
    id: "2",
    title: "The Bear",
    synopsis: "A young chef from the fine dining world returns to Chicago to run his family's sandwich shop.",
    thumbnail: "https://images.unsplash.com/photo-1583339174068-07eeb39a77ce?auto=format&fit=crop&q=80&w=2670",
    genre: ["Drama", "Comedy"],
    releaseYear: 2022,
    type: "SERIES",
    pricing: "FREE",
    avgRating: 4.9,
    reviewCount: 2200,
    director: "Christopher Storer",
    streamingPlatform: ["CineVerse"],
    streamingLink: "#"
  },
  {
    id: "3",
    title: "Oppenheimer",
    synopsis: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    thumbnail: "https://images.unsplash.com/photo-1588692735955-a0bc583f7902?auto=format&fit=crop&q=80&w=2670",
    genre: ["Biography", "Drama", "History"],
    releaseYear: 2023,
    type: "MOVIE",
    pricing: "PREMIUM",
    avgRating: 4.7,
    reviewCount: 5100,
    director: "Christopher Nolan",
    streamingPlatform: ["CineVerse"],
    streamingLink: "#"
  },
  {
    id: "4",
    title: "Stranger Things",
    synopsis: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.",
    thumbnail: "https://images.unsplash.com/photo-1616091093714-c64882e9ab55?auto=format&fit=crop&q=80&w=2670",
    genre: ["Sci-Fi", "Horror", "Drama"],
    releaseYear: 2016,
    type: "SERIES",
    pricing: "PREMIUM",
    avgRating: 4.6,
    reviewCount: 8900,
    director: "The Duffer Brothers",
    streamingPlatform: ["CineVerse"],
    streamingLink: "#"
  }
];

export default function FeaturedSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold mb-2">Featured <span className="gradient-text">Top Picks</span></h2>
          <p className="text-muted-foreground">Handpicked selections for your premium entertainment.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mockFeaturedMovies.map((movie, idx) => (
          <MovieCard key={movie.id} movie={movie} index={idx} />
        ))}
      </div>
    </section>
  );
}
