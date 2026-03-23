"use client";

import { useRouter } from "next/navigation";
import { XCircle, ArrowLeft } from "lucide-react";

export default function SubscriptionCancelPage() {
  const router = useRouter();

  return (
    <main className="h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md px-6">
        <XCircle className="w-20 h-20 text-red-500 mx-auto" />
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">
          Subscription Cancelled
        </h1>
        <p className="text-gray-400">
          No worries! You haven&apos;t been charged. You can subscribe anytime.
        </p>
        <div className="flex flex-col gap-3 items-center pt-4">
          <button
            onClick={() => router.push("/subscription")}
            className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-purple-700 transition-all"
          >
            View Plans Again
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-500 font-bold uppercase text-xs tracking-widest hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
        </div>
      </div>
    </main>
  );
}
