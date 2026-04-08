"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Film,
  Github,
  Youtube,
  Linkedin,
  Twitch,
  Star,
  Play,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#" },
        { name: "Movies", href: "/movies" },
        { name: "TV Series", href: "/series" },
        { name: "Pricing", href: "/subscription" },
        { name: "CineBuddy AI", href: "#" },
      ],
    },
    {
      title: "Explore",
      links: [
        { name: "Trending Now", href: "/trending" },
        { name: "Top Rated", href: "#" },
        { name: "New Releases", href: "#" },
        { name: "Community", href: "#" },
        { name: "Watchlist", href: "/user/watchlist" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "FAQs", href: "/help" },
        { name: "Contact Us", href: "/contact" },
        { name: "Billing", href: "#" },
        { name: "Status", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Careers", href: "#" },
        { name: "Press", href: "#" },
        { name: "Partners", href: "#" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-black relative overflow-hidden pt-32 pb-10">
      {/* --- GLOWING GLOBE & EFFECTS SECTION --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] pointer-events-none flex justify-center items-center">
        {/* Main Glowing Sphere */}
        <div className="relative w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-purple-900 via-fuchsia-800 to-pink-600 opacity-40 blur-3xl mix-blend-screen" />

        {/* Core Planet (Solid, subtle inner glow) */}
        <div className="absolute top-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-b from-[#4c1d95] to-black shadow-[inset_0_-20px_50px_rgba(0,0,0,0.9),0_0_50px_rgba(168,85,247,0.4)] border border-purple-500/20" />

        {/* Orbit Lines */}
        <div className="absolute top-[10%] w-[600px] h-[150px] rounded-[100%] border border-pink-500/30 -rotate-12 shadow-[0_0_15px_rgba(236,72,153,0.2)]" />
        <div className="absolute top-[20%] w-[500px] h-[100px] rounded-[100%] border border-cyan-500/30 rotate-12 shadow-[0_0_15px_rgba(6,182,212,0.2)]" />

        {/* Floating Abstract Elements */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[15%] w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-600 blur-[2px] opacity-80 shadow-[0_0_30px_rgba(168,85,247,0.6)] flex items-center justify-center transform -rotate-12"
        >
          <Play className="w-8 h-8 text-white fill-white/20" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 25, 0], rotate: [0, -15, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-[10%] right-[20%] w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 blur-[1px] opacity-90 shadow-[0_0_40px_rgba(236,72,153,0.7)] flex items-center justify-center"
        >
          <Film className="w-8 h-8 text-white" />
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] left-[25%] text-pink-400"
        >
          <Sparkles className="w-6 h-6" />
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.6, 0.2] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-[25%] right-[30%] text-cyan-400"
        >
          <Star className="w-4 h-4 fill-cyan-400" />
        </motion.div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 mt-[250px]">
        {/* Footnote Text (GitHub Style) */}
        <div className="max-w-4xl mb-16 text-[11px] leading-relaxed text-gray-500 font-medium">
          <p className="mb-2">
            <sup className="mr-1">1</sup> This cinematic experience factor is
            based on data from millions of users across the globe who choose
            CineVerse for their daily entertainment, experiencing seamless 4K
            streaming and AI-powered recommendations.
          </p>
          <p className="mb-2">
            <sup className="mr-1">2</sup> The AI CineBuddy feature utilizes
            advanced natural language models to ensure you find exactly the
            movie you want in milliseconds, outperforming standard search
            engines by 7X.
          </p>
          <p>
            <sup className="mr-1">3</sup> There are now over 10 million movie
            lovers around the world using CineVerse.
          </p>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16 text-sm">
          {/* Logo Column */}
          <div className="col-span-2 md:col-span-1 mb-8 md:mb-0">
            <Link
              href="/"
              className="flex items-center gap-2 group inline-flex hover:opacity-80 transition-opacity"
            >
              <Film className="w-6 h-6 text-white" />
              <span className="text-xl font-bold tracking-tight text-white">
                CineVerse
              </span>
            </Link>
          </div>

          {/* Links Columns */}
          {footerLinks.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-gray-400 font-semibold mb-5">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      href={link.href}
                      className="text-gray-500 hover:text-blue-400 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[12px] text-gray-500 bg-black">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span>&copy; {new Date().getFullYear()} CineVerse, Inc.</span>
            <Link
              href="/terms"
              className="hover:text-blue-400 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="hover:text-blue-400 transition-colors"
            >
              Privacy
            </Link>
            <Link href="#" className="hover:text-blue-400 transition-colors">
              Manage cookies
            </Link>
            <Link href="#" className="hover:text-blue-400 transition-colors">
              Do not share my personal information
            </Link>
          </div>

          <div className="flex items-center gap-5 text-gray-400">
            <a
              href="#"
              className="hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors"
              aria-label="Twitch"
            >
              <Twitch className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
