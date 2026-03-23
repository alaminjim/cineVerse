/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { purchaseService } from "@/services/purchase.service";
import {
  CheckCircle2,
  Loader2,
  PlayCircle,
  Home,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [movieData, setMovieData] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await purchaseService.confirmPurchase(sessionId);
        if (res.success) {
          setMovieData(res.data);
          toast.success("Payment Successful!");
        } else {
          setError(true);
        }
      } catch (err: any) {
        setError(true);
        console.error("Confirmation Error:", err);
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [sessionId]);

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black">
        <Loader2 className="animate-spin text-purple-500 w-12 h-12 mb-4" />
        <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">
          Verifying Payment...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-white text-center px-6">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Payment Verification Failed</h2>
        <button
          onClick={() => router.push("/")}
          className="mt-4 bg-white text-black px-8 py-2 rounded-full font-bold uppercase text-xs"
        >
          Back Home
        </button>
      </div>
    );

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-900/40 p-10 rounded-[3rem] text-center border border-white/5 shadow-2xl">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl font-black uppercase italic italic tracking-tighter mb-4">
          Payment Done!
        </h1>
        <div className="space-y-4">
          <button
            onClick={() => router.push(`/movies/${movieData?.movieId}`)}
            className="w-full flex items-center justify-center gap-3 bg-purple-600 text-white font-black py-4 rounded-3xl transition-all uppercase italic"
          >
            <PlayCircle className="w-6 h-6" /> Start Watching
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full text-gray-500 font-bold py-2 uppercase text-[10px] tracking-widest"
          >
            Back to Home
          </button>
        </div>
      </div>
    </main>
  );
}
export default function PurchaseSuccessPage() {
  return (
    <Suspense fallback={<div className="bg-black h-screen" />}>
      <SuccessContent />
    </Suspense>
  );
}
