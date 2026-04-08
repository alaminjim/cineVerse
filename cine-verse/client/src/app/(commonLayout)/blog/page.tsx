"use client";

import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Tag, Search, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "The Evolution of IMAX: Beyond The Big Screen",
      excerpt: "How 70mm film continues to set the standard for cinematic immersion in a digital world.",
      category: "Cinematography",
      author: "Alex Rivera",
      date: "Oct 12, 2024",
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 2,
      title: "CineBuddy AI: Behind The Scenes of Our Movie Expert",
      excerpt: "Exploring the neural networks that help our AI understand the emotional depth of cinema.",
      category: "Technology",
      author: "Sarah Chen",
      date: "Oct 10, 2024",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 3,
      title: "Hidden Gems: 5 Indie Thrillers You Missed This Year",
      excerpt: "Deep dives into the underground hits that are making waves in the world of independent film.",
      category: "Recommendations",
      author: "James Wilson",
      date: "Oct 08, 2024",
      image: "https://images.unsplash.com/photo-1542204113-e9354e712f51?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 4,
      title: "The Art of the Long Take: Masterclasses in Flow",
      excerpt: "A look at the most technically demanding tracking shots in modern cinematic history.",
      category: "Directing",
      author: "Marcus Thorne",
      date: "Oct 05, 2024",
      image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=800",
    },
  ];

  const categories = ["All", "Cinematography", "Directing", "Technology", "Reviews", "Indie", "Streaming"];

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 selection:bg-purple-500/30">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-purple-500 font-black uppercase italic tracking-[0.2em] text-xs mb-4">
              <span className="w-8 h-[1px] bg-purple-500" />
              The CinePulse Blog
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">
              Cinematic <br /> <span className="text-purple-500">Insights</span>
            </h1>
          </motion.div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-3 w-full md:w-auto">
            <Search className="w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search articles..." 
              className="bg-transparent border-none outline-none text-sm font-medium placeholder:text-gray-600 w-full md:w-64"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button 
              key={cat} 
              className={`px-5 py-2 rounded-full text-xs font-black uppercase italic tracking-widest transition-all ${
                cat === "All" 
                ? "bg-purple-600 text-white" 
                : "bg-white/5 border border-white/10 text-gray-400 hover:border-purple-500/30 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-16">
            {posts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="grid md:grid-cols-5 gap-8 items-start">
                  <div className="md:col-span-2">
                    <div className="aspect-[4/3] rounded-[32px] overflow-hidden border border-white/10 relative">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-purple-400 border border-purple-500/20">
                          {post.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-3 py-2">
                    <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-4">
                      <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {post.date}</div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full" />
                      <div className="flex items-center gap-1.5"><User className="w-3 h-3" /> {post.author}</div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight mb-4 group-hover:text-purple-400 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <Link 
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center gap-2 text-xs font-black uppercase italic tracking-widest text-white hover:gap-4 transition-all"
                    >
                      Read Full Article <ArrowRight className="w-4 h-4 text-purple-500" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}

            {/* Pagination */}
            <div className="flex justify-center pt-10">
               <button className="px-10 py-4 rounded-full border border-purple-500/20 text-purple-400 font-black uppercase italic text-sm hover:bg-purple-500/10 transition-all">
                  Load More Stories
               </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
            {/* Trending */}
            <div className="p-8 rounded-[40px] bg-zinc-900/50 border border-white/5 relative overflow-hidden">
               <TrendingUp className="absolute top-0 right-0 w-32 h-32 text-purple-500/5 -translate-y-1/4 translate-x-1/4" />
               <h3 className="text-xl font-black italic uppercase tracking-tight mb-8">Popular Now</h3>
               <div className="space-y-8">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="flex gap-4 group">
                      <span className="text-4xl font-black italic text-zinc-800 group-hover:text-purple-900 transition-colors">0{num}</span>
                      <div>
                        <h4 className="font-bold text-sm mb-2 line-clamp-2 hover:text-purple-400 cursor-pointer transition-colors">Why 4K streaming is the final frontier for physical media addicts</h4>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">5 min read</div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Newsletter */}
            <div className="p-8 rounded-[40px] bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/20">
               <h3 className="text-xl font-black italic uppercase tracking-tight mb-2">The Weekly Reel</h3>
               <p className="text-gray-500 text-xs mb-8 leading-relaxed">Join 200,000+ film lovers getting the best of CineVerse delivered to their inbox.</p>
               <div className="space-y-3">
                  <input 
                    type="email" 
                    placeholder="your@email.com" 
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xs focus:border-purple-500 transition-all font-bold placeholder:text-gray-700"
                  />
                  <button className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase italic tracking-widest text-xs hover:bg-gray-200 transition-all">
                    Subscribe
                  </button>
               </div>
            </div>

            {/* Tags */}
            <div>
               <h3 className="text-lg font-black italic uppercase tracking-tight mb-6">Popular Tags</h3>
               <div className="flex flex-wrap gap-2">
                  {["Nolan", "Sci-Fi", "Awards Ceremony", "4K", "Netflix", "Drama", "Technique"].map(tag => (
                    <span key={tag} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-gray-500 hover:text-white hover:border-white/20 cursor-pointer transition-all">
                       #{tag}
                    </span>
                  ))}
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
