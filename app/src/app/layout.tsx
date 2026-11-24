import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HouseFlow",
  description: "Mobile-first household chore, dish, supply, and maintenance tracker for off-campus roommates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
