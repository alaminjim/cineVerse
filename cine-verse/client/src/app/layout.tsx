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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Toaster position="top-center" reverseOrder={false} />
        {children}
      </body>
    </html>
  );
}
