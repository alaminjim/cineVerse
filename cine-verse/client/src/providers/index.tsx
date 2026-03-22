"use client";

import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.14 0.02 270 / 0.9)",
            backdropFilter: "blur(16px)",
            border: "1px solid oklch(1 0 0 / 0.08)",
            color: "oklch(0.95 0.005 270)",
          },
        }}
      />
    </AuthProvider>
  );
}
