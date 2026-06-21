"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Search, Shield, CheckCircle, XCircle, MapPin,
  Loader2, QrCode, Package, ArrowRight, AlertTriangle,
} from "lucide-react";
import { getProductByCode } from "@/actions/products";
import { formatPrice } from "@/lib/utils";

const CATEGORY_LABELS: Record<string, string> = {
  SAREE: "Saree",
  DUPATTA: "Dupatta",
  DRESS_MATERIAL: "Dress Material",
};

function VerifyContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("code") ?? "");
  const [checkedCode, setCheckedCode] = useState("");
  const [product, setProduct] = useState<any>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "found" | "not_found">("idle");

  useEffect(() => {
    const initial = searchParams.get("code");
    if (initial) handleVerify(initial);
  }, []);

  async function handleVerify(override?: string) {
    const target = (override ?? query).trim().toUpperCase();
    if (!target) return;
    setCheckedCode(target);
    setStatus("loading");
    setProduct(null);
    try {
      const result = await getProductByCode(target);
      if (result) {
        setProduct(result);
        setStatus("found");
      } else {
        setStatus("not_found");
      }
    } catch {
      setStatus("not_found");
    }
  }

  return (
    <div className="bg-[#0c0a09] min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 mb-4">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">
            Verify Authenticity
          </h1>
          <p className="text-stone-400 text-sm mb-1">
            ప్రామాణికత ధృవీకరించు &bull; प्रामाणिकता सत्यापित करें
          </p>
          <p className="text-stone-500 text-sm max-w-md mx-auto mt-2">
            Enter the product code from the label or QR code to confirm your Ikat product is genuine.
          </p>
        </div>

        <div className="card p-6 mb-8 animate-fade-in-up">
          <label className="text-stone-400 text-sm block mb-2">Product Code</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value.toUpperCase()); setStatus("idle"); }}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                placeholder="e.g. POC-IKAT-0001"
                className="input-field pl-11 font-mono tracking-widest"
              />
            </div>
            <button
              onClick={() => handleVerify()}
              disabled={status === "loading" || !query.trim()}
              className="btn-primary flex items-center gap-2 px-6 disabled:opacity-60"
            >
              {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Verify
            </button>
          </div>
        </div>

        {status === "loading" && (
          <div className="card p-8 text-center animate-fade-in-up">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
            <p className="text-stone-400">Checking authenticity registry…</p>
          </div>
        )}

        {status === "found" && product && (
          <div className="space-y-5 animate-fade-in-up">
            <div className="card p-5 border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-emerald-400 font-semibold">Authentic Pochampally Ikat</p>
                  <p className="text-stone-400 text-sm">
                    This product is registered and verified in the IKAT CONNECT registry.
                  </p>
                </div>
              </div>
            </div>

            <div className="card overflow-hidden">
              <div className="flex">
                {product.images?.[0] && (
                  <div className="relative w-28 h-36 shrink-0">
                    <Image src={product.images[0]} alt={product.title} fill className="object-cover" sizes="112px" />
                  </div>
                )}
                <div className="p-5 flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-2 flex-wrap">
                    <span className="badge badge-primary text-[10px]">
                      {CATEGORY_LABELS[product.category] ?? product.category}
                    </span>
                    <span className="badge badge-success text-[10px]">
                      <Shield className="w-3 h-3 mr-1" />Verified
                    </span>
                  </div>
                  <h2 className="text-white font-semibold leading-snug mb-1">{product.title}</h2>
                  <p className="text-stone-500 text-xs font-mono mb-3">{product.productCode}</p>
                  <p className="text-amber-400 font-bold text-lg">{formatPrice(Number(product.price))}</p>
                </div>
              </div>

              {product.weaver && (
                <div className="border-t border-stone-800 p-5">
                  <p className="text-stone-500 text-xs uppercase tracking-wider mb-3">Handwoven By</p>
                  <div className="flex items-center gap-4">
                    {product.weaver.profileImageUrl ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-emerald-500 shrink-0">
                        <Image src={product.weaver.profileImageUrl} alt={product.weaver.user?.name ?? ""} fill className="object-cover" sizes="48px" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 ring-2 ring-emerald-500 shrink-0 flex items-center justify-center">
                        <span className="text-emerald-400 text-lg font-bold">{product.weaver.user?.name?.[0] ?? "W"}</span>
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-white font-medium">{product.weaver.user?.name ?? "Artisan Weaver"}</p>
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-stone-400 text-xs flex items-center gap-1 mb-0.5">
                        <MapPin className="w-3 h-3" />{product.weaver.location}
                      </p>
                      <p className="text-stone-500 text-xs font-mono">{product.weaver.weaverId}</p>
                    </div>
                  </div>
                  {product.weaver.bio && (
                    <p className="text-stone-500 text-sm mt-4 leading-relaxed">{product.weaver.bio}</p>
                  )}
                </div>
              )}

              <div className="border-t border-stone-800 p-5">
                <div className="grid grid-cols-3 gap-4 text-center text-xs">
                  <div>
                    <p className="text-stone-500 uppercase tracking-wider mb-1">Stock</p>
                    <p className={product.stock > 0 ? "text-emerald-400 font-medium" : "text-rose-400 font-medium"}>
                      {product.stock > 0 ? `${product.stock} left` : "Sold Out"}
                    </p>
                  </div>
                  <div>
                    <p className="text-stone-500 uppercase tracking-wider mb-1">Origin</p>
                    <p className="text-stone-300">Pochampally, TG</p>
                  </div>
                  <div>
                    <p className="text-stone-500 uppercase tracking-wider mb-1">Status</p>
                    <p className="text-emerald-400 font-medium">{product.isActive ? "Active" : "Inactive"}</p>
                  </div>
                </div>
              </div>
            </div>

            <Link href={`/products/${product.id}`} className="btn-primary w-full flex items-center justify-center gap-2">
              <Package className="w-4 h-4" />
              View Product &amp; Purchase
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {status === "not_found" && (
          <div className="card p-6 border-rose-500/30 animate-fade-in-up">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0">
                <XCircle className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <p className="text-rose-400 font-semibold">Product Not Found</p>
                <p className="text-stone-400 text-sm">
                  <span className="font-mono text-rose-300">{checkedCode}</span> is not in our registry.
                </p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-400 text-sm font-medium">Beware of counterfeits</p>
                <p className="text-stone-400 text-xs mt-0.5">
                  Fake powerloom products are often sold as authentic Ikat. Only buy from verified weavers on IKAT CONNECT.
                  Genuine codes start with <span className="font-mono text-amber-400">POC-IKAT-</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {status === "idle" && (
          <div className="card p-8 text-center animate-fade-in-up">
            <Shield className="w-12 h-12 text-stone-600 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-3">How to verify your product</h3>
            <div className="text-left text-stone-400 text-sm space-y-2 max-w-sm mx-auto">
              <p>1. Find the product code on the label or packaging</p>
              <p>2. Scan the QR code on the product tag — it will pre-fill the code</p>
              <p>3. Or enter it manually above (format: <span className="font-mono text-amber-400">POC-IKAT-XXXX</span>)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
