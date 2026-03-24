/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { purchaseService } from "@/services/purchase.service";
import { moviesService } from "@/services/movies.service";
import { reviewService } from "@/services/review.service";
import { commentService } from "@/services/comment.service";
import { likeService } from "@/services/like.service";
import { watchlistService } from "@/services/watchlist.service";
import { useAuthStore } from "@/lib/store";
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
  Heart,
  MessageCircle,
  Send,
  AlertTriangle,
  Trash2,
  Plus,
  Check,
  Ban,
  Tag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";

const REVIEW_TAGS = ["Family Friendly", "Must Watch", "Action Packed", "Emotional", "Great Visuals", "Highly Recommended", "Mind Blowing"];

export default function MovieDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const { user } = useAuthStore();

  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);

  const [access, setAccess] = useState({
    isPurchased: false,
    purchaseType: null as string | null,
    subscriptionPlan: null as string | null,
  });

  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewMeta, setReviewMeta] = useState<any>(null);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    title: "",
    rating: 0,
    content: "",
    hasSpoiler: false,
    tags: [] as string[],
  });

  const [likedReviews, setLikedReviews] = useState<Set<string>>(new Set());

  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [commentLoading, setCommentLoading] = useState<string | null>(null);

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
            isPurchased: accessRes.isPurchased === true || user?.role === "ADMIN",
            purchaseType: accessRes.purchaseType || (user?.role === "ADMIN" ? "ADMIN_ACCESS" : null),
            subscriptionPlan: accessRes.subscriptionPlan || null,
          });
        }

        if (user) {
          const wRes = await watchlistService.checkWatchlist(id).catch(() => null);
          if (wRes?.isWatchlisted) setIsWatchlisted(true);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      try {
        setReviewLoading(true);
        const res = await reviewService.getReviewsByMovieId(id, reviewPage);
        setReviews(res?.data || []);
        setReviewMeta(res?.meta || null);
      } catch (error) {
        console.error("Review fetch error:", error);
      } finally {
        setReviewLoading(false);
      }
    };
    fetchReviews();
  }, [id, reviewPage]);

  // Check likes for current user
  useEffect(() => {
    const checkLikes = async () => {
      if (!user || reviews.length === 0) return;
      const liked = new Set<string>();
      for (const review of reviews) {
        try {
          const res = await likeService.checkLike(review.id);
          if (res) liked.add(review.id);
        } catch {
          // not liked
        }
      }
      setLikedReviews(liked);
    };
    checkLikes();
  }, [reviews, user]);

  const handleToggleWatchlist = async () => {
    if (!user) {
      toast.error("Please login to manage watchlist!");
      return;
    }
    try {
      setWatchlistLoading(true);
      if (isWatchlisted) {
        await watchlistService.removeFromWatchlist(id);
        setIsWatchlisted(false);
        toast.success("Removed from watchlist");
      } else {
        await watchlistService.addToWatchlist(id);
        setIsWatchlisted(true);
        toast.success("Added to watchlist");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Watchlist action failed!");
    } finally {
      setWatchlistLoading(false);
    }
  };

  const handleApproveReview = async (reviewId: string) => {
    try {
      await reviewService.approveReview(reviewId);
      toast.success("Review approved & published!");
      setReviews((prev) => prev.map(r => r.id === reviewId ? { ...r, status: "APPROVED" } : r));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Approval failed!");
    }
  };

  const handleRejectReview = async (reviewId: string) => {
    try {
      await reviewService.rejectReview(reviewId);
      toast.success("Review rejected & unpublished!");
      setReviews((prev) => prev.map(r => r.id === reviewId ? { ...r, status: "REJECTED" } : r));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Rejection failed!");
    }
  };

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

  // Submit Review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to write a review!");
      return;
    }
    if (reviewForm.rating === 0) {
      toast.error("Please select a rating!");
      return;
    }
    try {
      setSubmitLoading(true);
      await reviewService.createReview({
        movieId: id,
        ...reviewForm,
      });
      toast.success("Review submitted! Pending admin approval.");
      setReviewForm({ title: "", rating: 0, content: "", hasSpoiler: false, tags: [] });
      // Refresh reviews and movie data
      const [reviewRes, movieRes] = await Promise.all([
        reviewService.getReviewsByMovieId(id, 1),
        moviesService.getMovieById(id)
      ]);
      
      setReviews(reviewRes?.data || []);
      setReviewMeta(reviewRes?.meta || null);
      if (movieRes.success) setMovie(movieRes.data);
      setReviewPage(1);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to submit review!");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Like / Unlike
  const handleToggleLike = async (reviewId: string) => {
    if (!user) {
      toast.error("Please login to like reviews!");
      return;
    }
    try {
      if (likedReviews.has(reviewId)) {
        await likeService.unlikeReview(reviewId);
        setLikedReviews((prev) => {
          const s = new Set(prev);
          s.delete(reviewId);
          return s;
        });
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId ? { ...r, likesCount: Math.max(0, (r.likesCount || 0) - 1) } : r
          )
        );
      } else {
        await likeService.likeReview(reviewId);
        setLikedReviews((prev) => new Set(prev).add(reviewId));
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId ? { ...r, likesCount: (r.likesCount || 0) + 1 } : r
          )
        );
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Action failed!");
    }
  };

  // Toggle comments
  const toggleComments = async (reviewId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
      // Fetch comments
      try {
        const res = await commentService.getCommentsByReview(reviewId);
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId ? { ...r, comments: res || [] } : r
          )
        );
      } catch (error) {
        console.error("Comment fetch error:", error);
      }
    }
    setExpandedComments(newExpanded);
  };

  // Add comment
  const handleAddComment = async (reviewId: string) => {
    if (!user) {
      toast.error("Please login to comment!");
      return;
    }
    const content = commentInputs[reviewId]?.trim();
    if (!content) return;

    try {
      setCommentLoading(reviewId);
      const newComment = await commentService.createComment({ reviewId, content });
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                comments: [...(r.comments || []), newComment.data],
                commentsCount: (r.commentsCount || 0) + 1,
              }
            : r
        )
      );
      setCommentInputs((prev) => ({ ...prev, [reviewId]: "" }));
      toast.success("Comment added!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add comment!");
    } finally {
      setCommentLoading(null);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-purple-600 w-10 h-10" />
      </div>
    );

  const getAccessLabel = () => {
    if (movie?.pricing === "FREE") return "Free to Watch";
    if (purchaseType === "ADMIN_ACCESS") return "Administrator Access";
    if (subscriptionPlan) return `${subscriptionPlan} Subscriber`;
    if (purchaseType === "BUY") return "Owned Lifetime";
    if (purchaseType === "RENT") return "Rented (7 Days)";
    return "";
  };

  // Rating stars component
  const RatingStars = ({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) => (
    <div className="flex gap-1">
      {Array.from({ length: 10 }).map((_, i) => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(i + 1)}
          className={`${interactive ? "cursor-pointer hover:scale-125" : "cursor-default"} transition-transform`}
        >
          <Star
            className={`w-5 h-5 ${
              i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-700"
            }`}
          />
        </button>
      ))}
    </div>
  );

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

            <div>
              <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Language</h3>
              <p className="font-medium text-lg text-gray-200">{movie?.language && movie.language.length > 0 ? movie.language.join(", ") : "N/A"}</p>
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

          {/* ════════════════════════════════════════════════════════════ */}
          {/* REVIEW SECTION */}
          {/* ════════════════════════════════════════════════════════════ */}
          <div className="pt-10 border-t border-white/5">
            <h2 className="text-2xl font-bold mb-8 italic uppercase flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-purple-500" />
              Reviews
            </h2>

            {/* Write Review Form */}
            {user && (
              <form onSubmit={handleSubmitReview} className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 md:p-8 mb-10 space-y-5">
                <h3 className="text-lg font-bold uppercase tracking-wider text-gray-300">Write a Review</h3>

                <div>
                  <label className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 block">Rating</label>
                  <RatingStars rating={reviewForm.rating} onRate={(r) => setReviewForm({ ...reviewForm, rating: r })} interactive />
                </div>

                <div>
                  <label className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 block">Title</label>
                  <input
                    type="text"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                    placeholder="Give your review a title (min 5 chars)..."
                    className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-600"
                    required
                    minLength={5}
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 block">Your Review</label>
                  <textarea
                    value={reviewForm.content}
                    onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                    placeholder="Share your thoughts about this movie (min 20 chars)..."
                    rows={4}
                    className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-600 resize-none"
                    required
                    minLength={20}
                  />
                </div>

                <div>
                  <label className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3 block">Tags (Help others find relevant content)</label>
                  <div className="flex flex-wrap gap-2">
                    {REVIEW_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setReviewForm(prev => ({
                            ...prev,
                            tags: prev.tags.includes(tag) 
                              ? prev.tags.filter(t => t !== tag) 
                              : [...prev.tags, tag]
                          }));
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                          reviewForm.tags.includes(tag)
                            ? "bg-purple-600 border-purple-500 text-white"
                            : "bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-600"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={reviewForm.hasSpoiler}
                      onChange={(e) => setReviewForm({ ...reviewForm, hasSpoiler: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-600 accent-purple-600"
                    />
                    <span className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      Contains Spoilers
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {submitLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    Submit Review
                  </button>
                </div>
              </form>
            )}

            {!user && (
              <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 mb-10 text-center">
                <p className="text-gray-400 mb-3">Login to write a review</p>
                <Link href="/login" className="text-purple-400 font-bold hover:text-purple-300 underline underline-offset-4">
                  Sign In
                </Link>
              </div>
            )}

            {/* Reviews List */}
            {reviewLoading ? (
              <div className="py-10 flex justify-center">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review: any) => (
                  <div key={review.id} className="bg-gray-900/30 border border-gray-800/50 rounded-2xl p-6 transition-all hover:border-gray-700/50">
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-black text-sm">
                          {review.user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{review.user?.name || "User"}</p>
                          <p className="text-gray-500 text-xs">
                            {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-800"}`} />
                        ))}
                      </div>
                    </div>

                    {/* Review Title */}
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <h4 className="font-bold text-lg text-white">{review.title}</h4>
                      {user?.role === "ADMIN" && (
                        <div className="flex items-center gap-2">
                          {review.status !== "APPROVED" ? (
                            <button
                              onClick={() => handleApproveReview(review.id)}
                              className="p-1.5 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all"
                              title="Approve & Publish"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRejectReview(review.id)}
                              className="p-1.5 bg-orange-500/10 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition-all"
                              title="Unpublish"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${review.status === 'APPROVED' ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'}`}>
                            {review.status}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Spoiler Warning */}
                    {review.hasSpoiler && (
                      <div className="flex items-center gap-2 text-yellow-500 text-xs font-bold uppercase tracking-wider mb-2">
                        <AlertTriangle className="w-4 h-4" /> Spoiler Warning
                      </div>
                    )}

                    {/* Tags Display */}
                    {review.tags && review.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {review.tags.map((tag: string) => (
                          <span key={tag} className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] text-gray-400 font-medium">
                            <Tag className="w-3 h-3 text-purple-500" /> {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Review Content */}
                    <p className={`text-gray-400 leading-relaxed text-sm ${review.hasSpoiler ? "blur-sm hover:blur-none transition-all cursor-pointer" : ""}`}>
                      {review.content}
                    </p>

                    <div className="flex items-center gap-6 mt-5 pt-4 border-t border-gray-800/50">
                      <button
                        onClick={() => handleToggleLike(review.id)}
                        className={`flex items-center gap-2 text-sm transition-all ${
                          likedReviews.has(review.id)
                            ? "text-pink-500"
                            : "text-gray-500 hover:text-pink-500"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${likedReviews.has(review.id) ? "fill-pink-500" : ""}`} />
                        <span className="font-bold">{review.likesCount || 0}</span>
                      </button>

                      <button
                        onClick={() => toggleComments(review.id)}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple-400 transition-all"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="font-bold">{review.commentsCount || 0}</span>
                        {expandedComments.has(review.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {user && review.user?.id === user.id && (
                        <button
                          onClick={async () => {
                            try {
                              await reviewService.deleteReview(review.id);
                              setReviews((prev) => prev.filter((r) => r.id !== review.id));
                              toast.success("Review deleted!");
                            } catch (error: any) {
                              toast.error(error?.response?.data?.message || "Failed to delete!");
                            }
                          }}
                          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-all ml-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Comments Section */}
                    {expandedComments.has(review.id) && (
                      <div className="mt-4 pt-4 border-t border-gray-800/30 space-y-3">
                        {review.comments && review.comments.length > 0 ? (
                          review.comments.map((comment: any) => (
                            <div key={comment.id} className="flex gap-3 items-start">
                              <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 font-bold text-[10px] shrink-0">
                                {comment.user?.name?.[0]?.toUpperCase() || "U"}
                              </div>
                              <div>
                                <p className="text-xs">
                                  <span className="font-bold text-gray-300">{comment.user?.name || "User"}</span>
                                  <span className="text-gray-600 ml-2">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </span>
                                </p>
                                <p className="text-gray-400 text-sm mt-1">{comment.content}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-600 text-sm italic">No comments yet.</p>
                        )}

                        {/* Add Comment Input */}
                        {user && (
                          <div className="flex gap-2 mt-3">
                            <input
                              type="text"
                              value={commentInputs[review.id] || ""}
                              onChange={(e) => setCommentInputs({ ...commentInputs, [review.id]: e.target.value })}
                              onKeyDown={(e) => e.key === "Enter" && handleAddComment(review.id)}
                              placeholder="Write a comment..."
                              className="flex-1 bg-black border border-gray-800 text-white text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-purple-500 placeholder:text-gray-600"
                            />
                            <button
                              onClick={() => handleAddComment(review.id)}
                              disabled={commentLoading === review.id}
                              className="px-4 py-2.5 bg-purple-600/20 border border-purple-500/30 text-purple-400 rounded-xl hover:bg-purple-600/30 transition-all disabled:opacity-50"
                            >
                              {commentLoading === review.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Review Pagination */}
                {reviewMeta && reviewMeta.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 pt-6">
                    <button
                      onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
                      disabled={reviewPage === 1}
                      className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 disabled:opacity-30 hover:bg-gray-800 transition-all text-sm font-bold"
                    >
                      Previous
                    </button>
                    <span className="text-gray-500 text-sm">
                      Page {reviewMeta.page} of {reviewMeta.totalPages}
                    </span>
                    <button
                      onClick={() => setReviewPage((p) => Math.min(reviewMeta.totalPages, p + 1))}
                      disabled={reviewPage === reviewMeta.totalPages}
                      className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 disabled:opacity-30 hover:bg-gray-800 transition-all text-sm font-bold"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                <p className="text-gray-500 text-lg italic">No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>
        </div>

        {/* Access Panel */}
        <div className="lg:col-span-1">
          <div className="bg-[#0A0A0A] border border-white/5 p-8 md:p-10 rounded-[2.5rem] sticky top-28 shadow-2xl">
            {isPurchased || movie?.pricing === "FREE" ? (
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
                  {movie?.pricing === "FREE" ? "Free Movie" : subscriptionPlan ? "Premium Access" : "Movie Unlocked"}
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

                <button
                  onClick={handleToggleWatchlist}
                  disabled={watchlistLoading}
                  className={`w-full mt-4 py-4 rounded-2xl font-black uppercase italic flex items-center justify-center gap-3 transition-all border ${
                    isWatchlisted
                      ? "bg-purple-600/10 border-purple-500/30 text-purple-400 hover:bg-red-600/10 hover:border-red-500/30 hover:text-red-400"
                      : "bg-gray-900 border-gray-800 text-gray-500 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {watchlistLoading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : isWatchlisted ? (
                    <Check size={20} />
                  ) : (
                    <Plus size={20} />
                  )}
                  {isWatchlisted ? "In Watchlist" : "Add to Watchlist"}
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
                      Buy OneTimes
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
