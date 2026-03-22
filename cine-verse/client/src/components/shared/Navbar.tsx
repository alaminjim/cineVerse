"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Menu, X, User, Bell } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass-effect py-3" : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-3xl font-bold tracking-tighter">
          <span className="gradient-text">Cine</span>Verse
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
          <Link href="/movies" className="text-gray-300 hover:text-white transition-colors">Movies</Link>
          <Link href="/series" className="text-gray-300 hover:text-white transition-colors">Series</Link>
          <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-6">
          <div className="relative group">
            <Search className="w-5 h-5 text-gray-400 group-hover:text-white cursor-pointer transition-colors" />
          </div>
          <Bell className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
          <button className="btn-primary flex items-center gap-2">
            <User className="w-4 h-4" /> Sign In
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-300"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "100vh" }}
          className="md:hidden glass-effect absolute top-full left-0 w-full flex flex-col items-center pt-10 gap-6"
        >
          <Link href="/" className="text-xl text-gray-200" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link href="/movies" className="text-xl text-gray-200" onClick={() => setIsMobileMenuOpen(false)}>Movies</Link>
          <Link href="/series" className="text-xl text-gray-200" onClick={() => setIsMobileMenuOpen(false)}>Series</Link>
          <Link href="/pricing" className="text-xl text-gray-200" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
          <button className="btn-primary mt-4">Sign In</button>
        </motion.div>
      )}
    </motion.nav>
  );
}
