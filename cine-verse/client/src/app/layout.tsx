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
import { ThemeProvider } from "@/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <body suppressHydrationWarning className="bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Toaster position="top-center" reverseOrder={false} />
          {children}
          <Chatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
