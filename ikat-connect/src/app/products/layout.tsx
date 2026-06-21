import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Handloom Ikat Products | IKAT CONNECT",
  description:
    "Shop authentic Pochampally Ikat sarees, dupattas, and dress materials handwoven by verified artisans. Direct from weaver to you — no middlemen.",
  keywords: [
    "Pochampally Ikat sarees",
    "handloom dupattas",
    "ikat dress material",
    "authentic ikat online",
    "Telangana handloom",
    "buy ikat saree",
  ],
  openGraph: {
    title: "Handloom Ikat Products | IKAT CONNECT",
    description:
      "Browse authentic Pochampally Ikat sarees, dupattas, and dress materials from verified weavers.",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Authentic Pochampally Ikat Products",
      },
    ],
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
