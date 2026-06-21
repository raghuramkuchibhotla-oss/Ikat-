"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, Star, Shield, ShoppingCart, Truck, CheckCircle, QrCode, MapPin,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/auth-store";
import { labels } from "@/lib/utils";
import { getProductById } from "@/actions/products";
import type { Product } from "@/lib/data";

function adaptProduct(p: any): Product {
  const CATEGORY_MAP: Record<string, string> = { SAREE: "sarees", DUPATTA: "dupattas", DRESS_MATERIAL: "dress-materials" };
  return {
    id: p.id,
    productId: p.productCode,
    name: p.title,
    description: p.description ?? "",
    price: Number(p.price),
    category: CATEGORY_MAP[p.category] ?? "sarees",
    fabric: "Handloom Ikat",
    color: "Traditional",
    images: p.images?.length > 0 ? p.images : ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop"],
    weaverId: p.weaverId,
    weaverName: p.weaver?.user?.name ?? "Artisan Weaver",
    inStock: p.stock > 0,
    stockQuantity: p.stock,
    rating: 0,
    reviews: 0,
    isPreOrder: false,
  } as unknown as Product;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [weaver, setWeaver] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const { language } = useAuthStore();
  const t = labels[language];

  useEffect(() => {
    getProductById(id).then((data) => {
      if (data) {
        setProduct(adaptProduct(data));
        setWeaver(data.weaver);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center">
        <div className="text-stone-500">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
          <Link href="/products" className="btn-primary">Back to Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0c0a09] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/products" className="inline-flex items-center gap-2 text-stone-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in-up">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-3/4 rounded-2xl overflow-hidden mb-4">
              <Image src={product.images[selectedImage]} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
              <div className="absolute top-4 left-4">
                <span className="badge badge-success"><Shield className="w-3 h-3 mr-1" />Authentic Ikat</span>
              </div>
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? "border-indigo-500" : "border-stone-700 hover:border-stone-500"}`}>
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <span className="badge badge-primary mb-4">
              {product.category === "sarees" ? t.sarees : product.category === "dupattas" ? t.dupattas : t.dressMaterials}
            </span>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">{product.name}</h1>

            {product.reviews > 0 ? (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-stone-600"}`} />
                  ))}
                </div>
                <span className="text-amber-400 text-sm font-medium">{product.rating}</span>
                <span className="text-stone-500 text-sm">({product.reviews} reviews)</span>
              </div>
            ) : (
              <div className="mb-4">
                <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">New Arrival</span>
              </div>
            )}

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-white">{formatPrice(product.price)}</span>
            </div>

            <p className="text-stone-300 leading-relaxed mb-6">{product.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: "Fabric", value: product.fabric },
                { label: "Color", value: product.color },
                { label: "Product ID", value: product.productId },
                { label: "Stock", value: product.inStock ? `${product.stockQuantity} available` : "Out of stock" },
              ].map((detail) => (
                <div key={detail.label} className="card-elevated p-3">
                  <p className="text-stone-500 text-xs uppercase tracking-wider">{detail.label}</p>
                  <p className="text-white text-sm font-medium mt-1">{detail.value}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-stone-700 rounded-xl">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 text-stone-400 hover:text-white transition-colors">−</button>
                <span className="px-4 py-2 text-white font-medium min-w-[3rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))} className="px-4 py-2 text-stone-400 hover:text-white transition-colors">+</button>
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <button onClick={() => addItem(product, quantity)} className="btn-outline flex-1 flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" />{t.addToCart}
              </button>
              <Link href="/checkout" onClick={() => addItem(product, quantity)} className="btn-accent flex-1 flex items-center justify-center gap-2">
                {t.buyNow}
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {[{ icon: Shield, label: "Authenticity Verified" }, { icon: Truck, label: "Direct Delivery" }, { icon: QrCode, label: "QR Traceable" }].map((badge) => (
                <div key={badge.label} className="flex flex-col items-center gap-2 text-center">
                  <badge.icon className="w-5 h-5 text-indigo-400" />
                  <span className="text-stone-400 text-xs">{badge.label}</span>
                </div>
              ))}
            </div>

            {weaver && (
              <div className="card p-5">
                <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Made by</h3>
                <div className="flex items-start gap-4">
                  {weaver.profileImageUrl ? (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-indigo-500 shrink-0">
                      <Image src={weaver.profileImageUrl} alt={weaver.user?.name} fill className="object-cover" sizes="64px" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-indigo-500/20 ring-2 ring-indigo-500 shrink-0 flex items-center justify-center">
                      <span className="text-indigo-400 text-xl font-bold">{weaver.user?.name?.[0]}</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-semibold">{weaver.user?.name}</h4>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-stone-400 text-xs flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3" />{weaver.location}
                    </p>
                    <p className="text-stone-500 text-xs font-mono">{weaver.weaverId}</p>
                  </div>
                </div>
                {weaver.bio && <p className="text-stone-400 text-sm mt-4 leading-relaxed">{weaver.bio}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
