/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import MovieCard from "@/components/card/movies";


export default function TopRatedSection({ movies }: { movies: any[] }) {
  if (!movies || movies.length === 0) return null;

  return (
    <section className="py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Top <span className="text-yellow-500">Rated</span>
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
        {movies.map((movie: any) => (
          <MovieCard
            key={movie.id}
            {...movie}
            posterUrl={movie.thumbnail}
            rating={movie.avgRating || 0}
          />
        ))}
      </div>
    </section>
  );
}
