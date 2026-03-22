"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Clock, Tv } from "lucide-react";

export interface MovieData {
  id: string;
  title: string;
  synopsis: string;
  thumbnail: string | null;
  genre: string[];
  releaseYear: number;
  type: "MOVIE" | "SERIES";
  pricing: "FREE" | "PREMIUM";
  avgRating: number;
  reviewCount: number;
  director: string;
  streamingPlatform: string[];
  streamingLink: string | null;
  runtime?: number | null;
  seasons?: number | null;
  episodes?: number | null;
  cast?: string[];
  buyPrice?: number | null;
  rentPrice?: number | null;
}

interface MovieCardProps {
  movie: MovieData;
  index?: number;
}

export default function MovieCard({ movie, index = 0 }: MovieCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="group"
    >
      <Link href={`/movies/${movie.id}`}>
        <div className="glass-card rounded-xl overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/10">
          {/* Poster */}
          <div className="relative aspect-[2/3] overflow-hidden bg-muted">
            {movie.thumbnail ? (
              <Image
                src={movie.thumbnail}
                alt={movie.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/30">
                {movie.type === "SERIES" ? (
                  <Tv className="h-12 w-12 text-muted-foreground/50" />
                ) : (
                  <Clock className="h-12 w-12 text-muted-foreground/50" />
                )}
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Rating badge */}
            {movie.avgRating > 0 && (
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs font-semibold">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-100">{movie.avgRating.toFixed(1)}</span>
              </div>
            )}

            {/* Pricing badge */}
            {movie.pricing === "PREMIUM" && (
              <div className="absolute top-3 left-3 px-2 py-1 rounded-full gradient-bg-strong text-[10px] font-bold uppercase tracking-wider text-white">
                Premium
              </div>
            )}

            {/* Type badge */}
            <div className="absolute bottom-3 left-3 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {movie.type}
            </div>
          </div>

          {/* Info */}
          <div className="p-3 space-y-2">
            <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
              {movie.title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground">{movie.releaseYear}</span>
              {movie.genre.slice(0, 2).map((g) => (
                <span
                  key={g}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-accent/60 text-accent-foreground"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="glass-card rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[2/3] bg-muted" />
      <div className="p-3 space-y-2">
        <div className="h-4 w-3/4 bg-muted rounded" />
        <div className="flex gap-2">
          <div className="h-3 w-10 bg-muted rounded" />
          <div className="h-3 w-14 bg-muted rounded-full" />
        </div>
      </div>
    </div>
  );
}
