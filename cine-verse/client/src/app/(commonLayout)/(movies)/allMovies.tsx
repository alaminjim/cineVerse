/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import MovieCard from "@/components/card/movies";

export default function AllMoviesSection({ movies }: { movies: any[] }) {
  if (!movies || !Array.isArray(movies) || movies.length === 0) {
    return null;
  }

  return (
    <section className="py-12 border-t border-white/5 mt-10">
      <div className="mb-8">
        <span className="text-gray-500 text-[10px] font-black tracking-widest uppercase">
          CineVerse Library
        </span>
        <h2 className="text-3xl font-bold text-white">
          Explore <span className="text-gray-500">All Movies</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies
          ?.map((movie: any) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              posterUrl={movie.thumbnail}
              rating={movie.avgRating || 0}
              type={movie.type}
              year={movie.releaseYear}
              genres={movie.genre}
              isPremium={movie.pricing === "PREMIUM"}
            />
          ))
          .slice(0, 5)}
      </div>
    </section>
  );
}
