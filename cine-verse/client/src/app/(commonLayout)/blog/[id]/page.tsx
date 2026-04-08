"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { blogService } from "@/services/blog.service";
import { Loader2, ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function BlogDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        if (params.id) {
          const res = await blogService.getBlogById(params.id as string);
          if (res.success) {
            setBlog(res.data);
          } else {
            router.push('/blog');
          }
        }
      } catch (error) {
        console.error("Fetch blog error:", error);
        router.push('/blog');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white space-y-6">
        <h2 className="text-3xl font-black italic uppercase tracking-widest text-purple-500">Blog Not Found</h2>
        <Link href="/blog" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-all">
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 selection:bg-purple-500/30">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors uppercase font-black text-xs tracking-widest mb-10 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Articles
        </Link>

        {/* Hero Section */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
        >
          <div className="flex gap-3 mb-6">
            <span className="bg-purple-900/30 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              {blog.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-8 leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-12">
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-400" /> {new Date(blog.publishDate).toLocaleDateString()}</div>
            <div className="flex items-center gap-2"><User className="w-4 h-4 text-purple-400" /> {blog.author}</div>
          </div>
        </motion.div>

        {/* Feature Image */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="w-full aspect-video rounded-[32px] overflow-hidden border border-white/10 mb-16 relative group"
        >
          <img 
            src={blog.image} 
            alt={blog.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </motion.div>

        {/* Content */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.4 }}
           className="prose prose-invert prose-purple max-w-none text-gray-300 leading-relaxed font-medium text-lg mb-16 whitespace-pre-line"
        >
          {blog.content}
        </motion.div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 0.6, delay: 0.6 }}
             className="flex items-center gap-4 flex-wrap pt-8 border-t border-white/10"
          >
             <Tag className="w-5 h-5 text-gray-500" />
             {blog.tags.map((tag: string) => (
                <span key={tag} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-gray-400">
                   #{tag}
                </span>
             ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
