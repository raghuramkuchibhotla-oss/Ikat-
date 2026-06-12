"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Shield,
  ShoppingCart,
  Truck,
  CheckCircle,
  QrCode,
  User,
  MapPin,
} from "lucide-react";
import { getProductById, getWeaverById } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/auth-store";
import { labels } from "@/lib/utils";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = getProductById(id);
  const weaver = product ? getWeaverById(product.weaverId) : undefined;
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const { language } = useAuthStore();
  const t = labels[language];

  if (!product) {
    return (
      <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Product Not Found
          </h1>
          <Link href="/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0c0a09] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in-up">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {/* Authenticity / Pre-Order Badge */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="badge badge-success">
                  <Shield className="w-3 h-3 mr-1" />
                  Authentic Ikat
                </span>
                {product.isPreOrder && (
                  <span className="badge bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-lg backdrop-blur-md">
                    Pre-Order
                  </span>
                )}
              </div>
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i
                        ? "border-indigo-500"
                        : "border-stone-700 hover:border-stone-500"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Category Badge */}
            <span className="badge badge-primary mb-4">
              {product.category === "sarees"
                ? t.sarees
                : product.category === "dupattas"
                  ? t.dupattas
                  : t.dressMaterials}
            </span>

            {/* Product Name (multilingual) */}
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
              {product.name}
            </h1>
            {language === "te" && product.nameTE && (
              <p className="text-indigo-300 text-lg mb-1">{product.nameTE}</p>
            )}
            {language === "hi" && product.nameHI && (
              <p className="text-indigo-300 text-lg mb-1">{product.nameHI}</p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-stone-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-amber-400 text-sm font-medium">
                {product.rating}
              </span>
              <span className="text-stone-500 text-sm">
                ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-stone-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="badge badge-warning">
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )}
                    % OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-stone-300 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: "Fabric", value: product.fabric },
                { label: "Color", value: product.color },
                { label: "Product ID", value: product.productId },
                {
                  label: product.isPreOrder ? "Lead Time" : "Stock",
                  value: product.isPreOrder
                    ? `${product.preOrderLeadTimeDays} days`
                    : product.inStock
                    ? `${product.stockQuantity} available`
                    : "Out of stock",
                },
              ].map((detail) => (
                <div key={detail.label} className="card-elevated p-3">
                  <p className="text-stone-500 text-xs uppercase tracking-wider">
                    {detail.label}
                  </p>
                  <p className="text-white text-sm font-medium mt-1">
                    {detail.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Quantity & Actions */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-stone-700 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-stone-400 hover:text-white transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-2 text-white font-medium min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(
                      Math.min(product.stockQuantity, quantity + 1)
                    )
                  }
                  className="px-4 py-2 text-stone-400 hover:text-white transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              {!product.isPreOrder ? (
                <>
                  <button
                    onClick={() => addItem(product, quantity)}
                    className="btn-outline flex-1 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {t.addToCart}
                  </button>
                  <Link
                    href="/checkout"
                    onClick={() => addItem(product, quantity)}
                    className="btn-accent flex-1 flex items-center justify-center gap-2"
                  >
                    {t.buyNow}
                  </Link>
                </>
              ) : (
                <Link
                  href="/checkout"
                  onClick={() => addItem(product, quantity)}
                  className="btn-accent flex-1 flex flex-col items-center justify-center gap-1 py-3"
                >
                  <span className="font-semibold text-lg">Pre-Order Now</span>
                  <span className="text-xs opacity-80 text-center">(Pay 50% Advance to start weaving)</span>
                </Link>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { icon: Shield, label: "Authenticity Verified" },
                { icon: Truck, label: "Direct Delivery" },
                { icon: QrCode, label: "QR Traceable" },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <badge.icon className="w-5 h-5 text-indigo-400" />
                  <span className="text-stone-400 text-xs">{badge.label}</span>
                </div>
              ))}
            </div>

            {/* Weaver Profile */}
            {weaver && (
              <div className="card p-5">
                <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
                  Made by
                </h3>
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-indigo-500 flex-shrink-0">
                    <Image
                      src={weaver.photo}
                      alt={weaver.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-semibold">{weaver.name}</h4>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-stone-400 text-xs flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3" />
                      {weaver.location}, {weaver.district}
                    </p>
                    <p className="text-indigo-400 text-xs mb-1">
                      {weaver.specialization}
                    </p>
                    <p className="text-stone-500 text-xs">
                      {weaver.experienceYears} years experience •{" "}
                      {weaver.totalOrders} orders
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-amber-400 text-sm font-medium">
                        {weaver.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-stone-400 text-sm mt-4 leading-relaxed">
                  {weaver.bio}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
