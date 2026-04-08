"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Info, Search, Crown } from "lucide-react";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/movies");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-background/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center mt-12 mb-12">
        <div className="inline-flex items-center py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-8">
          Premium Cinema Experience
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.1] tracking-tighter text-foreground max-w-5xl">
          Unlimited <br className="sm:hidden" />
          <span className="text-primary italic">Entertainment</span>
        </h1>

        <p className="text-base md:text-xl text-muted-foreground mb-10 max-w-2xl px-4">
          Discover, stream, and review the most trending movies and series. All
          in one place.
        </p>

        <div className="w-full max-w-2xl relative mb-12 group px-4 sm:px-0">
          <div className="absolute inset-y-0 left-10 sm:left-6 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-secondary/50 border border-secondary text-foreground text-sm sm:text-base rounded-full focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none py-4 sm:py-5 pl-14 sm:pl-16 pr-28 sm:pr-36 transition-all shadow-2xl"
            placeholder="Search for movies..."
          />
          <button
            onClick={handleSearch}
            className="absolute right-6 sm:right-1.5 top-1.5 bottom-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-[10px] sm:text-sm font-black uppercase tracking-widest rounded-full px-5 sm:px-10 transition-all active:scale-95 shadow-lg shadow-primary/20"
          >
            Search
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-2xl mx-auto px-6 sm:px-0">
          <button
            onClick={() => router.push("/movies")}
            className="flex-1 flex items-center justify-center gap-3 font-black uppercase italic py-6 px-6 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:shadow-2xl hover:shadow-primary/40 text-primary-foreground transition-all duration-300 transform hover:scale-105 whitespace-nowrap text-sm sm:text-base"
          >
            <Play fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6" /> Start
            Watching
          </button>
          <button
            onClick={() => router.push("/subscription")}
            className="flex-1 flex items-center justify-center gap-2 font-black uppercase italic py-6 px-6 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all whitespace-nowrap text-sm sm:text-base"
          >
            <Crown className="w-5 h-5 text-purple-400" />
            Buy Premium
          </button>
        </div>
      </div>
    </section>
  );
}
