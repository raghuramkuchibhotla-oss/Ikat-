import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "IKAT CONNECT | Direct Weaver-to-Customer Marketplace",
  description:
    "Buy authentic Pochampally Ikat sarees, dupattas, and dress materials directly from verified weavers. Empowering artisans, eliminating middlemen.",
  keywords: [
    "Pochampally Ikat",
    "handloom sarees",
    "authentic ikat",
    "weaver marketplace",
    "Indian textiles",
    "Telangana handloom",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-[#0c0a09] text-stone-50 min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
