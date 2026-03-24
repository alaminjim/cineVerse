import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Info, Search } from "lucide-react";

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
      {/* Background Image & Overlay */}
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
        {/* Badge */}
        <div className="inline-flex items-center py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-8">
          Premium Cinema Experience
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tighter text-foreground max-w-5xl">
          Unlimited <br className="hidden sm:block" />
          <span className="text-primary">Entertainment</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl">
          Discover, stream, and review the most trending movies and series. All
          in one place.
        </p>

        {/* Search Bar Component */}
        <div className="w-full max-w-2xl relative mb-12">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-secondary/50 border border-border text-foreground text-base rounded-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none py-4 pl-14 pr-32"
            placeholder="Search for movies, TV shows, genres..."
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-full px-8 transition-colors"
          >
            Search
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md mx-auto">
          <button className="flex-1 flex items-center justify-center gap-2 text-base font-semibold py-4 px-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all">
            <Play fill="currentColor" className="w-5 h-5" /> Start Watching
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 text-base font-semibold py-4 px-8 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-all">
            <Info className="w-5 h-5" /> More Info
          </button>
        </div>
      </div>
    </section>
  );
}
