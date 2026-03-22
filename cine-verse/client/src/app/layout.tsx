import type { Metadata } from "next";
import "./globals.css";

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
      <body style={{ backgroundColor: "#000", color: "#fff" }}>{children}</body>
    </html>
  );
}
