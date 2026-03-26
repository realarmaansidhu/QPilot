import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QPilot — Your Quantitative Edge in the Market",
  description: "AI-powered quantitative stock analysis for retail investors. S&P 500 screener, deep-dive reports, and investment insights powered by institutional-grade data.",
  openGraph: {
    title: "QPilot — Your Quantitative Edge in the Market",
    description: "AI-powered quantitative stock analysis for retail investors.",
    url: "https://tryqpilot.com",
    siteName: "QPilot",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0A1628] text-white font-[family-name:var(--font-inter)]">
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
