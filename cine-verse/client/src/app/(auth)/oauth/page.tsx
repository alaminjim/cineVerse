/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/lib/store";
import { Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function OAuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuth = async () => {
      try {
        const mode = searchParams?.get("mode");

        await new Promise((resolve) => setTimeout(resolve, 500));

        const response = await authService.getMe();

        if (response.success) {
          setUser(response.data);
          toast.success(
            `${mode === "register" ? "Account created" : "Logged in"} with Google!`,
          );
          router.push("/");
        } else {
          setError(
            response.message ||
              "Session not found. Please try logging in again.",
          );
        }
      } catch (error: any) {
        console.error("OAuth error:", error);
        setError("Authentication failed. Please check your connection.");
      }
    };

    handleOAuth();
  }, [searchParams, setUser, router]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        <p className="text-gray-300">Authenticating with Google...</p>

        {error && (
          <div className="mt-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3 max-w-md">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 text-sm font-medium">
                Authentication Error
              </p>
              <p className="text-red-400/80 text-xs mt-1">{error}</p>
              <button
                onClick={() => router.back()}
                className="mt-3 text-red-400 hover:text-red-300 text-sm underline"
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
