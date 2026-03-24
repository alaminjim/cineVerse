/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Star,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function PendingReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await adminService.getPendingReviews(page);
      setReviews(res?.data || []);
      setMeta(res?.meta || null);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const handleApprove = async (id: string) => {
    try {
      setActionLoading(id);
      await adminService.approveReview(id);
      toast.success("Review approved!");
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to approve");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setActionLoading(id);
      await adminService.rejectReview(id);
      toast.success("Review rejected!");
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to reject");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="text-white">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
          Pending Reviews
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Approve or reject user reviews
        </p>
      </div>

      {loading ? (
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20">
          <CheckCircle2 className="w-16 h-16 text-green-500/30 mx-auto mb-4" />
          <p className="text-gray-500 text-lg italic">
            No pending reviews! All caught up.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6 hover:border-gray-700/50 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Movie Info */}
                  <div className="flex items-center gap-4 lg:w-1/4">
                    {review.movie?.thumbnail && (
                      <img
                        src={review.movie.thumbnail}
                        alt={review.movie.title}
                        className="w-14 h-20 object-cover rounded-lg shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm truncate">
                        {review.movie?.title}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        by {review.user?.name}
                      </p>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-white text-sm truncate">{review.title}</h4>
                      <div className="flex items-center gap-1 shrink-0">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-yellow-500 text-xs font-bold">{review.rating}/10</span>
                      </div>
                      {review.hasSpoiler && (
                        <span className="flex items-center gap-1 text-yellow-500 text-[10px] font-bold uppercase shrink-0">
                          <AlertTriangle className="w-3 h-3" /> Spoiler
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-2">{review.content}</p>
                    <p className="text-gray-600 text-xs mt-2">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => handleApprove(review.id)}
                      disabled={actionLoading === review.id}
                      className="px-5 py-2.5 bg-green-600/15 border border-green-500/30 text-green-400 rounded-xl text-sm font-bold hover:bg-green-600/25 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading === review.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(review.id)}
                      disabled={actionLoading === review.id}
                      className="px-5 py-2.5 bg-red-600/15 border border-red-500/30 text-red-400 rounded-xl text-sm font-bold hover:bg-red-600/25 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading === review.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 disabled:opacity-30 hover:bg-gray-800 transition-all text-sm font-bold"
              >
                Previous
              </button>
              <span className="text-gray-500 text-sm">
                Page {meta.page} of {meta.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
                className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 disabled:opacity-30 hover:bg-gray-800 transition-all text-sm font-bold"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
