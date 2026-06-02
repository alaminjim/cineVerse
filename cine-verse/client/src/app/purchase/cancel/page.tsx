/* eslint-disable react/no-unescaped-entities */
"use client";

import { useRouter } from "next/navigation";
import { XCircle, ArrowLeft } from "lucide-react";

export default function CancelPage() {
  const router = useRouter();

  return (
    <main className="h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-6">
        <XCircle className="w-20 h-20 text-red-500 mx-auto" />
        <h1 className="text-4xl font-black uppercase italic">
          Payment Cancelled
        </h1>
        <p className="text-gray-400">No worries! You haven't been charged.</p>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mx-auto text-purple-500 font-bold uppercase text-xs tracking-widest hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    </main>
  );
}
