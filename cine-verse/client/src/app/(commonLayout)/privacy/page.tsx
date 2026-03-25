"use client";

import { Shield, Lock, Eye } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-12 border-b border-gray-900 pb-8">
          <div className="bg-blue-600/20 p-4 rounded-2xl">
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">Privacy Policy</h1>
        </div>
        
        <div className="space-y-8 text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-500" /> 1. Data Collection
            </h2>
            <p>We respect your privacy. CineVerse only collects essential data required to provide you with a personalized experience, such as your email and watchlist preferences during account creation.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-500" /> 2. Information Usage
            </h2>
            <p>Your data is never sold to third parties. We use it strictly for authentication, managing your subscriptions, and improving the content recommendations shown to you.</p>
          </section>

          <section className="p-8 bg-gray-900/20 border border-gray-800 rounded-3xl border-dashed">
             <p className="text-sm italic">CineVerse is committed to protecting your personal information. If you have any questions, please contact our support team.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
