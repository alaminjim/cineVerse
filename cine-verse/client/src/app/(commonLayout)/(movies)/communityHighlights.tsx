/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { MessageCircle, Star, Quote } from "lucide-react";
import Link from "next/link";

export default function CommunityHighlightsSection({ reviews }: { reviews: any[] }) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="py-20 relative">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter flex items-center gap-3">
            <MessageCircle className="text-purple-500 w-8 h-8" />
            Community <span className="text-purple-500">Highlights</span>
          </h2>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-2">What our members are saying</p>
        </div>
        <Link href="/movies" className="text-purple-400 text-xs font-black uppercase tracking-widest hover:text-purple-300 transition-all border-b border-purple-500/20 pb-1">
          Explore All Reviews →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review: any) => (
          <div
            key={review.id}
            className="group bg-gray-900/40 border border-gray-800/50 rounded-3xl p-8 hover:border-purple-500/30 transition-all duration-500 relative"
          >
            <Quote className="absolute top-6 right-8 w-10 h-10 text-gray-800 group-hover:text-purple-900/40 transition-colors" />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-purple-500/20">
                {review.user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <h4 className="font-bold text-white group-hover:text-purple-400 transition-colors">{review.user?.name || "Member"}</h4>
                <div className="flex items-center gap-1 mt-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < Math.floor(review.rating / 2) ? "text-yellow-500 fill-yellow-500" : "text-gray-700"}`}
                    />
                  ))}
                  <span className="text-[10px] text-gray-500 font-bold ml-1 uppercase">{review.rating}/10</span>
                </div>
              </div>
            </div>

            <Link href={`/movies/${review.movie?.id}`} className="block mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-500/60 mb-1 block">Reviewing</span>
              <h5 className="text-white font-black italic uppercase leading-none truncate md:max-w-[200px]">
                {review.movie?.title}
              </h5>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 italic font-medium">
              &quot;{review.content}&quot;
            </p>

            <div className="mt-8 pt-6 border-t border-gray-800/50 flex items-center justify-between">
               <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                 {new Date(review.createdAt).toLocaleDateString()}
               </span>
               <Link href={`/movies/${review.movie?.id}`} className="text-[10px] font-black uppercase text-white hover:text-purple-400 transition-colors">
                 Read Full →
               </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
