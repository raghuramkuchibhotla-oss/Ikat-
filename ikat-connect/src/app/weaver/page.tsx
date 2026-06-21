"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, ShoppingCart, TrendingUp, Plus, ArrowRight, Layers, BarChart3, Clock, XCircle, CheckCircle } from "lucide-react";
import { useSession } from "@/providers/session-provider";
import { useAuthStore } from "@/lib/auth-store";
import { getMyWeaverProfile } from "@/actions/weavers";
import { getWeaverOrders } from "@/actions/orders";
import { formatPrice, labels } from "@/lib/utils";

export default function WeaverDashboard() {
  const { user } = useSession();
  const { language } = useAuthStore();
  const t = labels[language];
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyWeaverProfile(), getWeaverOrders()])
      .then(([p, o]) => { setProfile(p); setOrders(o as any[]); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center">
        <div className="text-stone-500">Loading Dashboard...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center py-12 px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-serif font-bold text-white mb-3">Complete Your Weaver Registration</h2>
          <p className="text-stone-400 mb-6">Register as a weaver to access your dashboard, list products, and receive orders.</p>
          <Link href="/weaver/profile" className="btn-accent">Register as Weaver</Link>
        </div>
      </div>
    );
  }

  const isPending = profile.status === "PENDING";
  const isRejected = profile.status === "REJECTED";
  const isVerified = profile.status === "VERIFIED";

  const totalRevenue = orders.reduce((sum: number, o: any) => sum + Number(o.totalAmount), 0);

  const stats = [
    { label: t.products, value: profile.products?.length ?? 0, icon: Package, color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { label: t.orders, value: orders.length, icon: ShoppingCart, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Revenue", value: formatPrice(totalRevenue), icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    {
      label: "Status",
      value: isPending ? "Pending" : isRejected ? "Rejected" : "Verified",
      icon: BarChart3,
      color: isPending ? "text-amber-400" : isRejected ? "text-rose-400" : "text-emerald-400",
      bg: isPending ? "bg-amber-500/10" : isRejected ? "bg-rose-500/10" : "bg-emerald-500/10",
    },
  ];

  return (
    <div className="bg-[#0c0a09] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Pending approval banner */}
        {isPending && (
          <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3 animate-fade-in-up">
            <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-400 font-medium text-sm">Pending Admin Approval</p>
              <p className="text-stone-400 text-xs mt-0.5">
                Your weaver registration is under review. Once approved, you can list products and start receiving orders. We will notify you by email.
              </p>
            </div>
          </div>
        )}

        {/* Rejected banner */}
        {isRejected && (
          <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 flex items-start gap-3 animate-fade-in-up">
            <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-rose-400 font-medium text-sm">Registration Rejected</p>
              <p className="text-stone-400 text-xs mt-0.5">
                Your weaver registration was not approved. Please contact support or re-submit with valid credentials.
              </p>
            </div>
          </div>
        )}

        {/* Verified badge */}
        {isVerified && (
          <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 flex items-center gap-2 animate-fade-in-up">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="text-emerald-400 text-sm font-medium">Verified Weaver — You can list products and manage orders.</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white mb-1">{t.dashboard}</h1>
            <p className="text-stone-400">Welcome, {user?.name ?? profile.user?.name} • స్వాగతం</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            {isVerified ? (
              <Link href="/weaver/products/new" className="btn-accent flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" />{t.addProduct}
              </Link>
            ) : (
              <button
                disabled
                title={isPending ? "Waiting for admin approval" : "Registration rejected"}
                className="btn-accent flex items-center gap-2 text-sm opacity-40 cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />{t.addProduct}
              </button>
            )}
            <Link href="/weaver/yarn-board" className="btn-outline flex items-center gap-2 text-sm">
              <Layers className="w-4 h-4" />{t.yarnBoard}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
          {stats.map((stat) => (
            <div key={stat.label} className="card p-5">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-stone-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { href: "/weaver/products", label: "Manage Products / ఉత్పత్తులు నిర్వహించు", desc: "View, edit, update stock", icon: Package, blocked: !isVerified },
            { href: "/weaver/orders", label: "View Orders / ఆర్డర్లు చూడు", desc: "Track and update order status", icon: ShoppingCart, blocked: false },
            { href: "/weaver/profile", label: "My Profile / నా ప్రొఫైల్", desc: "Update your weaver profile", icon: BarChart3, blocked: false },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`card p-5 group hover:border-amber-500/30 ${action.blocked ? "opacity-50 pointer-events-none" : ""}`}
            >
              <action.icon className="w-6 h-6 text-amber-400 mb-3" />
              <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-amber-400 transition-colors">{action.label}</h3>
              <p className="text-stone-500 text-xs">{action.blocked ? "Available after admin verification" : action.desc}</p>
              <ArrowRight className="w-4 h-4 text-stone-600 mt-3 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>

        <div className="card p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Recent Orders / ఇటీవలి ఆర్డర్లు</h2>
            <Link href="/weaver/orders" className="text-indigo-400 text-sm hover:text-indigo-300">View All →</Link>
          </div>
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-stone-500 text-xs uppercase tracking-wider border-b border-stone-800">
                    <th className="pb-3 pr-4">Order</th>
                    <th className="pb-3 pr-4">Customer</th>
                    <th className="pb-3 pr-4">Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order: any) => (
                    <tr key={order.id} className="border-b border-stone-800/50 hover:bg-stone-800/30">
                      <td className="py-3 pr-4 font-mono text-amber-400 text-sm">{order.id.slice(0, 8).toUpperCase()}</td>
                      <td className="py-3 pr-4 text-white text-sm">{order.customer?.name ?? "—"}</td>
                      <td className="py-3 pr-4 text-white text-sm">{formatPrice(Number(order.totalAmount))}</td>
                      <td className="py-3">
                        <span className={`badge text-[10px] ${
                          order.status === "DELIVERED" ? "badge-success" :
                          order.status === "SHIPPED" ? "badge-info" :
                          order.status === "PROCESSING" ? "badge-warning" : "badge-primary"
                        }`}>{order.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-stone-500 text-sm">
              {isPending ? "Orders will appear here once you are verified and customers purchase your products." : "No orders received yet."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
