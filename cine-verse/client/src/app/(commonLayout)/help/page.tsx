/* eslint-disable react/no-unescaped-entities */
"use client";

import { motion } from "framer-motion";
import {
  HelpCircle,
  Search,
  Play,
  CreditCard,
  User,
  Shield,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      title: "Getting Started",
      icon: Play,
      items: [
        "Account setup",
        "Device compatibility",
        "Streaming quality",
        "Supported browsers",
      ],
    },
    {
      title: "Billing & Plans",
      icon: CreditCard,
      items: [
        "Managing subscription",
        "Invoices and receipts",
        "Payment methods",
        "Refund policy",
      ],
    },
    {
      title: "Account & Profile",
      icon: User,
      items: [
        "Changing password",
        "Linking social accounts",
        "Profile customization",
        "Parental controls",
      ],
    },
    {
      title: "Privacy & Safety",
      icon: Shield,
      items: [
        "Data protection",
        "Reporting content",
        "Two-factor auth",
        "Cookie settings",
      ],
    },
  ];

  const faqs = [
    {
      q: "How many devices can I stream on simultaneously?",
      a: "Premium members can stream on up to 4 devices at once. Standard members are limited to 2 devices.",
    },
    {
      q: "Can I download movies for offline viewing?",
      a: "Yes! Use the CineVerse mobile app to download titles and watch them anywhere without an internet connection.",
    },
    {
      q: "How does the AI recommendation work?",
      a: "CineBuddy analyzes your watch history, ratings, and even the time of day you watch to suggest the perfect movie for your mood.",
    },
    {
      q: "What should I do if the video keeps buffering?",
      a: "Ensure you have a stable connection of at least 5Mbps for HD or 25Mbps for 4K. Try clearing your browser cache or restarting the app.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 selection:bg-purple-500/30">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-8 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
              How Can We <br /> Assist You?
            </h1>

            <div className="max-w-2xl mx-auto relative group">
              <div className="absolute inset-0 bg-purple-600/20 blur-2xl group-hover:bg-purple-600/30 transition-all opacity-50" />
              <div className="relative flex items-center bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4 shadow-2xl">
                <Search className="w-6 h-6 text-gray-500 mr-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for articles, guides, or FAQs..."
                  className="bg-transparent border-none outline-none text-sm font-medium w-full placeholder:text-gray-600"
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Category Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[32px] bg-zinc-900/50 border border-white/5 hover:border-purple-500/30 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <cat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">{cat.title}</h3>
              <ul className="space-y-3">
                {cat.items.map((item) => (
                  <li
                    key={item}
                    className="text-xs text-gray-500 hover:text-purple-400 transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto mb-24">
          <h2 className="text-3xl font-black italic uppercase tracking-tight text-center mb-12 flex items-center justify-center gap-3">
            <HelpCircle className="w-8 h-8 text-purple-500" /> Top Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group"
              >
                <h4 className="font-bold text-lg mb-4 flex justify-between items-center group-hover:text-purple-400">
                  {faq.q}
                  <span className="text-gray-700 font-normal group-hover:text-purple-500 text-2xl leading-none">
                    +
                  </span>
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center p-12 md:p-20 rounded-[40px] bg-gradient-to-tr from-zinc-900 to-black border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2" />

          <h2 className="text-3xl font-black italic uppercase mb-4 relative z-10">
            Still need help?
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-10 relative z-10">
            Our support crew is always on standby. Whether you need technical
            help or just a movie recommendation, we've got you covered.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <button className="px-10 py-4 rounded-full bg-purple-600 text-white font-black uppercase italic hover:bg-purple-500 transition-all shadow-xl shadow-purple-600/20 flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" /> Chat With CineBuddy
            </button>
            <Link href={"/contact"}>
              <button className="px-10 py-4 rounded-full bg-white/10 text-white font-black uppercase italic hover:bg-white/20 transition-all border border-white/10">
                Email Support
              </button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
