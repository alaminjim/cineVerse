import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CineVerse - Unlimited Entertainment",
  description: "Stream, discover, and review movies and series.",
  icons: {
    icon: "/logo.png",
  },
};

import { Toaster } from "react-hot-toast";
import Chatbot from "@/components/shared/Chatbot";
import ClientOnly from "@/components/shared/ClientOnly";
import HydrationFix from "@/components/shared/HydrationFix";
import BrowserExtensionFix from "@/components/shared/BrowserExtensionFix";
import AuthInitializer from "@/components/shared/AuthInitializer";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Remove browser extension attributes before React hydration
                const removeBisAttributes = function() {
                  document.querySelectorAll('[bis_skin_checked]').forEach(function(el) {
                    el.removeAttribute('bis_skin_checked');
                  });
                };
                // Run immediately
                removeBisAttributes();
                // Also run after a short delay to catch any late additions
                setTimeout(removeBisAttributes, 0);
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="bg-black text-white">
        <Toaster position="top-center" reverseOrder={false} />
        <HydrationFix />
        <BrowserExtensionFix />
        <AuthInitializer />
        {children}
        <ClientOnly>
          <Chatbot />
        </ClientOnly>
      </body>
    </html>
  );
}
