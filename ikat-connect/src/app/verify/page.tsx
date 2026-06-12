"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search,
  Shield,
  CheckCircle,
  XCircle,
  QrCode,
  MapPin,
  Star,
  AlertTriangle,
} from "lucide-react";
import { verifyProduct, getWeaverById } from "@/lib/data";

export default function VerifyPage() {
  const [productId, setProductId] = useState("");
  const [result, setResult] = useState<"idle" | "found" | "not-found">("idle");
  const product = result === "found" ? verifyProduct(productId) : undefined;
  const weaver = product ? getWeaverById(product.weaverId) : undefined;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const found = verifyProduct(productId.trim().toUpperCase());
    setResult(found ? "found" : "not-found");
  };

  return (
    <div className="bg-[#0c0a09] min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">
            Verify Authenticity
          </h1>
          <h2 className="text-lg text-stone-400 mb-1">
            ప్రామాణికత ధృవీకరించు • प्रामाणिकता सत्यापित करें
          </h2>
          <p className="text-stone-500 text-sm max-w-md mx-auto">
            Enter the Product ID printed on your Ikat product to verify its
            authenticity and view the weaver who made it.
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleVerify}
          className="card p-6 mb-8 animate-fade-in-up"
        >
          <label className="text-stone-400 text-sm block mb-2">
            Product ID
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                type="text"
                value={productId}
                onChange={(e) => {
                  setProductId(e.target.value.toUpperCase());
                  setResult("idle");
                }}
                placeholder="e.g. POC-IKAT-1001"
                className="input-field pl-11 font-mono text-lg tracking-wider"
              />
            </div>
            <button
              type="submit"
              className="btn-primary flex items-center gap-2 px-6"
            >
              <Search className="w-4 h-4" />
              Verify
            </button>
          </div>
          <p className="text-stone-600 text-xs mt-3">
            Try: POC-IKAT-1001, POC-IKAT-1002, POC-IKAT-1008
          </p>
        </form>

        {/* Result - Found */}
        {result === "found" && product && weaver && (
          <div className="animate-fade-in-up space-y-6">
            {/* Success Badge */}
            <div className="card p-6 border-emerald-500/30">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-emerald-400 text-lg font-bold">
                    ✅ Authentic Pochampally Ikat
                  </h3>
                  <p className="text-stone-400 text-sm">
                    This product is verified genuine, handwoven by a certified
                    Pochampally weaver.
                  </p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="card p-6">
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                Product Details
              </h3>
              <div className="flex gap-4">
                <div className="relative w-24 h-32 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div>
                  <h4 className="text-white font-semibold">{product.name}</h4>
                  <p className="text-stone-500 text-xs mt-1">
                    {product.fabric} • {product.color}
                  </p>
                  <p className="text-amber-400 text-xs font-mono mt-2">
                    ID: {product.productId}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-amber-400 text-sm">
                      {product.rating}
                    </span>
                    <span className="text-stone-500 text-xs">
                      ({product.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Weaver Details */}
            <div className="card p-6">
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                Handwoven By
              </h3>
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-emerald-500 flex-shrink-0">
                  <Image
                    src={weaver.photo}
                    alt={weaver.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-semibold">{weaver.name}</h4>
                    <span className="badge badge-success text-[10px]">
                      Verified
                    </span>
                  </div>
                  <p className="text-stone-400 text-xs flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {weaver.location}, {weaver.district}, {weaver.state}
                  </p>
                  <p className="text-indigo-400 text-xs mt-1">
                    {weaver.specialization} • {weaver.experienceYears} years
                    experience
                  </p>
                  <p className="text-stone-500 text-xs mt-1">
                    Weaver ID: {weaver.weaverId}
                  </p>
                  {weaver.cooperativeMembership && (
                    <p className="text-stone-500 text-xs">
                      Co-op: {weaver.cooperativeMembership}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Result - Not Found */}
        {result === "not-found" && (
          <div className="animate-fade-in-up">
            <div className="card p-6 border-rose-500/30">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-7 h-7 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-rose-400 text-lg font-bold">
                    ❌ Product Not Found
                  </h3>
                  <p className="text-stone-400 text-sm">
                    This Product ID is not in our database. The product may be
                    counterfeit.
                  </p>
                </div>
              </div>
              <div className="mt-4 p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-amber-400 text-sm font-medium">
                      Beware of Fakes
                    </p>
                    <p className="text-stone-400 text-xs mt-1">
                      Fake powerloom products are often sold as authentic Ikat.
                      Only buy from verified weavers on IKAT CONNECT.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
