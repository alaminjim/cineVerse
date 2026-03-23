/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { purchaseService } from "@/services/purchase.service";
import { moviesService } from "@/services/movies.service";
import {
  PlayCircle,
  Lock,
  Loader2,
  CheckCircle2,
  ChevronLeft,
  Clock,
  ShoppingBag,
  Crown,
  Sparkles,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";

export default function MovieDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);

  const [access, setAccess] = useState({
    isPurchased: false,
    purchaseType: null as string | null,
    subscriptionPlan: null as string | null,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [movieRes, accessRes] = await Promise.all([
          moviesService.getMovieById(id),
          purchaseService.checkPurchase(id).catch(() => null),
        ]);

        if (movieRes.success) setMovie(movieRes.data);

        if (accessRes) {
          setAccess({
            isPurchased: accessRes.isPurchased === true,
            purchaseType: accessRes.purchaseType || null,
            subscriptionPlan: accessRes.subscriptionPlan || null,
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const { isPurchased, purchaseType, subscriptionPlan } = access;

  const handlePurchase = async (type: "BUY" | "RENT") => {
    try {
      setPurchaseLoading(type);
      const res = await purchaseService.createCheckout(id, type);
      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      } else {
        toast.error("Checkout session failed!");
      }
    } catch (error: any) {
      console.error("Purchase error:", error);
      toast.error(
        error?.response?.data?.message || "Purchase failed! Try again."
      );
    } finally {
      setPurchaseLoading(null);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-purple-600 w-10 h-10" />
      </div>
    );

  const getAccessLabel = () => {
    if (subscriptionPlan) return `${subscriptionPlan} Subscriber`;
    if (purchaseType === "BUY") return "Owned Lifetime";
    if (purchaseType === "RENT") return "Rented (7 Days)";
    return "";
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Banner */}
      <div className="relative h-[55vh] w-full">
        <button
          onClick={() => router.back()}
          className="absolute top-8 left-8 z-20 p-3 bg-black/50 rounded-full hover:bg-white hover:text-black transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <img
          src={movie?.thumbnail}
          alt={movie?.title}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute bottom-10 left-12">
          <h1 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter mb-2">
            {movie?.title}
          </h1>
          <p className="text-purple-500 font-bold uppercase tracking-widest text-sm">
            {movie?.genre?.join(" • ")} • {movie?.type === "SERIES" ? `${movie?.seasons} SEASONS` : `${movie?.runtime} MINS`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid lg:grid-cols-3 gap-16">
        {/* Storyline & Details */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h2 className="text-2xl font-bold mb-6 italic uppercase">
              Storyline
            </h2>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-light">
              {movie?.synopsis || "No storyline available for this title."}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-6 pt-8 border-t border-white/5">
            <div>
              <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Director</h3>
              <p className="font-medium text-lg text-gray-200">{movie?.director || "N/A"}</p>
            </div>

            <div>
              <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Release Year</h3>
              <p className="font-medium text-lg text-gray-200">{movie?.releaseYear || "N/A"}</p>
            </div>

            <div>
              <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Rating</h3>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-medium text-lg text-gray-200">{movie?.avgRating?.toFixed(1) || "0.0"} <span className="text-xs text-gray-500 font-normal">({movie?.reviewCount || 0} reviews)</span></span>
              </div>
            </div>

            <div className="col-span-2 md:col-span-3">
              <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">Cast</h3>
              <div className="flex flex-wrap gap-2">
                {movie?.cast && movie.cast.length > 0 ? (
                  movie.cast.map((actor: string, i: number) => (
                    <span key={i} className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs font-medium text-gray-300">
                      {actor}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm italic">N/A</span>
                )}
              </div>
            </div>

            {movie?.streamingPlatform && movie.streamingPlatform.length > 0 && (
              <div className="col-span-2 md:col-span-3">
                <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">Available on Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.streamingPlatform.map((platform: string, i: number) => (
                    <span key={i} className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-4 py-2 rounded-[0.5rem] text-[10px] font-bold uppercase tracking-widest">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Access Panel */}
        <div className="lg:col-span-1">
          <div className="bg-[#0A0A0A] border border-white/5 p-8 md:p-10 rounded-[2.5rem] sticky top-28 shadow-2xl">
            {isPurchased ? (
              /* ✅ ACCESS GRANTED — Watch Now */
              <div className="text-center py-4">
                <div className="relative inline-block mb-6">
                  {subscriptionPlan ? (
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-purple-500/20">
                      <Crown className="text-white w-10 h-10" />
                    </div>
                  ) : (
                    <div className="bg-green-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                      <CheckCircle2 className="text-green-500 w-10 h-10" />
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-black italic uppercase mb-2">
                  {subscriptionPlan ? "Premium Access" : "Movie Unlocked"}
                </h3>
                <p className="text-gray-500 text-[10px] uppercase mb-8 tracking-widest">
                  {getAccessLabel()}
                </p>

                <button
                  onClick={() => {
                    if (movie?.streamingLink) {
                      window.open(movie.streamingLink, "_blank");
                    } else {
                      router.push(`/watch/${id}`);
                    }
                  }}
                  className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase italic flex items-center justify-center gap-3 hover:bg-purple-600 hover:text-white transition-all shadow-lg active:scale-[0.98]"
                >
                  <PlayCircle size={24} /> Watch Now
                </button>
              </div>
            ) : (
              /* 🛒 LOCKED — Purchase Options */
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-6 opacity-40">
                  <Lock size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Locked Content
                  </span>
                </div>

                {/* Rent Button */}
                <button
                  disabled={purchaseLoading === "RENT"}
                  onClick={() => handlePurchase("RENT")}
                  className="w-full p-5 md:p-6 border border-white/10 rounded-3xl flex justify-between items-center hover:bg-white hover:text-black transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Clock
                      size={18}
                      className="text-orange-400 group-hover:text-orange-600"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Rent 7 Days
                    </span>
                  </div>
                  <span className="text-xl md:text-2xl font-black italic">
                    {purchaseLoading === "RENT" ? (
                      <Loader2 className="animate-spin w-6 h-6" />
                    ) : (
                      `৳${movie?.rentPrice}`
                    )}
                  </span>
                </button>

                {/* Buy Button */}
                <button
                  disabled={purchaseLoading === "BUY"}
                  onClick={() => handlePurchase("BUY")}
                  className="w-full p-5 md:p-6 border border-white/10 rounded-3xl flex justify-between items-center hover:bg-white hover:text-black transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag
                      size={18}
                      className="text-blue-400 group-hover:text-blue-600"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Buy Lifetime
                    </span>
                  </div>
                  <span className="text-xl md:text-2xl font-black italic">
                    {purchaseLoading === "BUY" ? (
                      <Loader2 className="animate-spin w-6 h-6" />
                    ) : (
                      `৳${movie?.buyPrice}`
                    )}
                  </span>
                </button>

                {/* Subscription CTA */}
                <div className="pt-2">
                  <Link
                    href="/subscription"
                    className="w-full p-5 md:p-6 rounded-3xl flex justify-between items-center bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 hover:border-purple-500/40 transition-all group block"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles
                        size={18}
                        className="text-purple-400 group-hover:text-purple-300"
                      />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 block">
                          Or Subscribe
                        </span>
                        <span className="text-[9px] text-gray-500 block mt-0.5">
                          Unlock ALL movies
                        </span>
                      </div>
                    </div>
                    <Crown size={20} className="text-purple-500" />
                  </Link>
                </div>

                {/* Stripe badge */}
                <p className="text-center text-gray-700 text-[9px] uppercase tracking-widest pt-2">
                  Secure payment powered by Stripe
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
