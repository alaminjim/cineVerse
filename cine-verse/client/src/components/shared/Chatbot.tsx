"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Sparkles,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/lib/axiosInstance";

interface Message {
  role: "user" | "bot";
  content: string;
}

const quickPrompts = [
  "🎬 Recommend a thriller",
  "🍿 Best rated movies?",
  "🎥 How do reviews work?",
  "💎 Tell me about Premium",
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content:
        "Hey there! 🎬 I'm CineBuddy, your AI film expert.\n\nAsk me for movie recommendations, help navigating CineVerse, or let's just talk cinema! What are you in the mood for?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    const userMessage = messageText.trim();
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/ai/chat", {
        message: userMessage,
        history: newMessages.slice(-8).map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        })),
      });

      const botReply =
        response.data?.data?.reply ||
        "Hmm, I'm having a brain freeze 🧊 Could you try asking that again?";

      setMessages((prev) => [...prev, { role: "bot", content: botReply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "Oops! My projector just flickered 🎥 Please try again in a moment!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(input);
  };

  const handleQuickPrompt = async (prompt: string) => {
    // Remove emoji prefix
    const cleanPrompt = prompt.replace(/^[^\w]*/, "").trim();
    await sendMessage(cleanPrompt);
  };

  const clearChat = () => {
    setMessages([
      {
        role: "bot",
        content:
          "Fresh start! 🎬 What movie magic can I help you with?",
      },
    ]);
  };

  const formatMessage = (content: string) => {
    return content.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i < content.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-4 w-[360px] md:w-[420px] h-[550px] rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            style={{
              background:
                "linear-gradient(180deg, rgba(15,15,25,0.98) 0%, rgba(10,10,20,0.99) 100%)",
              border: "1px solid rgba(139, 92, 246, 0.15)",
              boxShadow:
                "0 25px 50px rgba(0,0,0,0.5), 0 0 40px rgba(139, 92, 246, 0.1)",
            }}
          >
            {/* Header */}
            <div
              className="p-4 flex items-center justify-between"
              style={{
                background:
                  "linear-gradient(135deg, rgba(139,92,246,0.9) 0%, rgba(219,39,119,0.85) 50%, rgba(249,115,22,0.8) 100%)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Bot className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-black uppercase italic tracking-wider text-sm">
                    CineBuddy
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] text-white/80 font-semibold uppercase tracking-widest">
                      AI Film Expert
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                  title="Clear chat"
                >
                  <Trash2 className="w-4 h-4 text-white/70" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/80" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-800">
              {messages.map((ms, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  key={i}
                  className={`flex ${ms.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {ms.role === "bot" && (
                    <div className="w-7 h-7 rounded-lg bg-purple-600/20 flex items-center justify-center mr-2 mt-1 shrink-0">
                      <Bot className="w-4 h-4 text-purple-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-[13px] leading-relaxed font-medium ${
                      ms.role === "user"
                        ? "rounded-tr-sm text-white"
                        : "rounded-tl-sm text-gray-200 border border-gray-800/60"
                    }`}
                    style={
                      ms.role === "user"
                        ? {
                            background:
                              "linear-gradient(135deg, rgba(139,92,246,0.9), rgba(168,85,247,0.85))",
                          }
                        : {
                            background: "rgba(30,30,50,0.8)",
                          }
                    }
                  >
                    {formatMessage(ms.content)}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex items-start">
                  <div className="w-7 h-7 rounded-lg bg-purple-600/20 flex items-center justify-center mr-2 mt-1 shrink-0">
                    <Bot className="w-4 h-4 text-purple-400 animate-pulse" />
                  </div>
                  <div
                    className="p-4 rounded-2xl rounded-tl-sm border border-gray-800/60 flex gap-1.5"
                    style={{ background: "rgba(30,30,50,0.8)" }}
                  >
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length <= 2 && !loading && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="text-[11px] font-semibold px-3 py-1.5 rounded-full border border-purple-500/20 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/40 transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 flex gap-2"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(0,0,0,0.3)",
              }}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask CineBuddy anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all font-medium"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl transition-all disabled:opacity-30 group"
                style={{
                  background: input.trim()
                    ? "linear-gradient(135deg, rgba(139,92,246,0.9), rgba(219,39,119,0.85))"
                    : "rgba(255,255,255,0.05)",
                }}
              >
                <Send className="w-5 h-5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white relative group overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(139,92,246,0.95), rgba(219,39,119,0.9))",
          boxShadow:
            "0 8px 32px rgba(139, 92, 246, 0.4), 0 0 20px rgba(219, 39, 119, 0.2)",
        }}
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              key="close"
            >
              <X className="w-8 h-8 relative z-10" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              key="open"
              className="relative"
            >
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
              <MessageCircle className="w-8 h-8 relative z-10" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
