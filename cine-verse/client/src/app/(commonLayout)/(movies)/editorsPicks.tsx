/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import MovieCard from "@/components/card/movies";

export default function EditorsPicksSection({ movies }: { movies: any[] }) {
  if (!movies || movies.length === 0) return null;

  return (
    <section className="py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter">
          Editor&apos;s <span className="text-purple-500">Picks</span>
        </h2>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Hand-picked for you</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
        {movies.map((movie: any) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
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
    </section>
  );
}
