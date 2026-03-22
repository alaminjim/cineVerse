"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Menu, X, LogIn, Film } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? "bg-background/90 backdrop-blur-md border-border py-4 shadow-sm" 
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group z-50">
          <div className="bg-primary/20 p-2 rounded-lg text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Film className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            Cine<span className="text-primary">Verse</span>
          </span>
        </Link>

        {/* Desktop Center Links */}
        <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
          <Link href="/movies" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Movies</Link>
          <Link href="/series" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Series</Link>
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/login" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <LogIn className="w-4 h-4" /> Sign In
          </Link>
          <Link href="/signup" className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-2.5 px-6 rounded-full transition-all">
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-foreground p-2 z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-background flex flex-col items-center justify-center gap-8">
          <Link href="/" className="text-2xl font-medium" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link href="/movies" className="text-2xl font-medium text-muted-foreground" onClick={() => setIsMobileMenuOpen(false)}>Movies</Link>
          <Link href="/series" className="text-2xl font-medium text-muted-foreground" onClick={() => setIsMobileMenuOpen(false)}>Series</Link>
          <Link href="/login" className="flex items-center gap-2 text-2xl font-medium mt-4" onClick={() => setIsMobileMenuOpen(false)}>
            <LogIn className="w-6 h-6" /> Sign In
          </Link>
          <Link href="/signup" className="bg-primary text-primary-foreground text-xl font-medium py-4 px-10 rounded-full mt-4" onClick={() => setIsMobileMenuOpen(false)}>
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
