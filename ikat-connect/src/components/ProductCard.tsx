"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, Shield } from "lucide-react";
import { type Product } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="card group overflow-hidden animate-fade-in-up">
      {/* Image */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <span className="badge badge-success text-[10px]">
              <Shield className="w-3 h-3 mr-1" />
              Authentic
            </span>
            {product.originalPrice && (
              <span className="badge badge-warning text-[10px]">
                {Math.round(
                  ((product.originalPrice - product.price) /
                    product.originalPrice) *
                    100
                )}
                % OFF
              </span>
            )}
          </div>

          {/* Product ID */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-mono bg-black/70 text-amber-400 px-2 py-1 rounded-md">
              {product.productId}
            </span>
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-amber-400 text-xs font-medium">
            {product.rating}
          </span>
          <span className="text-stone-500 text-xs">
            ({product.reviews} reviews)
          </span>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-semibold text-stone-100 group-hover:text-amber-400 transition-colors line-clamp-2 mb-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-stone-500 mb-3">
          by {product.weaverName} • {product.fabric}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-white">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-stone-500 line-through ml-2">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all hover:scale-110"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
