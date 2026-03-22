"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, bounce: 0.4 } }
  };

  return (
    <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Dynamic Background Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background/80 dark:bg-background/90 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
        {/* Placeholder for actual background image */}
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2625&auto=format&fit=crop')] 
          bg-cover bg-center"
        />
      </div>

      <motion.div 
        className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="space-y-4 mb-8">
          <span className="inline-block px-4 py-1.5 rounded-full glass border border-primary/30 text-primary text-sm font-medium tracking-wider mb-2">
            PREMIUM CINEMA EXPERIENCE
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            Unlimited <span className="gradient-text">Entertainment</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover, stream, and review the most trending movies and series. 
            All in one place.
          </p>
        </motion.div>

        {/* Search Bar with Suggestions Mockup */}
        <motion.div variants={itemVariants} className="max-w-2xl mx-auto mb-10 relative">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-secondary/50 to-primary/50 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative flex items-center bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-2">
              <Search className="h-6 w-6 text-muted-foreground ml-3 mr-2" />
              <input 
                type="text" 
                placeholder="Search for movies, TV shows, genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-foreground placeholder-muted-foreground h-12 text-lg px-2"
              />
              <Button size="lg" className="rounded-xl gradient-bg-strong text-white border-0 px-8 hover:opacity-90 transition-opacity">
                Search
              </Button>
            </div>
          </div>
          
          {/* Mock Suggestions */}
          {searchQuery && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-4 glass-card rounded-2xl p-4 text-left z-50 border border-border shadow-xl backdrop-blur-2xl"
            >
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Suggestions</h4>
              <ul className="space-y-1">
                {["Inception", "Interstellar", "The Dark Knight"].filter(m => m.toLowerCase().includes(searchQuery.toLowerCase())).map(movie => (
                  <li key={movie} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-primary/10 cursor-pointer transition-colors text-foreground">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    {movie}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>

        {/* CTAs */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="rounded-full px-8 h-14 text-base font-semibold gradient-bg-strong text-white border-0 hover:scale-105 transition-transform duration-300 w-full sm:w-auto">
            <Play className="mr-2 h-5 w-5 fill-white" /> Start Watching
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base font-semibold glass border-border hover:bg-white/10 transition-all duration-300 w-full sm:w-auto">
            <Info className="mr-2 h-5 w-5" /> More Info
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
