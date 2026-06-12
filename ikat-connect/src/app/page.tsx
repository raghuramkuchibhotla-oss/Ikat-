"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Shield,
  TrendingDown,
  Users,
  Star,
  CheckCircle,
  Sparkles,
  Package,
} from "lucide-react";
import { mockProducts, mockWeavers } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { formatPrice } from "@/lib/utils";
import { useAuthStore } from "@/lib/auth-store";
import { labels } from "@/lib/utils";

export default function HomePage() {
  const { language } = useAuthStore();
  const t = labels[language];
  const featuredProducts = mockProducts.slice(0, 4);
  const verifiedWeavers = mockWeavers.filter(
    (w) => w.verificationStatus === "verified"
  );

  return (
    <div className="bg-[#0c0a09]">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden gradient-hero">
        {/* Decorative elements */}
        <div className="absolute inset-0 ikat-pattern opacity-50" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-2 mb-6">
                <span className="badge badge-success">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  GI Tagged
                </span>
                <span className="badge badge-primary">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {t.directFromWeavers}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight mb-6">
                {t.authentic}
                <span className="block text-gradient mt-2">
                  {t.directFromWeavers}
                </span>
              </h1>

              <p className="text-stone-300 text-lg md:text-xl max-w-lg mb-8 leading-relaxed">
                Connect directly with verified Pochampally weavers. No
                middlemen, no fake products — just authentic handwoven Ikat at
                fair prices.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="btn-accent text-center flex items-center justify-center gap-2"
                >
                  {t.products}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/verify"
                  className="btn-outline text-center flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  {t.verify}
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                {[
                  { value: "50+", label: "Verified Weavers" },
                  { value: "500+", label: "Products" },
                  { value: "2000+", label: "Happy Customers" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl md:text-3xl font-bold text-gradient">
                      {stat.value}
                    </p>
                    <p className="text-stone-400 text-xs mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Featured Image Grid */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden aspect-[3/4] relative group">
                  <Image
                    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop"
                    alt="Ikat Saree"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="200px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/50 to-transparent" />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[4/3] relative group">
                  <Image
                    src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=300&fit=crop"
                    alt="Ikat Pattern"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="200px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/30 to-transparent" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden aspect-[4/3] relative group">
                  <Image
                    src="https://images.unsplash.com/photo-1617627143233-46f5de8df5eb?w=400&h=300&fit=crop"
                    alt="Silk Fabric"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="200px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent" />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[3/4] relative group">
                  <Image
                    src="https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=400&h=500&fit=crop"
                    alt="Weaving"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="200px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/30 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PROBLEMS WE SOLVE ==================== */}
      <section className="py-20 bg-[#0c0a09]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Why <span className="text-gradient">IKAT CONNECT</span>?
            </h2>
            <p className="text-stone-400 max-w-2xl mx-auto">
              We solve real problems faced by weavers and customers in the Ikat
              ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {[
              {
                icon: Shield,
                title: "Authenticity Guaranteed",
                desc: "Every product has a unique Product ID and QR code. Verify genuine Pochampally Ikat instantly.",
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
              },
              {
                icon: Users,
                title: "No Middlemen",
                desc: "Buy directly from verified weavers. Fair prices for customers, better income for artisans.",
                color: "text-indigo-400",
                bg: "bg-indigo-500/10",
              },
              {
                icon: TrendingDown,
                title: "Lower Yarn Costs",
                desc: "Our Yarn Board pools requests for bulk purchasing, reducing raw material costs by 20-30%.",
                color: "text-amber-400",
                bg: "bg-amber-500/10",
              },
              {
                icon: Package,
                title: "Direct Delivery",
                desc: "Products shipped directly from weaver to customer with real-time tracking and updates.",
                color: "text-rose-400",
                bg: "bg-rose-500/10",
              },
            ].map((item) => (
              <div key={item.title} className="card p-6 group hover:border-indigo-500/30">
                <div
                  className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURED PRODUCTS ==================== */}
      <section className="py-20 bg-[#1c1917]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">
                Featured <span className="text-gradient">Products</span>
              </h2>
              <p className="text-stone-400">
                Handpicked authentic Ikat products from our verified weavers
              </p>
            </div>
            <Link
              href="/products"
              className="hidden md:flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link
              href="/products"
              className="btn-outline inline-flex items-center gap-2"
            >
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-20 bg-[#0c0a09]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Browse & Verify",
                desc: "Explore authentic Ikat products. Each item has a unique Product ID you can verify for authenticity.",
              },
              {
                step: "02",
                title: "Order Directly",
                desc: "Buy directly from verified weavers. No middlemen. Fair prices for you, better income for artisans.",
              },
              {
                step: "03",
                title: "Track & Receive",
                desc: "Track your order in real-time. Products ship directly from the weaver to your doorstep.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-xl">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-white text-lg font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="text-stone-400 text-sm leading-relaxed max-w-sm mx-auto">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== MEET OUR WEAVERS ==================== */}
      <section className="py-20 bg-[#1c1917]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Meet Our <span className="text-gradient">Weavers</span>
            </h2>
            <p className="text-stone-400 max-w-2xl mx-auto">
              Every product on IKAT CONNECT is made by verified, skilled
              artisans from Pochampally and surrounding villages
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {verifiedWeavers.map((weaver) => (
              <div
                key={weaver.id}
                className="card p-6 text-center group hover:border-amber-500/30"
              >
                <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden ring-2 ring-stone-700 group-hover:ring-amber-500 transition-all">
                  <Image
                    src={weaver.photo}
                    alt={weaver.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <h3 className="text-white font-semibold">{weaver.name}</h3>
                <p className="text-stone-400 text-xs mt-1">
                  {weaver.location} • {weaver.experienceYears} yrs exp
                </p>
                <p className="text-indigo-400 text-xs mt-1">
                  {weaver.specialization}
                </p>
                <div className="flex items-center justify-center gap-1 mt-3">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-amber-400 text-sm font-medium">
                    {weaver.rating}
                  </span>
                  <span className="text-stone-500 text-xs">
                    ({weaver.totalOrders} orders)
                  </span>
                </div>
                <span className="badge badge-success mt-3 text-[10px]">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified Weaver
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== YARN BOARD CTA ==================== */}
      <section className="py-20 bg-[#0c0a09] relative overflow-hidden">
        <div className="absolute inset-0 ikat-pattern opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            Are You a <span className="text-gradient">Weaver</span>?
          </h2>
          <p className="text-stone-400 text-lg mb-8 max-w-2xl mx-auto">
            Join IKAT CONNECT to sell your products directly, access our Yarn
            Requirement Board for bulk purchasing, and grow your business with
            zero middlemen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/weaver/auth"
              className="btn-accent inline-flex items-center justify-center gap-2"
            >
              Join as Weaver <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/auth/login"
              className="btn-outline inline-flex items-center justify-center gap-2"
            >
              Quick Demo Access
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== CATEGORY BROWSE ==================== */}
      <section className="py-20 bg-[#1c1917]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Shop by <span className="text-gradient">Category</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                category: "sarees",
                label: t.sarees,
                count: mockProducts.filter((p) => p.category === "sarees")
                  .length,
                image:
                  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=400&fit=crop",
                from: formatPrice(3500),
              },
              {
                category: "dupattas",
                label: t.dupattas,
                count: mockProducts.filter((p) => p.category === "dupattas")
                  .length,
                image:
                  "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=600&h=400&fit=crop",
                from: formatPrice(1800),
              },
              {
                category: "dress-materials",
                label: t.dressMaterials,
                count: mockProducts.filter(
                  (p) => p.category === "dress-materials"
                ).length,
                image:
                  "https://images.unsplash.com/photo-1617627143233-46f5de8df5eb?w=600&h=400&fit=crop",
                from: formatPrice(2800),
              },
            ].map((cat) => (
              <Link
                key={cat.category}
                href={`/products?category=${cat.category}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3]"
              >
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-bold mb-1">
                    {cat.label}
                  </h3>
                  <p className="text-stone-300 text-sm">
                    {cat.count} products • Starting {cat.from}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
