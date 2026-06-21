import type { Metadata } from "next";
import { getProductById } from "@/actions/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Product | IKAT CONNECT",
      description: "Authentic Pochampally Ikat handloom product.",
    };
  }

  const image = product.images?.[0];

  return {
    title: `${product.title} | IKAT CONNECT`,
    description:
      product.description?.slice(0, 155) ??
      "Authentic handwoven Pochampally Ikat product from a verified weaver.",
    openGraph: {
      title: product.title,
      description:
        product.description?.slice(0, 155) ??
        "Authentic handwoven Pochampally Ikat.",
      type: "website",
      ...(image
        ? {
            images: [
              {
                url: image,
                width: 800,
                height: 1000,
                alt: product.title,
              },
            ],
          }
        : {}),
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
