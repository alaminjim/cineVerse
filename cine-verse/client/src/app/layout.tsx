import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "CineVerse - Unlimited Entertainment",
  description: "Stream, discover, and review movies and series.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ backgroundColor: "#000", color: "#fff" }}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
