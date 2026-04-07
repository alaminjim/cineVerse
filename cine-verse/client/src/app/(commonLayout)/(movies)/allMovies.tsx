/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import MovieCard from "@/components/card/movies";
import Link from "next/link";

export default function AllMoviesSection({ movies }: { movies: any[] }) {
  if (!movies || !Array.isArray(movies) || movies.length === 0) {
    return null;
  }

  return (
    <section className="py-12 border-t border-white/5 mt-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <span className="text-gray-500 text-[10px] font-black tracking-widest uppercase">
            CineVerse Library
          </span>
          <h2 className="text-2xl font-bold text-white">
          Discover <span className="text-emerald-500">More</span>
        </h2>
        </div>
        
        <Link 
          href="/movies"
          className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all text-center sm:w-fit"
        >
          View Full Catalog
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
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
              language={movie.language}
              isPremium={movie.pricing === "PREMIUM"}
            />
          ))
          .slice(0, 5)}
      </div>
    </section>
  );
}
