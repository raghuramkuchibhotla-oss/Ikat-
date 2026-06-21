"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, ArrowLeft, Package, ToggleLeft, ToggleRight } from "lucide-react";
import { getWeaverProducts } from "@/actions/products";
import { toggleProductActive } from "@/actions/products";
import { formatPrice } from "@/lib/utils";

export default function WeaverProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggleError, setToggleError] = useState("");

  useEffect(() => {
    getWeaverProducts().then((data) => { setProducts(data as any[]); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleToggle = async (productId: string) => {
    setToggleError("");
    try {
      const updated = await toggleProductActive(productId);
      setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, isActive: (updated as any).isActive } : p));
    } catch (e: any) {
      setToggleError(e.message ?? "Failed to update product status. Please try again.");
    }
  };

  if (loading) {
    return <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center"><div className="text-stone-500">Loading Products...</div></div>;
  }

  return (
    <div className="bg-[#0c0a09] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/weaver" className="inline-flex items-center gap-2 text-stone-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {toggleError && (
          <div className="mb-4 bg-rose-500/10 border border-rose-500/30 rounded-xl p-3">
            <p className="text-rose-400 text-sm">{toggleError}</p>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-white mb-1">My Products / నా ఉత్పత్తులు</h1>
            <p className="text-stone-400 text-sm">{products.length} products listed</p>
          </div>
          <Link href="/weaver/products/new" className="btn-accent flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {products.map((product) => (
              <div key={product.id} className="card overflow-hidden group">
                <div className="relative aspect-4/3 overflow-hidden">
                  {product.images?.[0] ? (
                    <Image src={product.images[0]} alt={product.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                  ) : (
                    <div className="w-full h-full bg-stone-800 flex items-center justify-center">
                      <Package className="w-8 h-8 text-stone-600" />
                    </div>
                  )}
                  <div className={`absolute top-3 right-3 badge text-[10px] ${product.isActive ? "badge-success" : "bg-stone-700 text-stone-400 border border-stone-600"}`}>
                    {product.isActive ? "Active" : "Hidden"}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white text-sm font-semibold truncate">{product.title}</h3>
                  <p className="text-stone-500 text-xs mt-1">{product.category.replace("_", " ")}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-amber-400 font-bold">{formatPrice(Number(product.price))}</span>
                    <span className={`badge text-[10px] ${product.stock > 0 ? "badge-success" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
                      <Package className="w-3 h-3 mr-1" />
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </span>
                  </div>
                  <p className="text-stone-600 text-xs mt-2 font-mono">{product.productCode}</p>
                  <button
                    onClick={() => handleToggle(product.id)}
                    className="mt-3 w-full flex items-center justify-center gap-2 text-xs text-stone-400 hover:text-white py-2 rounded-lg hover:bg-stone-800 transition-colors"
                  >
                    {product.isActive ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4" />}
                    {product.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center text-stone-500">
            <Package className="w-12 h-12 text-stone-700 mx-auto mb-4" />
            <p className="mb-4">No products listed yet.</p>
            <Link href="/weaver/products/new" className="btn-accent text-sm">Add Your First Product</Link>
          </div>
        )}
      </div>
    </div>
  );
}
