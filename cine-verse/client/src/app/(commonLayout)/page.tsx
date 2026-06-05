/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { moviesService, pingServer } from "@/services/movies.service";
import { reviewService } from "@/services/review.service";
import Hero from "./hero/page";
import NewReleaseSection from "./(movies)/newReleases";
import TopRatedSection from "./(movies)/topRatings";
import AllMoviesSection from "./(movies)/allMovies";
import EditorsPicksSection from "./(movies)/editorsPicks";
import ComingSoonSection from "./(movies)/comingSoon";
import CommunityHighlightsSection from "./(movies)/communityHighlights";
import SubscriptionPlansSection from "./subscription/subscriptionPlans";
import FAQSection from "./faqSection";
import StreamingMarquee from "@/components/StreamingMarquee";

// Fire the warm-up ping immediately when the module is imported (before React mounts)
// This hides Vercel cold start latency behind the initial JS parsing time.
if (typeof window !== "undefined") {
  pingServer();
}

function HomeSkeleton() {
  return (
    <div className="animate-pulse space-y-20 pb-20">
      {/* Section 1 skeleton */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-7 bg-gray-800/80 rounded-lg w-48" />
          <div className="h-4 bg-gray-800/60 rounded w-16" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="aspect-[2/3] bg-gray-900/70 rounded-xl" />
          ))}
        </div>
      </div>
      {/* Section 2 skeleton */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-7 bg-gray-800/80 rounded-lg w-36" />
          <div className="h-4 bg-gray-800/60 rounded w-16" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="aspect-[2/3] bg-gray-900/70 rounded-xl" />
          ))}
        </div>
      </div>
      {/* Section 3 skeleton */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-7 bg-gray-800/80 rounded-lg w-44" />
          <div className="h-4 bg-gray-800/60 rounded w-16" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[2/3] bg-gray-900/70 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [newReleases, setNewReleases] = useState<any[]>([]);
  const [comingSoon, setComingSoon] = useState<any[]>([]);
  const [editorsPicks, setEditorsPicks] = useState<any[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [allMovies, setAllMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadAll = async () => {
      try {
        // Fire ALL requests simultaneously — no waterfall, no waves.
        // The server warm-up ping was already sent at module load time.
        const [nRes, fRes, cRes, eRes, rRes, aRes] = await Promise.allSettled([
          moviesService.getNewReleases(),
          moviesService.getFeatured(),
          moviesService.getComingSoon(),
          moviesService.getEditorsPicks(),
          reviewService.getRecentApprovedReviews(),
          moviesService.getAllMovies({ limit: 6 }),
        ]);

        if (cancelled) return;

        const safeArray = (res: PromiseSettledResult<any>) => {
          if (res.status === "rejected") return [];
          const val = res.value;
          return Array.isArray(val) ? val : (val?.data ?? []);
        };

        setNewReleases(safeArray(nRes));
        setFeatured(safeArray(fRes));
        setComingSoon(safeArray(cRes));
        setEditorsPicks(safeArray(eRes));
        setRecentReviews(safeArray(rRes));

        if (aRes.status === "fulfilled") {
          const val = aRes.value;
          if (val?.data && Array.isArray(val.data)) setAllMovies(val.data);
          else if (Array.isArray(val)) setAllMovies(val);
          else setAllMovies(val?.data ?? []);
        }
      } catch (err) {
        console.error("HomePage data error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadAll();
    return () => { cancelled = true; };
  }, []);

  return (
    <main className="bg-black min-h-screen text-white">
      <Hero />
      <div className="max-w-7xl mx-auto px-6 space-y-20 pb-20">
        {loading ? (
          <HomeSkeleton />
        ) : (
          <>
            {newReleases.length > 0 && <NewReleaseSection movies={newReleases} />}
            {featured.length > 0 && <TopRatedSection movies={featured} />}
            {editorsPicks.length > 0 && <EditorsPicksSection movies={editorsPicks} />}
            {allMovies.length > 0 && <AllMoviesSection movies={allMovies} />}
            {recentReviews.length > 0 && <CommunityHighlightsSection reviews={recentReviews} />}
            {comingSoon.length > 0 && <ComingSoonSection movies={comingSoon} />}
          </>
        )}

        {/* Always visible */}
        <SubscriptionPlansSection />
        <FAQSection />

        {/* Contact CTA */}
        <div>
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/10 opacity-50 rounded-[3rem]" />
            <div className="relative bg-[#050505] border border-white/5 rounded-[3rem] p-10 md:p-20 text-center shadow-2xl overflow-hidden group">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full -translate-y-1/2" />
              <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-6 text-white leading-tight">
                Still have <br className="md:hidden" />{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  questions?
                </span>
              </h2>
              <p className="text-gray-400 text-base md:text-lg font-medium max-w-xl mx-auto mb-12 leading-relaxed">
                Our support team is always here to help you get the best cinematic experience.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="px-10 py-5 bg-white text-black rounded-2xl font-black uppercase italic tracking-wider hover:bg-purple-600 hover:text-white hover:scale-105 transition-all duration-300 shadow-xl shadow-white/5"
                >
                  Contact Support Team
                </Link>
                <Link
                  href="/help"
                  className="px-10 py-5 bg-white/5 text-gray-300 border border-white/10 rounded-2xl font-black uppercase italic tracking-wider hover:bg-white/10 transition-all duration-300"
                >
                  Visit Help Center
                </Link>
              </div>
            </div>
          </div>
        </div>

        {!loading && !newReleases.length && !featured.length && !allMovies.length && !comingSoon.length && (
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
