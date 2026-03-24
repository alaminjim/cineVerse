"use client";

import { motion } from "framer-motion";

const PLATFORMS = [
  { name: "Netflix", color: "#E50914" },
  { name: "Disney+", color: "#0063E5" },
  { name: "HBO Max", color: "#991BFA" },
  { name: "Prime Video", color: "#00A8E1" },
  { name: "Apple TV+", color: "#FFFFFF" },
  { name: "Hulu", color: "#1CE783" },
  { name: "Paramount+", color: "#0064FF" },
  { name: "Peacock", color: "#000000" },
];

export default function StreamingMarquee() {
  // Duplicate for infinite effect
  const duplicatedPlatforms = [...PLATFORMS, ...PLATFORMS, ...PLATFORMS];

  return (
    <section className="py-20 bg-black overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-col items-start">
          <span className="text-primary text-[10px] font-black tracking-widest uppercase mb-2">
            Available Everywhere
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Watch on Your <span className="text-gray-500 text-shadow-glow">Favorite Platforms</span>
          </h2>
        </div>
      </div>

      <div className="relative">
        {/* Gradient Fades */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />

        <motion.div
          className="flex gap-12 items-center whitespace-nowrap"
          animate={{
            x: [0, -1920], // Adjust based on content width
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {duplicatedPlatforms.map((platform, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 group cursor-pointer"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:border-primary/50 transition-all duration-300"
                style={{ boxShadow: `0 0 20px ${platform.color}10` }}
              >
                <div 
                  className="w-6 h-6 rounded-md" 
                  style={{ backgroundColor: platform.color }}
                />
              </div>
              <span className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-gray-400 group-hover:text-white transition-colors duration-300">
                {platform.name}
              </span>
              
              {/* Dot Separator */}
              <div className="w-2 h-2 rounded-full bg-primary/20 mx-4" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
