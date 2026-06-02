"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What is CineVerse?",
    answer: "CineVerse is a premium movie streaming and review platform where you can discover new releases, watch trailers, read reviews, and interact with a community of movie lovers."
  },
  {
    question: "How do I subscribe to a plan?",
    answer: "You can subscribe by clicking the 'Pricing' link in the navbar or the 'Subscription' section on the homepage. We offer Monthly and Yearly plans with premium benefits."
  },
  {
    question: "Can I watch movies for free?",
    answer: "Some movies are available for free to all registered users, but premium content requires an active subscription or a one-time purchase."
  },
  {
    question: "How does AI Review Moderation work?",
    answer: "Our advanced AI automatically analyzes every review for offensive language, spam, or spoilers. If a review is flagged, it is sent to our moderators for final approval to ensure a safe community."
  },
  {
    question: "How do AI Recommendations work?",
    answer: "Our AI analyzes your viewing history and preferences to suggest movies you'll love. The more you watch and rate, the better your recommendations become!"
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/20 blur-[120px] rounded-full z-0 opacity-30" />
      
      <div className="relative z-10">
        <div className="flex flex-col items-center text-center mb-16 px-6">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            <HelpCircle className="w-3 h-3" />
            Common Questions
          </div>
          <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white mb-4">
            Got <span className="text-primary">Questions?</span>
          </h2>
          <p className="text-gray-500 max-w-lg text-sm font-medium">
            Everything you need to know about CineVerse and our premium features.
          </p>
        </div>

        <div className="max-w-3xl mx-auto px-6 space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className={`group border rounded-3xl overflow-hidden transition-all duration-300 ${
                openIndex === i 
                  ? "bg-gray-900/60 border-primary/30 shadow-2xl shadow-primary/5" 
                  : "bg-gray-900/20 border-gray-800/50 hover:border-gray-700"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-8 py-6 flex items-center justify-between text-left"
              >
                <span className={`text-sm md:text-base font-black uppercase italic tracking-wider transition-colors ${
                  openIndex === i ? "text-primary" : "text-white"
                }`}>
                  {faq.question}
                </span>
                <div className={`p-2 rounded-xl transition-all ${
                  openIndex === i ? "bg-primary text-black rotate-180" : "bg-gray-800 text-gray-500"
                }`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-8 pb-8 text-gray-400 text-sm leading-relaxed font-medium">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
