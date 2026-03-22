"use client";

import { motion } from "framer-motion";
import { Play, Info, Search } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with precise dark overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-[#000]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center mt-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center w-full max-w-4xl mx-auto"
        >
          {/* Badge */}
          <span className="inline-block py-1.5 px-5 rounded-full bg-blue-950/40 text-blue-400 text-xs font-bold tracking-widest uppercase mb-8 border border-blue-500/30 backdrop-blur-sm">
            Premium Cinema Experience
          </span>
          
          {/* Hero Title */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tight text-white whitespace-pre-line">
            {'Unlimited \n'}
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">Entertainment</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-base md:text-lg text-gray-400 mb-12 max-w-2xl font-medium px-4">
            Discover, stream, and review the most trending movies and series. All in one place.
          </p>
          
          {/* Search Bar Component */}
          <div className="w-full max-w-2xl relative mb-14 group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
            </div>
            <input 
              type="text" 
              className="w-full bg-[#0f0f13] border border-gray-800 text-white text-base rounded-full focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 block pl-14 pr-[130px] py-4 transition-all outline-none" 
              placeholder="Search for movies, TV shows, genres..." 
            />
            <button className="absolute right-2 top-2 bottom-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-full px-6 transition-colors shadow-lg shadow-purple-900/40 flex items-center justify-center">
              Search
            </button>
          </div>
          
          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full px-4">
            <button className="flex items-center justify-center gap-2 text-base font-semibold py-4 px-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] hover:-translate-y-1 w-full sm:w-auto">
              <Play fill="currentColor" className="w-5 h-5" /> Start Watching
            </button>
            <button className="flex items-center justify-center gap-2 text-base font-semibold py-4 px-8 rounded-full bg-[#15151a] hover:bg-[#1f1f26] border border-gray-800 hover:border-gray-700 text-white transition-all hover:-translate-y-1 w-full sm:w-auto">
              <Info className="w-5 h-5 text-gray-400" /> More Info
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
