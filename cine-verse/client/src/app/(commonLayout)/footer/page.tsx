"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Film } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border py-16">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group inline-flex">
              <div className="bg-primary/20 p-2 rounded-lg text-primary">
                <Film className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground">
                Cine<span className="text-primary">Verse</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Your premium destination for discovering, tracking, and enjoying movies.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-6">Platform</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/movies" className="hover:text-primary transition-colors">Movies</Link></li>
              <li><Link href="/series" className="hover:text-primary transition-colors">TV Series</Link></li>
              <li><Link href="/trending" className="hover:text-primary transition-colors">Trending Now</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-6">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CineVerse Entertainment.</p>
          <div className="flex items-center gap-2">
            <span>Designed with ♥ for movie lovers.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
