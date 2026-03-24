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
              className="group bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6 hover:border-gray-700/50 transition-all flex items-center gap-6"
            >
              <div className="relative w-16 h-24 overflow-hidden rounded-xl shrink-0">
                <img
                  src={purchase.movie?.thumbnail}
                  alt={purchase.movie?.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold truncate">
                    {purchase.movie?.title}
                  </h3>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                    purchase.purchaseType === "BUY"
                      ? "bg-green-600/10 text-green-400 border-green-500/20"
                      : "bg-blue-600/10 text-blue-400 border-blue-500/20"
                  }`}>
                    {purchase.purchaseType}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {new Date(purchase.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white">৳{purchase.amount}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <Link
                  href={purchase.movie?.streamingLink || `/movies/${purchase.movie?.id}`}
                  target={purchase.movie?.streamingLink ? "_blank" : "_self"}
                  className="px-6 py-3 bg-white text-black rounded-xl flex items-center gap-2 font-black uppercase italic text-xs hover:bg-blue-500 hover:text-white transition-all shadow-lg"
                >
                  <PlayCircle className="w-4 h-4" /> Watch Now
                </Link>
                <Link
                  href={`/movies/${purchase.movie?.id}`}
                  className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-700 transition-all text-gray-400"
                  title="View Details"
                >
                  <ExternalLink className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
