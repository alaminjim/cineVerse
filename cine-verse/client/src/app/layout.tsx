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
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <body suppressHydrationWarning className="bg-black text-white">
        <Toaster position="top-center" reverseOrder={false} />
        {children}
        <Chatbot />
      </body>
    </html>
  );
}
