"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/lib/axiosInstance";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; content: string }[]>([
    { role: "bot", content: "Hey! I'm CineBuddy, your AI film expert. Looking for a movie to watch or need help with the site? Ask me anything!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      // Calling the backend AI recommendation/chat endpoint
      const response = await axiosInstance.post("/ai/recommendations", {
        prompt: userMessage,
      });

      const botReply = response.data?.data?.recommendation || "I'm sorry, I process things in frames and just hit a blank one. Could you ask that again?";
      
      setMessages((prev) => [...prev, { role: "bot", content: botReply }]);
    } catch (error) {
       setMessages((prev) => [...prev, { role: "bot", content: "Oops! My cinematic database is temporarily offline. Please try again in a bit." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                   <Bot className="text-white w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-white font-black uppercase italic tracking-wider text-sm">CineBuddy</h3>
                   <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Always Online</span>
                   </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-800">
              {messages.map((ms, i) => (
                <motion.div
                  initial={{ opacity: 0, x: ms.role === "user" ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={`flex ${ms.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm font-medium ${
                    ms.role === "user" 
                      ? "bg-purple-600 text-white rounded-tr-none" 
                      : "bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700/50"
                  }`}>
                    {ms.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                   <div className="bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-gray-700/50 flex gap-1">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" />
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-black/40 border-t border-gray-800 flex gap-2">
              <input
                type="text"
                placeholder="Ask about movies..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-600 transition-all font-medium"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-purple-600 text-white p-2.5 rounded-xl hover:bg-purple-500 transition-all disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-purple-600/40 relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <AnimatePresence mode="wait">
          {isOpen ? (
             <motion.div initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} key="close">
                <X className="w-8 h-8 relative z-10" />
             </motion.div>
          ) : (
            <motion.div initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} key="open" className="relative">
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
                <MessageCircle className="w-8 h-8 relative z-10" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
