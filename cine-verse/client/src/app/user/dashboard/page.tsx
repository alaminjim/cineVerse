/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import Link from "next/link";
import {
  Loader2,
  Star,
  ShoppingBag,
  Bookmark,
  Crown,
  DollarSign,
  Clock,
  Film,
} from "lucide-react";

export default function UserDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await userService.getUserDashboard();
        setData(res?.data || null);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );

  const stats = data?.stats;

  const statCards = [
    { label: "Total Reviews", value: stats?.totalReviews || 0, icon: Star, color: "from-yellow-600 to-orange-600" },
    { label: "Purchased Movies", value: stats?.totalPurchases || 0, icon: ShoppingBag, color: "from-blue-600 to-cyan-600" },
    { label: "Active Rentals", value: stats?.activeRentals || 0, icon: Clock, color: "from-orange-600 to-red-600" },
    { label: "Bought Movies", value: stats?.totalBought || 0, icon: Film, color: "from-green-600 to-emerald-600" },
    { label: "Watchlist", value: stats?.watchlistCount || 0, icon: Bookmark, color: "from-purple-600 to-pink-600" },
    { label: "Total Spent", value: `৳${stats?.totalSpent || 0}`, icon: DollarSign, color: "from-emerald-600 to-teal-600" },
  ];

  return (
    <div className="text-white">
      {/* User Welcome */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">
            Welcome, {data?.user?.name || "User"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{data?.user?.email}</p>
        </div>

        {data?.subscription ? (
          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600/15 to-pink-600/15 border border-purple-500/20 px-5 py-3 rounded-xl">
            <Crown className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 text-sm font-bold uppercase tracking-wider">
              {data.subscription.planType} Plan
            </span>
          </div>
        ) : (
          <Link
            href="/subscription"
            className="flex items-center gap-2 bg-purple-600/15 border border-purple-500/20 px-5 py-3 rounded-xl hover:bg-purple-600/25 transition-all"
          >
            <Crown className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 text-sm font-bold uppercase tracking-wider">
              Subscribe
            </span>
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6 hover:border-gray-700/50 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                  {card.label}
                </span>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-3xl font-black text-white">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Reviews & Purchases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Recent Reviews */}
        <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" /> Recent Reviews
          </h3>
          {data?.recentReviews?.length > 0 ? (
            <div className="space-y-4">
              {data.recentReviews.map((review: any) => (
                <div key={review.id} className="flex items-center gap-4">
                  {review.movie?.thumbnail && (
                    <img src={review.movie.thumbnail} alt={review.movie?.title} className="w-10 h-14 object-cover rounded-lg shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm truncate">{review.movie?.title}</p>
                    <p className="text-gray-500 text-xs truncate">{review.title}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-yellow-500 text-xs font-bold">{review.rating}</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg ${
                    review.status === "APPROVED"
                      ? "bg-green-600/15 text-green-400"
                      : review.status === "REJECTED"
                      ? "bg-red-600/15 text-red-400"
                      : "bg-yellow-600/15 text-yellow-400"
                  }`}>
                    {review.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm italic">No reviews yet.</p>
          )}
        </div>

        {/* Recent Purchases */}
        <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-blue-500" /> Recent Purchases
          </h3>
          {data?.recentPurchases?.length > 0 ? (
            <div className="space-y-4">
              {data.recentPurchases.map((purchase: any) => (
                <div key={purchase.id} className="flex items-center gap-4">
                  {purchase.movie?.thumbnail && (
                    <img src={purchase.movie.thumbnail} alt={purchase.movie?.title} className="w-10 h-14 object-cover rounded-lg shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm truncate">{purchase.movie?.title}</p>
                    <p className="text-gray-500 text-xs">
                      {purchase.purchaseType === "BUY" ? "Purchased" : "Rented"}
                    </p>
                  </div>
                  <span className="text-white font-bold text-sm">৳{purchase.amount}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm italic">No purchases yet.</p>
          )}
        </div>
      </div>

      {/* Watchlist Preview */}
      <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-purple-500" /> Watchlist
          </h3>
          <Link href="/user/watchlist" className="text-purple-400 text-xs font-bold uppercase hover:text-purple-300 transition-all">
            View All →
          </Link>
        </div>
        {data?.watchlistItems?.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {data.watchlistItems.map((item: any) => (
              <Link
                key={item.movie?.id}
                href={`/movies/${item.movie?.id}`}
                className="shrink-0 w-32 group"
              >
                <img
                  src={item.movie?.thumbnail}
                  alt={item.movie?.title}
                  className="w-32 h-48 object-cover rounded-xl group-hover:ring-2 ring-purple-500 transition-all"
                />
                <p className="text-white text-xs font-bold mt-2 truncate group-hover:text-purple-400 transition-colors">
                  {item.movie?.title}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm italic">Your watchlist is empty.</p>
        )}
      </div>
    </div>
  );
}
