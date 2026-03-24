/* eslint-disable react/no-unescaped-entities */
"use client";

import { motion, Variants } from "framer-motion";
import {
  Film,
  Info,
  ShieldCheck,
  Zap,
  Globe,
  Github,
  Users,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function InfoPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: "Instant Streaming",
      description:
        "Experience zero-buffer 4K streaming on any device, anywhere in the world.",
    },
    {
      icon: <Star className="w-6 h-6 text-purple-400" />,
      title: "Premium Content",
      description:
        "Exclusive access to the latest blockbusters and critically acclaimed series.",
    },
    {
      icon: <Users className="w-6 h-6 text-blue-400" />,
      title: "Community Driven",
      description:
        "Read and write authentic reviews from a global community of cinephiles.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-400" />,
      title: "Secure & Private",
      description:
        "Your data and viewing history are protected with industry-leading encryption.",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-20">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[120px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold tracking-widest uppercase mb-8">
              <Info className="w-4 h-4" /> About CineVerse
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter">
              Redefining the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-blue-500">
                Cinematic Journey
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
              CineVerse is more than just a streaming platform. It's a digital
              sanctuary for movie lovers, designed to bridge the gap between
              premium content and passionate viewers.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="p-8 rounded-3xl bg-black border border-white/5 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-black mb-8 italic uppercase tracking-tighter underline decoration-primary underline-offset-8">
                Our Mission
              </h2>
              <div className="space-y-6 text-gray-400 font-medium">
                <p>
                  At CineVerse, we believe that every story deserves to be told
                  in its best possible light. Our mission is to provide an
                  accessible, high-quality, and community-centric platform where
                  filmmakers and enthusiasts can connect.
                </p>
                <p>
                  We are constantly innovating our technology stack to ensure
                  that your experience is seamless, secure, and always at the
                  cutting edge of digital entertainment.
                </p>
              </div>

              <div className="mt-12 flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">50K+</span>
                  <span className="text-xs text-gray-600 font-bold uppercase tracking-widest">
                    Active Users
                  </span>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">12K+</span>
                  <span className="text-xs text-gray-600 font-bold uppercase tracking-widest">
                    Movie Titles
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 border border-white/10"
            >
              <img
                src="https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop"
                alt="Cinema Background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 flex items-center gap-3">
                <div className="bg-primary p-2 rounded-full">
                  <Film className="w-4 h-4 text-black" />
                </div>
                <span className="text-sm font-bold tracking-widest uppercase">
                  The Future of Cinema
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 text-center border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8">
            Join the CineVerse Revolution
          </h2>
          <div className="flex justify-center gap-6">
            <Link
              href="https://github.com/alaminjim/cineVerse"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" /> GitHub
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Globe className="w-5 h-5" /> Website
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
