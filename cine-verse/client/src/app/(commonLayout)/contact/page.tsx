"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black tracking-widest uppercase mb-6">
            <MessageSquare className="w-4 h-4" /> Get In Touch
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-6">
            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Support</span>
          </h1>
          <p className="text-gray-500 max-w-2xl text-sm md:text-base font-medium leading-relaxed">
            Have a question about your subscription or a movie? Our team is available 24/7 to help you navigate the CineVerse.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: Mail, label: "Email Us", value: "support@cineverse.com", color: "blue" },
                { icon: Phone, label: "Call Us", value: "+880 1234 567890", color: "purple" },
                { icon: MapPin, label: "Visit Us", value: "Dhaka, Bangladesh", color: "pink" },
                { icon: MessageSquare, label: "Live Chat", value: "Available 24/7", color: "orange" },
              ].map((item, idx) => (
                <div key={idx} className="bg-gray-900/40 border border-gray-800 p-8 rounded-[2rem] hover:border-blue-500/30 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-2xl bg-${item.color}-500/10 flex items-center justify-center mb-6`}>
                    <item.icon className={`w-6 h-6 text-${item.color}-500`} />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">{item.label}</h3>
                  <p className="text-white font-bold text-sm tracking-tight">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-[2.5rem] p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <MessageSquare size={120} />
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Enterprise Inquiries</h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8">
                  Looking to partner with CineVerse or have a business proposal? Reach out to our team.
                </p>
                <button className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase italic tracking-wider hover:bg-blue-500 hover:text-white transition-all shadow-xl">
                  Partner with Us
                </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-900/40 border border-gray-800 rounded-[2.5rem] p-10 md:p-12 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
             <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-8">Send a Message</h3>
             
             <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                    <input type="text" placeholder="John Doe" className="w-full bg-black border border-gray-800 text-white p-4 rounded-xl focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="w-full bg-black border border-gray-800 text-white p-4 rounded-xl focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Subject</label>
                  <select className="w-full bg-black border border-gray-800 text-white p-4 rounded-xl focus:outline-none focus:border-blue-500 transition-colors appearance-none">
                    <option>Subscription Help</option>
                    <option>Technical Issue</option>
                    <option>Billing Question</option>
                    <option>General Feedback</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Your Message</label>
                  <textarea rows={5} placeholder="Tell us how we can help..." className="w-full bg-black border border-gray-800 text-white p-4 rounded-xl focus:outline-none focus:border-blue-500 transition-colors resize-none" />
                </div>

                <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 group">
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Transmit Message
                </button>
             </form>
          </div>
        </div>
      </div>
    </main>
  );
}
