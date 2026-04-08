/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { moviesService } from "@/services/movies.service";
import { reviewService } from "@/services/review.service";
import Hero from "./hero/page";
import NewReleaseSection from "./(movies)/newReleases";
import TopRatedSection from "./(movies)/topRatings";
import AllMoviesSection from "./(movies)/allMovies";
import EditorsPicksSection from "./(movies)/editorsPicks";
import ComingSoonSection from "./(movies)/comingSoon";
import CommunityHighlightsSection from "./(movies)/communityHighlights";
import AIRecommendationsSection from "./(movies)/aiRecommendations";
import SubscriptionPlansSection from "./subscription/subscriptionPlans";
import FAQSection from "./faqSection";
import StreamingMarquee from "@/components/StreamingMarquee";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [newReleases, setNewReleases] = useState<any[]>([]);
  const [comingSoon, setComingSoon] = useState<any[]>([]);
  const [editorsPicks, setEditorsPicks] = useState<any[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [allMovies, setAllMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      const [fRes, nRes, cRes, eRes, rRes, aRes] = await Promise.all([
        moviesService.getFeatured(),
        moviesService.getNewReleases(),
        moviesService.getComingSoon(),
        moviesService.getEditorsPicks(),
        reviewService.getRecentApprovedReviews(),
        moviesService.getAllMovies({ limit: 6 }),
      ]);

      setFeatured(Array.isArray(fRes) ? fRes : []);
      setNewReleases(Array.isArray(nRes) ? nRes : []);
      setComingSoon(Array.isArray(cRes) ? cRes : []);
      setEditorsPicks(Array.isArray(eRes) ? eRes : []);
      setRecentReviews(Array.isArray(rRes) ? rRes : []);

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
      <main className="bg-black min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-6 space-y-24 pb-20">
          <div className="animate-pulse space-y-8">
             <div className="h-64 bg-gray-900/50 rounded-[40px] w-full mb-12" />
             <div className="flex items-center justify-between">
                <div className="h-8 bg-gray-800 rounded w-1/4" />
                <div className="h-4 bg-gray-800 rounded w-20" />
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="aspect-[2/3] bg-gray-900/50 rounded-xl" />
                ))}
             </div>
          </div>
          <div className="animate-pulse space-y-8 pt-12">
             <div className="flex items-center justify-between">
                <div className="h-8 bg-gray-800 rounded w-1/5" />
                <div className="h-4 bg-gray-800 rounded w-20" />
             </div>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-[2/3] bg-gray-900/50 rounded-xl" />
                ))}
             </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-black min-h-screen text-white">
      <Hero />
      <div className="max-w-7xl mx-auto px-6 space-y-24 pb-20">
        <AIRecommendationsSection />
        {newReleases.length > 0 && <NewReleaseSection movies={newReleases} />}

        {featured.length > 0 && <TopRatedSection movies={featured} />}

        {editorsPicks.length > 0 && <EditorsPicksSection movies={editorsPicks} />}

        {comingSoon.length > 0 && <ComingSoonSection movies={comingSoon} />}

        <SubscriptionPlansSection />

        {recentReviews.length > 0 && <CommunityHighlightsSection reviews={recentReviews} />}

        {allMovies.length > 0 && <AllMoviesSection movies={allMovies} />}

        <FAQSection />

        {/* Contact Support CTA Block */}
        {/* Enhanced Support Section */}
        <div className="pt-20">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/10 opacity-50 rounded-[3rem]" />
            <div className="relative bg-[#050505] border border-white/5 rounded-[3rem] p-10 md:p-20 text-center shadow-2xl overflow-hidden group">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full -translate-y-1/2" />
              
              <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-6 text-white leading-tight">
                Still have <br className="md:hidden" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">questions?</span>
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

        {!newReleases.length && !featured.length && !allMovies.length && !comingSoon.length && (
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
