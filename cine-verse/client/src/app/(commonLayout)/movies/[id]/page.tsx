/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { moviesService } from "@/services/movies.service";
import {
  Loader2,
  Star,
  Calendar,
  Clock,
  User,
  Film,
  PlayCircle,
  Users,
  Globe,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

export default function MovieDetailsPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const res = await moviesService.getMovieById(id as string);
        setMovie(res?.data || res);
      } catch (err) {
        console.error("Error fetching movie:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black">
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 blur-2xl opacity-20 animate-pulse"></div>
          <div className="relative p-1 bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500 rounded-full animate-spin">
            <div className="bg-black rounded-full p-2">
              <Loader2 className="text-purple-400 w-12 h-12 stroke-[2px]" />
            </div>
          </div>
        </div>
        <p className="text-gray-500 font-bold tracking-[0.3em] uppercase animate-pulse">
          CineVerse Loading...
        </p>
      </div>
    );

  if (!movie)
    return (
      <div className="text-white text-center py-40">Movie data not found!</div>
    );

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          href="/movies"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-10 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Catalog
        </Link>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left: Thumbnail/Poster Section */}
          <div className="lg:col-span-4 sticky top-28 h-fit">
            <div className="relative rounded-[2rem] overflow-hidden border border-gray-800 shadow-2xl shadow-purple-500/10 group">
              <img
                src={movie.thumbnail}
                alt={movie.title}
                className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
              />
              {/* Premium Badge */}
              {movie.pricing === "PREMIUM" && (
                <div className="absolute top-6 left-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-[10px] font-black px-4 py-1.5 rounded-full shadow-xl uppercase tracking-widest">
                  Premium
                </div>
              )}
            </div>
          </div>

          {/* Right: Content Section */}
          <div className="lg:col-span-8 space-y-10">
            {/* Title and Stats */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-600">
                {movie.title}
              </h1>

              <div className="flex flex-wrap gap-6 text-sm font-bold text-gray-400">
                <div className="flex items-center gap-2 text-yellow-500">
                  <Star className="w-5 h-5 fill-yellow-500" />
                  <span className="text-lg">
                    {movie.avgRating?.toFixed(1) || "0.0"}
                  </span>
                </div>
                <div className="flex items-center gap-2 border-l border-gray-800 pl-6">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  <span>{movie.releaseYear}</span>
                </div>
                {movie.runtime && (
                  <div className="flex items-center gap-2 border-l border-gray-800 pl-6">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span>{movie.runtime} Min</span>
                  </div>
                )}
                <div className="flex items-center gap-2 border-l border-gray-800 pl-6">
                  <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded text-[10px] tracking-widest uppercase">
                    {movie.type}
                  </span>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase text-purple-500 font-black tracking-[0.4em]">
                Synopsis
              </h3>
              <p className="text-gray-400 text-xl leading-relaxed font-light">
                {movie.synopsis}
              </p>
            </div>

            {/* Watch Button */}
            <div className="pt-4">
              <a
                href={movie.streamingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 bg-white text-black font-black py-5 px-14 rounded-full hover:bg-purple-600 hover:text-white transition-all shadow-2xl shadow-purple-500/20 active:scale-95 group text-lg"
              >
                <PlayCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
                WATCH NOW
              </a>
            </div>

            {/* Badges Grid (Cast, Genre, Platforms) */}
            <div className="grid md:grid-cols-2 gap-10 pt-10 border-t border-gray-900">
              {/* Column 1: Director & Cast */}
              <div className="space-y-8">
                <div className="space-y-3">
                  <h4 className="text-xs uppercase text-purple-500 font-black tracking-[0.3em]">
                    Director
                  </h4>
                  <div className="flex items-center gap-3 bg-gray-900/40 w-fit px-4 py-2 rounded-xl border border-gray-800">
                    <User className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-200 font-medium">
                      {movie.director}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs uppercase text-purple-500 font-black tracking-[0.3em]">
                    Starring Cast
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {movie.cast?.map((actor: string, index: number) => (
                      <span
                        key={index}
                        className="bg-gray-900/60 text-gray-300 text-xs font-medium px-4 py-2 rounded-lg border border-gray-800 hover:border-purple-500/50 hover:text-white transition-all"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Column 2: Genres & Platforms */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h4 className="text-xs uppercase text-blue-500 font-black tracking-[0.3em]">
                    Genres
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {movie.genre?.map((g: string, index: number) => (
                      <span
                        key={index}
                        className="bg-blue-500/10 text-blue-400 text-[10px] font-black px-4 py-1.5 rounded-md border border-blue-500/20 uppercase tracking-widest"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs uppercase text-green-500 font-black tracking-[0.3em]">
                    Available On
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {movie.streamingPlatform?.map(
                      (platform: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-gradient-to-br from-gray-900 to-black px-5 py-2.5 rounded-xl border border-gray-800 shadow-xl"
                        >
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-gray-300 text-sm font-bold uppercase tracking-tighter">
                            {platform}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
              {/* End of Badges Grid */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
