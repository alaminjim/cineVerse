"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Play, Star } from "lucide-react";

interface MovieCardProps {
  title: string;
  image: string;
  rating: number;
  year: string;
  delay?: number;
}

export default function MovieCard({ title, image, rating, year, delay = 0 }: MovieCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -10 }}
      className="group relative rounded-xl overflow-hidden cursor-pointer"
    >
      <div className="relative aspect-[2/3] w-full">
        {/* We use standard img for external URLs if not configured in next.config.ts, but next/image is preferred if domains are set */}
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100">
          <div className="w-14 h-14 rounded-full bg-purple-600/80 backdrop-blur-sm flex items-center justify-center text-white">
            <Play fill="currentColor" className="w-6 h-6 ml-1" />
          </div>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
          <h3 className="text-lg font-bold text-white truncate">{title}</h3>
          <div className="flex items-center justify-between text-sm text-gray-300 mt-1">
            <span>{year}</span>
            <div className="flex items-center gap-1 text-yellow-400">
              <Star fill="currentColor" className="w-3.5 h-3.5" />
              <span className="text-white text-xs font-semibold">{rating}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
