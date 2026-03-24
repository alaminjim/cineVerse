/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { moviesService } from "@/services/movies.service";
import Hero from "./hero/page";
import NewReleaseSection from "./(movies)/newReales";
import TopRatedSection from "./(movies)/topRatigs";
import AllMoviesSection from "./(movies)/allMovies";
import StreamingMarquee from "@/components/StreamingMarquee";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [newReleases, setNewReleases] = useState<any[]>([]);
  const [allMovies, setAllMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      const [fRes, nRes, aRes] = await Promise.all([
        moviesService.getFeatured(),
        moviesService.getNewReleases(),
        moviesService.getAllMovies(),
      ]);

      setFeatured(Array.isArray(fRes) ? fRes : []);

      setNewReleases(Array.isArray(nRes) ? nRes : []);

      if (aRes && aRes.data && Array.isArray(aRes.data)) {
        setAllMovies(aRes.data);
      } else if (Array.isArray(aRes)) {
        setAllMovies(aRes);
      } else {
        setAllMovies([]);
      }
    } catch (error) {
      console.error("Fetch error on HomePage:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black">
        <Loader2 className="animate-spin text-primary w-12 h-12 mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">
          Loading CineVerse...
        </p>
      </div>
    );
  }

  return (
    <main className="bg-black min-h-screen">
      <Hero />

      <div className="max-w-7xl mx-auto px-6 space-y-16 pb-20">
        {newReleases.length > 0 && <NewReleaseSection movies={newReleases} />}

        {featured.length > 0 && <TopRatedSection movies={featured} />}

        {allMovies.length > 0 && <AllMoviesSection movies={allMovies} />}

        {!newReleases.length && !featured.length && !allMovies.length && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg font-light italic">
              No movies available in the catalog yet.
            </p>
          </div>
        )}
      </div>
      <StreamingMarquee />
    </main>
  );
}
