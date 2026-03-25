/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { purchaseService } from "@/services/purchase.service";
import Link from "next/link";
import {
  Loader2,
  ShoppingBag,
  Clock,
  ExternalLink,
  PlayCircle,
} from "lucide-react";

export default function PurchaseHistoryPage() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await purchaseService.getPurchaseHistory();
        setPurchases(res?.data || []);
      } catch (error) {
        console.error("Purchase history error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="text-white">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
          Purchase History
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Your transactions and rentals
        </p>
      </div>

      {loading ? (
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      ) : purchases.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/20 rounded-2xl border border-gray-800/50">
          <ShoppingBag className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 text-lg italic mb-4">
            You haven't purchased any movies yet.
          </p>
          <Link
            href="/movies"
            className="text-blue-400 font-bold hover:text-blue-300 underline underline-offset-4"
          >
            Explore Movies →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="group bg-gray-900/40 border border-gray-800/50 rounded-3xl p-5 sm:p-6 hover:border-gray-700/50 transition-all"
            >
              <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
                {/* Movie Thumbnail & Mobile Header */}
                <div className="flex items-center gap-4 sm:shrink-0">
                  <div className="relative w-20 h-28 sm:w-16 sm:h-24 overflow-hidden rounded-xl shrink-0 border border-gray-800 shadow-xl">
                    <img
                      src={purchase.movie?.thumbnail}
                      alt={purchase.movie?.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0 sm:hidden">
                    <h3 className="text-lg font-bold text-white truncate mb-1">
                      {purchase.movie?.title}
                    </h3>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border inline-block ${
                      purchase.purchaseType === "BUY"
                        ? "bg-green-600/10 text-green-400 border-green-500/20"
                        : "bg-blue-600/10 text-blue-400 border-blue-500/20"
                    }`}>
                      {purchase.purchaseType}
                    </span>
                  </div>
                </div>

                {/* Desktop Info */}
                <div className="flex-1 min-w-0 hidden sm:block">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white truncate">
                      {purchase.movie?.title}
                    </h3>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${
                      purchase.purchaseType === "BUY"
                        ? "bg-green-600/10 text-green-400 border-green-500/20"
                        : "bg-blue-600/10 text-blue-400 border-blue-500/20"
                    }`}>
                      {purchase.purchaseType}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">
                        {new Date(purchase.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-black text-white bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                      <span className="text-blue-400">৳</span>
                      {purchase.amount}
                    </div>
                  </div>
                </div>

                {/* Mobile Meta Info */}
                <div className="sm:hidden grid grid-cols-2 gap-4 py-4 border-y border-gray-800/50">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-tighter text-gray-500">Purchase Date</p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-300 font-bold">
                        <Clock className="w-3 h-3 text-blue-500" />
                        {new Date(purchase.createdAt).toLocaleDateString()}
                      </div>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-tighter text-gray-500">Amount Paid</p>
                      <div className="text-sm font-black text-white">৳{purchase.amount}</div>
                   </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 sm:shrink-0 w-full sm:w-auto">
                  <Link
                    href={purchase.movie?.streamingLink || `/movies/${purchase.movie?.id}`}
                    target={purchase.movie?.streamingLink ? "_blank" : "_self"}
                    className="flex-1 sm:flex-none px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center gap-2 font-black uppercase italic text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-600/20"
                  >
                    <PlayCircle className="w-5 h-5 shrink-0" /> Watch Now
                  </Link>
                  <Link
                    href={`/movies/${purchase.movie?.id}`}
                    className="w-12 h-12 bg-gray-800 border border-gray-700/50 rounded-2xl flex items-center justify-center hover:bg-gray-700 transition-all text-gray-400 hover:text-white shrink-0"
                    title="View Details"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
