"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, ArrowLeft, Package } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useDataStore } from "@/lib/data-store";
import { formatPrice } from "@/lib/utils";

export default function WeaverProductsPage() {
  const { user } = useAuthStore();
  const { weavers, products } = useDataStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Find weaver profile and products
  const weaver = weavers.find((w) => w.userId === user?.id) || weavers[0];
  const weaverId = weaver.id;
  const weaverProducts = products.filter((p) => p.weaverId === weaverId);

  if (!mounted) {
    return (
      <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center">
        <div className="text-center text-stone-500">Loading Products...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#0c0a09] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/weaver" className="inline-flex items-center gap-2 text-stone-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-white mb-1">My Products / నా ఉత్పత్తులు</h1>
            <p className="text-stone-400 text-sm">{weaverProducts.length} products listed</p>
          </div>
          <Link href="/weaver/products/new" className="btn-accent flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>

        {weaverProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {weaverProducts.map((product) => (
              <div key={product.id} className="card overflow-hidden group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 backdrop-blur-sm">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white text-sm font-semibold truncate">{product.name}</h3>
                  <p className="text-stone-500 text-xs mt-1">{product.fabric} • {product.color}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-amber-400 font-bold">{formatPrice(product.price)}</span>
                    <span className={`badge text-[10px] ${product.inStock ? "badge-success" : "badge-danger"}`}>
                      <Package className="w-3 h-3 mr-1" />
                      {product.inStock ? `${product.stockQuantity} in stock` : "Out of stock"}
                    </span>
                  </div>
                  <p className="text-stone-600 text-xs mt-2 font-mono">{product.productId}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center text-stone-500">
            No products listed yet. Click "Add Product" above to list your first item.
          </div>
        )}
      </div>
    </div>
  );
}
