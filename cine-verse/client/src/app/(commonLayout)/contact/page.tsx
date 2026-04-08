"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldCheck, Globe } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setFormState({ name: "", email: "", message: "" });
    }, 1500);
  };

  const contactOptions = [
    {
      title: "Direct Support",
      detail: "24/7 Priority help for Premium members",
      icon: ShieldCheck,
      color: "text-purple-400",
    },
    {
      title: "Live Chat",
      detail: "Talk to CineBuddy or a human agent",
      icon: MessageSquare,
      color: "text-blue-400",
    },
    {
      title: "Global Press",
      detail: "For media and partnership inquiries",
      icon: Globe,
      color: "text-emerald-400",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 selection:bg-purple-500/30">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6">
              Connect With <br /> <span className="text-purple-500">The Universe</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Have a question about your subscription? Found a glitch in the matrix? Or just want to talk about your favorite director? We're here for it all.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <form
              onSubmit={handleSubmit}
              className="p-8 md:p-12 rounded-[40px] bg-zinc-900/50 border border-white/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10 space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-4">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all font-medium"
                      placeholder="Christopher Nolan"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-4">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all font-medium"
                      placeholder="nolan@interstellar.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-4">How can we help?</label>
                  <textarea
                    required
                    rows={5}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all font-medium resize-none"
                    placeholder="Tell us everything..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isSent}
                  className={`w-full py-5 rounded-2xl flex items-center justify-center gap-2 font-black uppercase italic tracking-widest text-sm transition-all shadow-xl ${
                    isSent 
                    ? "bg-emerald-600 text-white" 
                    : "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/20 active:scale-[0.98]"
                  } disabled:opacity-50`}
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : isSent ? (
                    "Message Transmitted"
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Details Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-5 space-y-12"
          >
            {/* Info Cards */}
            <div className="space-y-6">
              {contactOptions.map((option, i) => (
                <div key={i} className="flex gap-5 group">
                  <div className={`w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0 group-hover:border-${option.color.split("-")[1]}-500/30 transition-colors`}>
                    <option.icon className={`w-6 h-6 ${option.color}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{option.title}</h4>
                    <p className="text-gray-500 text-sm">{option.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Contact Info */}
            <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 space-y-6">
              <div className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium">support@cineverse.com</span>
              </div>
              <div className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors">
                <Phone className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium">+1 (888) CINE-BUDDY</span>
              </div>
              <div className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors">
                <MapPin className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium">Studio Row, Hollywood, CA</span>
              </div>
            </div>

            {/* CTA */}
            <div className="p-8 rounded-[32px] bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/10 relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-bold mb-2">Need immediate help?</h4>
                <p className="text-gray-500 text-sm mb-6">Our CineBuddy AI is ready to assist you right now.</p>
                <button className="text-xs font-black uppercase italic tracking-widest text-purple-400 hover:text-purple-300 transition-colors">
                  Launch Chat Assistant &rarr;
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
