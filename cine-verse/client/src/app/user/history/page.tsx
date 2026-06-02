"use client";

import { useState, useEffect } from "react";
import { userService } from "@/services/user.service";
import { 
  History, 
  Film, 
  Clock, 
  PlayCircle, 
  ChevronRight,
  TrendingUp,
  Loader2,
  Bookmark
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function UserHistoryPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await userService.getUserDashboard();
        if (res.success) {
          setData(res.data);
        }
      } catch (error) {
        console.error("History fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center bg-black">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
      </div>
    );
  }

  const recentReviews = data?.recentReviews || [];
  const watchlistItems = data?.watchlistItems || [];

  return (
    <div className="bg-black min-h-screen text-white pt-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
           <div className="bg-purple-600/20 p-3 rounded-2xl border border-purple-500/20">
              <History className="w-8 h-8 text-purple-400" />
           </div>
           <div>
              <h1 className="text-4xl font-black uppercase italic tracking-tighter">Your <span className="text-purple-500">History.</span></h1>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Movies you've interacted with</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           
           {/* Section: Recently Saved (Watchlist) */}
           <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between">
                 <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <Bookmark className="w-4 h-4" /> Recently Saved
                 </h2>
                 <Link href="/user/watchlist" className="text-[10px] font-black uppercase tracking-widest text-purple-400 hover:text-purple-300">View All</Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {watchlistItems.length > 0 ? (
                   watchlistItems.map((item: any) => (
                     <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group bg-gray-900/40 border border-gray-800/50 rounded-3xl p-5 backdrop-blur-xl hover:border-purple-500/30 transition-all cursor-pointer"
                     >
                        <div className="flex gap-4">
                           <div className="w-20 h-28 rounded-xl overflow-hidden shadow-2xl border border-gray-800 shrink-0">
                              <img src={item.movie?.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                           </div>
                           <div className="flex flex-col justify-center min-w-0">
                              <h3 className="font-bold text-white truncate text-base leading-tight mb-1">{item.movie?.title}</h3>
                              <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-4">Saved</p>
                              <Link href={`/movies/${item.movie?.id}`} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                                 Watch Now <ChevronRight className="w-3 h-3" />
                              </Link>
                           </div>
                        </div>
                     </motion.div>
                   ))
                 ) : (
                   <div className="col-span-2 py-20 text-center bg-gray-900/20 rounded-3xl border border-dashed border-gray-800">
                      <Film className="w-10 h-10 text-gray-700 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium italic">No recent history yet.</p>
                   </div>
                 )}
              </div>

              {/* Your Recent Reviews */}
              <div className="pt-10">
                 <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Your Thoughts
                 </h2>
                 <div className="space-y-4">
                    {recentReviews.map((review: any) => (
                      <div key={review.id} className="bg-gray-900/20 border border-gray-800/30 rounded-2xl p-6 flex flex-col sm:flex-row gap-6">
                         <div className="flex-1">
                            <p className="text-gray-300 italic text-sm mb-4">"{review.content}"</p>
                            <div className="flex items-center gap-4">
                               <div className="flex items-center gap-1 text-yellow-500">
                                  <Star className="w-3 h-3 fill-current" />
                                  <span className="text-xs font-black">{review.rating}/10</span>
                               </div>
                               <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                                  Posted {new Date(review.createdAt).toLocaleDateString()}
                               </span>
                            </div>
                         </div>
                         <div className="w-full sm:w-32 h-20 rounded-xl overflow-hidden border border-gray-800 shrink-0">
                            <img src={review.movie?.thumbnail} className="w-full h-full object-cover" />
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Quick Activity Stats Sidebar */}
           <div className="space-y-8">
              <div className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-3xl">
                 <Clock className="w-10 h-10 text-purple-400 mb-6" />
                 <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4 leading-none">Stay <br/> <span className="text-purple-500">Connected.</span></h3>
                 <p className="text-gray-400 text-sm font-medium mb-8">You've interacted with <span className="text-white font-bold">{recentReviews.length + watchlistItems.length}</span> titles this month.</p>
                 <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                       <span className="text-xs font-bold text-gray-400">Total Activity</span>
                       <span className="text-sm font-black text-white">{data?.stats?.totalReviews + data?.stats?.watchlistCount || 0}</span>
                    </div>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}

function Star(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
