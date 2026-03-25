"use client";

import { ScrollText, ShieldCheck, Info } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-12 border-b border-gray-900 pb-8">
          <div className="bg-purple-600/20 p-4 rounded-2xl">
            <ScrollText className="w-8 h-8 text-purple-500" />
          </div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">Terms of Service</h1>
        </div>
        
        <div className="space-y-8 text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-500" /> 1. Acceptance of Terms
            </h2>
            <p>By accessing and using CineVerse, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-purple-500" /> 2. Use of Service
            </h2>
            <p>Our platform provides movie discovery, reviews, and streaming links. You agree to use the service for personal, non-commercial purposes only. Any unauthorized use of the platform is strictly prohibited.</p>
          </section>
          
          <section className="p-8 bg-gray-900/20 border border-gray-800 rounded-3xl">
             <p className="text-sm italic">These terms are currently being updated. Please check back regularly for the latest version of our agreement.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
