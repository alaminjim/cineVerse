"use client";

import { motion } from "framer-motion";
import { Play, Info } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
      {/* Background with Dark Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 text-center md:text-left flex flex-col md:flex-row items-center pt-20">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="md:w-2/3"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-purple-900/50 text-purple-300 text-sm font-semibold mb-6 border border-purple-500/30">
            Exclusive Premiere
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
            Discover the <br />
            <span className="gradient-text">Cinematic Universe</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
            Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV without paying more. Experience the magic of cinema right from you home.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="btn-primary flex items-center justify-center gap-2 text-lg py-3 px-8">
              <Play fill="currentColor" className="w-5 h-5" /> Watch Trailer
            </button>
            <button className="btn-secondary flex items-center justify-center gap-2 text-lg py-3 px-8 bg-black/40 backdrop-blur-md">
              <Info className="w-5 h-5" /> More Info
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
