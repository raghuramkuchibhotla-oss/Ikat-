"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";
import { getProducts } from "@/actions/products";
import { formatPrice } from "@/lib/utils";

const CATEGORY_LABEL: Record<string, string> = {
  SAREE: "Saree", DUPATTA: "Dupatta", DRESS_MATERIAL: "Dress Material",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((data) => { setProducts(data as any[]); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center"><div className="text-stone-500">Loading Products...</div></div>;

  return (
    <div className="bg-[#0c0a09] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-stone-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <h1 className="text-2xl font-serif font-bold text-white mb-1">Manage Products</h1>
        <p className="text-stone-400 text-sm mb-8">{products.length} active products from real database</p>

        <div className="card overflow-hidden animate-fade-in-up">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-stone-500 text-xs uppercase tracking-wider bg-stone-900">
                  <th className="p-4">Product</th>
                  <th className="p-4">Product Code</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Weaver</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">View</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-stone-500">No products yet. Weavers can add products from their dashboard.</td></tr>
                ) : products.map((product, i) => (
                  <tr key={product.id} className={`border-b border-stone-800/50 hover:bg-stone-800/30 ${i % 2 === 0 ? "bg-stone-900/30" : ""}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-12 rounded-lg overflow-hidden shrink-0 bg-stone-800">
                          {product.images?.[0] ? (
                            <Image src={product.images[0]} alt={product.title} fill className="object-cover" sizes="40px" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-600 text-xs">—</div>
                          )}
                        </div>
                        <span className="text-white text-sm truncate max-w-[150px]">{product.title}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-amber-400 text-sm">{product.productCode}</td>
                    <td className="p-4 text-stone-400 text-sm">{CATEGORY_LABEL[product.category] ?? product.category}</td>
                    <td className="p-4 text-stone-400 text-sm">{product.weaver?.user?.name ?? "—"}</td>
                    <td className="p-4 text-white text-sm">{formatPrice(Number(product.price))}</td>
                    <td className="p-4">
                      <span className={`badge text-[10px] ${product.stock > 0 ? "badge-success" : "badge-warning"}`}>
                        {product.stock > 0 ? `${product.stock} pcs` : "Out"}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link href={`/products/${product.id}`} className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-colors inline-flex">
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
