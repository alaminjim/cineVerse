"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle, ChevronRight } from "lucide-react";

const faqs = [
  {
    question: "How do I subscribe to CineVerse Premium?",
    answer: "You can subscribe by visiting our Subscription Plans page. Choose between Monthly or Yearly plans, and complete the secure payment through Stripe. Your premium features will be unlocked instantly.",
    category: "Subscription"
  },
  {
    question: "Can I watch movies on multiple devices?",
    answer: "Yes! Depending on your plan, you can stream on 1 (Free), 3 (Monthly), or up to 5 (Yearly) devices simultaneously.",
    category: "Streaming"
  },
  {
    question: "How do I write a movie review?",
    answer: "Simply navigate to any movie detail page. If you are logged in, you'll see a 'Write a Review' section where you can score the movie (1-10) and share your thoughts. Some reviews may require admin approval before being public.",
    category: "Community"
  },
  {
    question: "What happens if I rent a movie?",
    answer: "Rented movies are available in your library for 30 days. Once you start watching, you have 48 hours to finish before the rental expires.",
    category: "Billing"
  },
  {
    question: "How can I cancel my subscription?",
    answer: "You can cancel your subscription at any time from your User Dashboard under the 'Subscription' tab. You will continue to have access until the end of your billing period.",
    category: "Subscription"
  },
  {
    question: "Are there any parential controls?",
    answer: "Yes, we provide content tags like 'Family Friendly' and spoiler warnings for reviews. We are working on a dedicated 'Kids Mode' coming in Q4 2024.",
    category: "Features"
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black tracking-widest uppercase mb-6">
            <HelpCircle className="w-4 h-4" /> Questions & Answers
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-6">
            Common <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Queries</span>
          </h1>
          <p className="text-gray-500 text-sm md:text-base font-medium max-w-xl mx-auto">
            Find answers to the most frequently asked questions about CineVerse streaming, subscriptions, and community features.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`bg-gray-900/30 border transition-all duration-300 rounded-[2rem] overflow-hidden ${
                openIndex === idx ? "border-purple-500/50 bg-gray-900/50 shadow-lg shadow-purple-500/5" : "border-gray-800 hover:border-gray-700"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full text-left p-6 sm:p-8 flex items-center justify-between group"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                    openIndex === idx ? "bg-purple-500 border-purple-400 text-white" : "bg-gray-800 border-gray-700 text-gray-500"
                  } transition-all w-max`}>
                    {faq.category}
                  </span>
                  <h3 className={`font-bold text-lg md:text-xl transition-colors ${openIndex === idx ? "text-white" : "text-gray-400 group-hover:text-gray-200"}`}>
                    {faq.question}
                  </h3>
                </div>
                <div className={`p-2 rounded-xl transition-all ${openIndex === idx ? "bg-purple-600 text-white rotate-180" : "bg-gray-800 text-gray-500"}`}>
                  {openIndex === idx ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
              </button>
              
              <div
                className={`transition-all duration-500 ease-in-out ${
                  openIndex === idx ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-8 pb-8 pt-0">
                  <div className="h-px w-full bg-gray-800 mb-6" />
                  <p className="text-gray-400 text-base md:text-lg leading-relaxed font-medium">
                    {faq.answer}
                  </p>
                  <div className="mt-8 flex gap-4">
                    <button className="text-[10px] font-black uppercase tracking-widest text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                      Was this helpful? <ChevronRight size={12} className="mt-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Support Section */}
        <div className="mt-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/10 opacity-50 rounded-[3rem]" />
          <div className="relative bg-[#050505] border border-white/5 rounded-[3rem] p-12 md:p-20 text-center shadow-2xl overflow-hidden group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full -translate-y-1/2" />
            
            <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-6 text-white">
              Still have <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">questions?</span>
            </h3>
            <p className="text-gray-400 text-base md:text-lg font-medium max-w-xl mx-auto mb-12 leading-relaxed">
              If you couldn't find the answer you're looking for, please contact our community support team. We're here 24/7.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => window.location.href = '/contact'}
                className="px-12 py-5 bg-white text-black rounded-2xl font-black uppercase italic tracking-wider hover:bg-purple-600 hover:text-white hover:scale-105 transition-all duration-300 shadow-xl shadow-white/5"
              >
                Contact Support Team
              </button>
              <button 
                onClick={() => window.location.href = '/about'}
                className="px-12 py-5 bg-white/5 text-silver border border-white/10 rounded-2xl font-black uppercase italic tracking-wider hover:bg-white/10 transition-all duration-300"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
