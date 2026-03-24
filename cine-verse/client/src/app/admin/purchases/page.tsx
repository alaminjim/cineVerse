/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { purchaseService } from "@/services/purchase.service";
import {
  Loader2,
  ShoppingBag,
  User,
  Film,
  Calendar,
  DollarSign,
} from "lucide-react";

export default function AdminPurchasesPage() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await purchaseService.getAllPurchases();
        setPurchases(res?.data || []);
      } catch (error) {
        console.error("Fetch purchases error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  return (
    <div className="text-white">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
          Purchase Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Monitor all transactions and rentals across the platform
        </p>
      </div>

      {loading ? (
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="bg-gray-900/40 border border-gray-800/50 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800/50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  <th className="px-6 py-5">User</th>
                  <th className="px-6 py-5">Movie</th>
                  <th className="px-6 py-5">Type</th>
                  <th className="px-6 py-5">Amount</th>
                  <th className="px-6 py-5">Date</th>
                  <th className="px-6 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {purchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate">{purchase.user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{purchase.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {purchase.movie?.thumbnail && (
                          <img
                            src={purchase.movie.thumbnail}
                            alt=""
                            className="w-8 h-12 object-cover rounded-md border border-gray-800"
                          />
                        )}
                        <p className="text-sm font-bold truncate max-w-[150px]">
                          {purchase.movie?.title}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${
                        purchase.purchaseType === "BUY"
                          ? "bg-green-600/10 text-green-400 border-green-500/20"
                          : "bg-blue-600/10 text-blue-400 border-blue-500/20"
                      }`}>
                        {purchase.purchaseType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center font-bold text-sm">
                        <DollarSign className="w-3 h-3 text-emerald-500" />
                        {purchase.amount}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                      {new Date(purchase.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                        purchase.status === "ACTIVE"
                          ? "bg-emerald-600/10 text-emerald-400"
                          : "bg-gray-700/20 text-gray-500"
                      }`}>
                        {purchase.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {purchases.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <ShoppingBag className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                      <p className="text-gray-500 italic">No purchases found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
