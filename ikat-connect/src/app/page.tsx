"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, ShoppingBag, Star, Shield, Truck, RefreshCcw,
  BadgeCheck, Flame, Zap, ChevronRight, Package, Tag,
  Users, CheckCircle, Sparkles,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { formatPrice } from "@/lib/utils";
import { getProducts } from "@/actions/products";
import { getPublicWeavers } from "@/actions/weavers";

const CATEGORY_MAP: Record<string, string> = {
  SAREE: "sarees", DUPATTA: "dupattas", DRESS_MATERIAL: "dress-materials",
};

function adaptProduct(p: any) {
  return {
    id: p.id, productId: p.productCode, name: p.title,
    description: p.description ?? "", price: Number(p.price),
    category: CATEGORY_MAP[p.category] ?? "sarees",
    fabric: "Handloom Ikat", color: "Traditional",
    images: p.images?.length > 0
      ? p.images
      : ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop"],
    weaverId: p.weaverId, weaverName: p.weaver?.user?.name ?? "Artisan Weaver",
    inStock: p.stock > 0, stockQuantity: p.stock, rating: 4.8, reviews: 0, isPreOrder: false,
  } as any;
}

const TICKER_ITEMS = [
  "GI TAGGED AUTHENTIC IKAT", "DIRECT FROM WEAVER", "ZERO MIDDLEMEN",
  "TELANGANA HANDLOOM", "VERIFIED ARTISANS", "FAIR TRADE PRICES",
  "POCHAMPALLY CRAFT", "100% HANDWOVEN", "FREE SHIPPING ₹999+",
];

const TRUST_BADGES = [
  { icon: BadgeCheck, label: "GI Certified", sub: "Govt. Authenticated Ikat" },
  { icon: Truck, label: "Free Shipping", sub: "On orders above ₹999" },
  { icon: Shield, label: "100% Authentic", sub: "Verified by unique Product ID" },
  { icon: RefreshCcw, label: "Easy Returns", sub: "7-day hassle-free returns" },
];

const CATEGORIES = [
  {
    key: "sarees", label: "Ikat Sarees",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=600&fit=crop",
    from: 3500, badge: "Best Seller",
  },
  {
    key: "dupattas", label: "Ikat Dupattas",
    image: "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=800&h=600&fit=crop",
    from: 1800, badge: "New Arrivals",
  },
  {
    key: "dress-materials", label: "Dress Materials",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=600&fit=crop",
    from: 2800, badge: "Trending",
  },
];

const HOW_STEPS = [
  { step: "01", icon: Sparkles, title: "Browse & Discover", desc: "Explore hundreds of authentic Pochampally Ikat pieces, each with a unique Product ID." },
  { step: "02", icon: ShoppingBag, title: "Order Directly", desc: "Buy straight from verified weavers — no agents, no markup, fair prices for everyone." },
  { step: "03", icon: Truck, title: "Track & Receive", desc: "Real-time order tracking, shipped directly from the weaver's workshop to your door." },
];

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [weavers, setWeavers] = useState<any[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [weaverCount, setWeaverCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"all" | "sarees" | "dupattas" | "dress-materials">("all");
  const productsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProductCount(data.length);
        setProducts(data.slice(0, 8).map(adaptProduct));
      })
      .catch(() => {});

    getPublicWeavers()
      .then((data: any[]) => {
        setWeaverCount(data.length);
        setWeavers(
          data.slice(0, 4).map((w: any) => ({
            id: w.id, photo: w.profileImageUrl ?? null,
            name: w.user?.name ?? "Artisan Weaver",
            location: w.location ?? "Pochampally",
            products: w.products?.length ?? 0,
          }))
        );
      })
      .catch(() => {});
  }, []);

  const filtered = activeTab === "all"
    ? products
    : products.filter((p) => p.category === activeTab);

  const placeholderWeavers = [
    { id: 1, name: "Rajesh Kumar", location: "Pochampally", photo: null, products: 12 },
    { id: 2, name: "Lakshmi Devi", location: "Nalgonda", photo: null, products: 8 },
    { id: 3, name: "Srinivas Rao", location: "Bhoodan", photo: null, products: 15 },
    { id: 4, name: "Padma Bai", location: "Pochampally", photo: null, products: 6 },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#0c0a09" }}>

      {/* ── ANNOUNCEMENT BAR ─────────────────────────────────────────── */}
      <div style={{ background: "#1a0e06", borderBottom: "1px solid #2B1F16" }} className="py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 overflow-x-auto">
            <span style={{ color: "#C9883A" }} className="flex items-center gap-1.5 text-xs font-medium whitespace-nowrap">
              <Tag className="w-3 h-3 shrink-0" />
              Free shipping on orders above ₹999
            </span>
            <span style={{ color: "#6A5A4A" }} className="hidden sm:block text-xs">|</span>
            <span style={{ color: "#C9883A" }} className="hidden sm:flex items-center gap-1.5 text-xs font-medium whitespace-nowrap">
              <BadgeCheck className="w-3 h-3 shrink-0" />
              GI Certified Pochampally Ikat
            </span>
          </div>
          <Link
            href="/products"
            style={{ color: "#963D3D" }}
            className="text-xs font-semibold whitespace-nowrap flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            Shop Now <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: "88vh" }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=1600&h=900&fit=crop"
            alt="Pochampally Ikat fabric"
            fill priority
            className="object-cover opacity-25"
            sizes="100vw"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0c0a09 50%, rgba(12,10,9,0.7) 100%)" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 py-20 lg:py-28">

          {/* Left — copy */}
          <div className="lg:w-[52%] shrink-0">
            <div
              style={{ background: "rgba(150,61,61,0.12)", borderColor: "rgba(150,61,61,0.4)", color: "#C87070" }}
              className="inline-flex items-center gap-2 border rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-widest mb-6"
            >
              <Flame className="w-3 h-3" /> Pochampally · GI Tagged
            </div>

            <h1
              style={{ color: "#F2E8D5", lineHeight: "1.05" }}
              className="font-serif text-5xl md:text-6xl xl:text-7xl font-bold mb-5"
            >
              Wear the Art<br />
              of the Loom<span style={{ color: "#C9883A" }}>.</span>
            </h1>

            <p style={{ color: "#7A6A58" }} className="text-lg leading-relaxed mb-8 max-w-md">
              Authentic handwoven Ikat sarees, dupattas &amp; dress materials — straight from verified
              Telangana weavers. No middlemen. Fair prices.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: "linear-gradient(135deg,#A86820,#C9883A)", color: "#0D0906" }}
              >
                <ShoppingBag className="w-4 h-4" /> Shop Now
              </Link>
              <button
                onClick={() => productsRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all hover:text-[#C9883A]"
                style={{ border: "1px solid #2B1F16", color: "#8A7A68" }}
              >
                Explore Collection <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Stats row */}
            <div style={{ borderTop: "1px solid #2B1F16" }} className="flex items-center gap-8 pt-7">
              {[
                { value: weaverCount > 0 ? `${weaverCount}+` : "50+", label: "Verified Weavers" },
                { value: productCount > 0 ? `${productCount}+` : "500+", label: "Handwoven Products" },
                { value: "GI", label: "Tagged & Certified" },
              ].map((s) => (
                <div key={s.label}>
                  <p style={{ color: "#C9883A" }} className="text-2xl font-bold font-serif">{s.value}</p>
                  <p style={{ color: "#5A4A3A" }} className="text-[11px] mt-0.5 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — product showcase cards */}
          <div className="hidden lg:flex lg:w-[48%] w-full relative justify-center items-center">
            <div className="relative w-full max-w-md" style={{ height: "420px" }}>

              {/* Back card */}
              <div
                className="absolute rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  top: "30px", right: "0", width: "62%", height: "360px",
                  background: "#1A1411", border: "1px solid #2B1F16",
                  transform: "rotate(4deg)",
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop"
                  alt="Dress material" fill className="object-cover opacity-80"
                  sizes="200px"
                />
              </div>

              {/* Front card */}
              <div
                className="absolute rounded-2xl overflow-hidden shadow-2xl"
                style={{ top: "0", left: "0", width: "68%", height: "380px", background: "#1A1411", border: "1px solid #2B1F16" }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop"
                  alt="Ikat Saree" fill className="object-cover"
                  sizes="240px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0906] via-transparent to-transparent" />
                <div
                  className="absolute bottom-4 left-4 right-4 rounded-xl px-4 py-3"
                  style={{ background: "rgba(13,9,6,0.85)", backdropFilter: "blur(8px)", border: "1px solid #2B1F16" }}
                >
                  <p style={{ color: "#7A6A58" }} className="text-[10px] uppercase tracking-widest mb-0.5">Handwoven Saree</p>
                  <div className="flex items-center justify-between">
                    <p style={{ color: "#F2E8D5" }} className="font-bold">{formatPrice(4500)}</p>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(150,61,61,0.2)", color: "#C87070", border: "1px solid rgba(150,61,61,0.4)" }}
                    >
                      GI Certified
                    </span>
                  </div>
                </div>
              </div>

              {/* Rating float */}
              <div
                className="absolute rounded-xl px-3 py-2 flex items-center gap-2 shadow-xl"
                style={{ bottom: "20px", right: "10px", background: "#1c1917", border: "1px solid #2B1F16" }}
              >
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <div>
                  <p style={{ color: "#F2E8D5" }} className="text-xs font-bold">4.9/5</p>
                  <p style={{ color: "#5A4A3A" }} className="text-[10px]">500+ reviews</p>
                </div>
              </div>

              {/* Direct weaver float */}
              <div
                className="absolute rounded-xl px-3 py-2 flex items-center gap-2 shadow-xl"
                style={{ top: "10px", right: "20px", background: "#1c1917", border: "1px solid #2B1F16" }}
              >
                <BadgeCheck className="w-4 h-4" style={{ color: "#C9883A" }} />
                <p style={{ color: "#C9883A" }} className="text-xs font-semibold">Direct Weaver</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE TICKER ───────────────────────────────────────────── */}
      <div style={{ background: "#963D3D" }} className="py-2.5 overflow-hidden">
        <div className="animate-marquee">
          {[0, 1].map((pass) => (
            <span key={pass} className="inline-flex items-center gap-0">
              {TICKER_ITEMS.map((item) => (
                <span key={`${pass}-${item}`} className="inline-flex items-center">
                  <span style={{ color: "#F2E8D5", letterSpacing: "0.18em" }} className="text-[10px] font-bold uppercase px-5">
                    {item}
                  </span>
                  <span style={{ color: "rgba(242,232,213,0.35)" }} className="text-xs">◆</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── TRUST BADGES ─────────────────────────────────────────────── */}
      <div style={{ background: "#110d0a", borderBottom: "1px solid #1e1612" }} className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(201,136,58,0.1)", border: "1px solid rgba(201,136,58,0.2)" }}
                >
                  <Icon className="w-5 h-5" style={{ color: "#C9883A" }} />
                </div>
                <div>
                  <p style={{ color: "#F2E8D5" }} className="text-sm font-semibold">{label}</p>
                  <p style={{ color: "#5A4A3A" }} className="text-[11px]">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SHOP BY CATEGORY ─────────────────────────────────────────── */}
      <section style={{ background: "#0c0a09" }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p style={{ color: "#C9883A", letterSpacing: "0.2em" }} className="text-[11px] font-semibold uppercase mb-2">
                Browse by Type
              </p>
              <h2 style={{ color: "#F2E8D5" }} className="font-serif text-3xl md:text-4xl font-bold">
                Shop by Category
              </h2>
            </div>
            <Link
              href="/products"
              style={{ color: "#C9883A" }}
              className="hidden md:flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-opacity"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                href={`/products?category=${cat.key}`}
                className="group relative rounded-2xl overflow-hidden block"
                style={{ aspectRatio: "4/3" }}
              >
                <Image
                  src={cat.image} alt={cat.label} fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/20 to-transparent" />

                <div
                  className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{ background: "rgba(150,61,61,0.85)", color: "#F2E8D5" }}
                >
                  {cat.badge}
                </div>

                <div
                  className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                  style={{ background: "#C9883A" }}
                >
                  <ArrowRight className="w-4 h-4 text-black" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p style={{ color: "#C9883A", letterSpacing: "0.15em" }} className="text-[10px] font-semibold uppercase mb-1">
                    Starting {formatPrice(cat.from)}
                  </p>
                  <div className="flex items-center justify-between">
                    <h3 style={{ color: "#F2E8D5" }} className="text-xl font-bold font-serif">
                      {cat.label}
                    </h3>
                    <span
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(13,9,6,0.7)", color: "#7A6A58" }}
                    >
                      Shop →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────────────── */}
      <section ref={productsRef} style={{ background: "#0e0b08" }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4" style={{ color: "#C9883A" }} />
                <p style={{ color: "#C9883A", letterSpacing: "0.2em" }} className="text-[11px] font-semibold uppercase">
                  Handpicked for You
                </p>
              </div>
              <h2 style={{ color: "#F2E8D5" }} className="font-serif text-3xl md:text-4xl font-bold">
                Trending Now
              </h2>
            </div>
            <Link
              href="/products"
              style={{ color: "#C9883A" }}
              className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity shrink-0"
            >
              View all products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
            {[
              { id: "all", label: "All" },
              { id: "sarees", label: "Sarees" },
              { id: "dupattas", label: "Dupattas" },
              { id: "dress-materials", label: "Dress Materials" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap"
                style={
                  activeTab === tab.id
                    ? { background: "#C9883A", color: "#0c0a09" }
                    : { background: "#1A1411", color: "#7A6A58", border: "1px solid #2B1F16" }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden animate-pulse"
                  style={{ background: "#1A1411", border: "1px solid #2B1F16", aspectRatio: "3/4" }}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all hover:text-[#C9883A]"
              style={{ border: "1px solid #2B1F16", color: "#8A7A68" }}
            >
              View Complete Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WEAVER SPOTLIGHT ─────────────────────────────────────────── */}
      <section style={{ background: "#0c0a09", borderTop: "1px solid #1e1612" }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p style={{ color: "#C9883A", letterSpacing: "0.2em" }} className="text-[11px] font-semibold uppercase mb-2">
                The Makers
              </p>
              <h2 style={{ color: "#F2E8D5" }} className="font-serif text-3xl md:text-4xl font-bold">
                Meet Our Weavers
              </h2>
            </div>
            {weaverCount > 0 && (
              <p style={{ color: "#5A4A3A" }} className="text-sm hidden sm:block">
                {weaverCount} verified artisans
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
            {(weavers.length > 0 ? weavers : placeholderWeavers).map((w: any) => (
              <div
                key={w.id}
                style={{ background: "#1A1411", border: "1px solid #2B1F16" }}
                className="rounded-2xl p-5 group hover:border-[#C9883A]/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div
                  className="w-14 h-14 mb-4 rounded-full overflow-hidden"
                  style={{ background: "#231B15" }}
                >
                  {w.photo ? (
                    <Image src={w.photo} alt={w.name} width={56} height={56} className="object-cover w-full h-full" />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg,#231B15,#3D2E22)" }}
                    >
                      <span style={{ color: "#C9883A" }} className="text-xl font-bold font-serif">
                        {w.name?.[0]}
                      </span>
                    </div>
                  )}
                </div>

                <h3 style={{ color: "#F2E8D5" }} className="font-semibold text-sm mb-0.5">{w.name}</h3>
                <p style={{ color: "#5A4A3A" }} className="text-xs mb-3">📍 {w.location}</p>

                <div className="flex items-center justify-between">
                  <div
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase"
                    style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399" }}
                  >
                    <CheckCircle className="w-3 h-3" /> Verified
                  </div>
                  {w.products > 0 && (
                    <span style={{ color: "#5A4A3A" }} className="text-[11px]">{w.products} items</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section style={{ background: "#0e0b08", borderTop: "1px solid #1e1612" }} className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p style={{ color: "#C9883A", letterSpacing: "0.2em" }} className="text-[11px] font-semibold uppercase mb-3">
              Simple as 1-2-3
            </p>
            <h2 style={{ color: "#F2E8D5" }} className="font-serif text-3xl md:text-4xl font-bold">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_STEPS.map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="relative text-center">
                <div
                  className="w-20 h-20 rounded-2xl mx-auto mb-5 flex flex-col items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #1A1411, #231B15)", border: "1px solid #2B1F16" }}
                >
                  <span style={{ color: "#C9883A", opacity: 0.5 }} className="font-mono text-[10px] font-bold mb-1">{step}</span>
                  <Icon className="w-7 h-7" style={{ color: "#C9883A" }} />
                </div>
                <h3 style={{ color: "#F2E8D5" }} className="font-semibold text-base mb-2">{title}</h3>
                <p style={{ color: "#6A5A4A" }} className="text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WEAVER CTA ───────────────────────────────────────────────── */}
      <section className="py-16 relative overflow-hidden" style={{ background: "#13100d" }}>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #C9883A 0, #C9883A 1px, transparent 0, transparent 50%)", backgroundSize: "24px 24px" }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(150,61,61,0.3) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-6 text-xs font-semibold uppercase tracking-widest"
            style={{ background: "rgba(201,136,58,0.1)", border: "1px solid rgba(201,136,58,0.2)", color: "#C9883A" }}
          >
            <Users className="w-3 h-3" /> For Weavers
          </div>

          <h2 style={{ color: "#F2E8D5" }} className="font-serif text-3xl md:text-5xl font-bold mb-4">
            Your craft deserves<br />a direct audience.
          </h2>

          <p style={{ color: "#6A5A4A" }} className="text-base leading-relaxed mb-8 max-w-lg mx-auto">
            Join IKAT CONNECT — list your products, access bulk yarn purchasing through our Yarn Board, and earn more with zero middlemen.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg,#A86820,#C9883A)", color: "#0D0906" }}
            >
              Join as Weaver <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all hover:text-[#C9883A]"
              style={{ border: "1px solid #3D2E22", color: "#8A7A68" }}
            >
              <Package className="w-4 h-4" /> Browse Products
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
