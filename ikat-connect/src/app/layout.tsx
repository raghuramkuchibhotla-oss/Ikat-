import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SessionProvider } from "@/providers/session-provider";
import { CartSyncProvider } from "@/components/CartSyncProvider";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: {
    default: "IKAT CONNECT | Direct Weaver-to-Customer Marketplace",
    template: "%s | IKAT CONNECT",
  },
  description:
    "Buy authentic Pochampally Ikat sarees, dupattas, and dress materials directly from verified weavers. Empowering artisans, eliminating middlemen.",
  keywords: ["Pochampally Ikat", "handloom sarees", "authentic ikat", "weaver marketplace", "Indian textiles", "Telangana handloom"],
  openGraph: {
    siteName: "IKAT CONNECT",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "IKAT CONNECT — Authentic Pochampally Ikat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IKAT CONNECT | Authentic Pochampally Ikat",
    description: "Buy authentic handloom Ikat directly from verified weavers. No middlemen.",
    images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&h=630&fit=crop"],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  let cartCount = 0;
  if (session) {
    try {
      const agg = await db.cartItem.aggregate({ where: { userId: session.id }, _sum: { quantity: true } });
      cartCount = agg._sum.quantity ?? 0;
    } catch {
      cartCount = 0;
    }
  }

  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-[#0c0a09] text-stone-50 min-h-screen flex flex-col`}>
        <SessionProvider user={session} cartCount={cartCount}>
          <CartSyncProvider />
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
