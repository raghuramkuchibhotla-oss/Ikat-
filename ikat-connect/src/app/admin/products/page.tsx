"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Shield, Package, Edit, Trash2, Eye } from "lucide-react";
import { mockProducts } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  return (
    <div className="bg-[#0c0a09] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-stone-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <h1 className="text-2xl font-serif font-bold text-white mb-1">Manage Products</h1>
        <p className="text-stone-400 text-sm mb-8">{mockProducts.length} products across all weavers</p>

        <div className="card overflow-hidden animate-fade-in-up">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-stone-500 text-xs uppercase tracking-wider bg-stone-900">
                  <th className="p-4">Product</th>
                  <th className="p-4">Product ID</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Weaver</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockProducts.map((product, i) => (
                  <tr key={product.id} className={`border-b border-stone-800/50 hover:bg-stone-800/30 ${i % 2 === 0 ? "bg-stone-900/30" : ""}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="40px" />
                        </div>
                        <span className="text-white text-sm truncate max-w-[180px]">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-amber-400 text-sm">{product.productId}</td>
                    <td className="p-4 text-stone-400 text-sm capitalize">{product.category.replace("-", " ")}</td>
                    <td className="p-4 text-stone-400 text-sm">{product.weaverName}</td>
                    <td className="p-4 text-white text-sm">{formatPrice(product.price)}</td>
                    <td className="p-4">
                      <span className={`badge text-[10px] ${product.inStock ? "badge-success" : "badge-danger"}`}>
                        {product.inStock ? `${product.stockQuantity} pcs` : "Out"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <span className="text-amber-400 text-sm">★ {product.rating}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-indigo-400 transition-colors">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-rose-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
