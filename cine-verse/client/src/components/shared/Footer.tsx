"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black py-12 mt-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="text-3xl font-bold tracking-tighter mb-4 inline-block">
              <span className="gradient-text">Cine</span>Verse
            </Link>
            <p className="text-gray-400 mt-2">
              Your ultimate destination for discovering, tracking, and enjoying the world of cinema.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Explore</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/movies" className="hover:text-purple-400 transition-colors">Movies</Link></li>
              <li><Link href="/series" className="hover:text-purple-400 transition-colors">TV Series</Link></li>
              <li><Link href="/trending" className="hover:text-purple-400 transition-colors">Trending</Link></li>
              <li><Link href="/genres" className="hover:text-purple-400 transition-colors">Genres</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-purple-400 transition-colors">About Us</Link></li>
              <li><Link href="/pricing" className="hover:text-purple-400 transition-colors">Pricing</Link></li>
              <li><Link href="/contact" className="hover:text-purple-400 transition-colors">Contact</Link></li>
              <li><Link href="/careers" className="hover:text-purple-400 transition-colors">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} CineVerse. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
