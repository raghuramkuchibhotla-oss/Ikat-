"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Plus,
  ArrowRight,
  Layers,
  BarChart3,
} from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useDataStore } from "@/lib/data-store";
import { formatPrice } from "@/lib/utils";
import { labels } from "@/lib/utils";

export default function WeaverDashboard() {
  const { language, user } = useAuthStore();
  const { weavers, products, orders } = useDataStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = labels[language];

  // Dynamically find current weaver's profile
  const weaver = weavers.find((w) => w.userId === user?.id) || weavers[0];
  const weaverId = weaver.id;

  const weaverProducts = products.filter((p) => p.weaverId === weaverId);
  const weaverOrders = orders.filter((o) => o.weaverId === weaverId);
  const totalRevenue = weaverOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  if (!mounted) {
    return (
      <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center">
        <div className="text-center text-stone-500">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#0c0a09] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white mb-1">
              {t.dashboard}
            </h1>
            <p className="text-stone-400">
              Welcome, {weaver.name} • స్వాగతం • स्वागत
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Link
              href="/weaver/products/new"
              className="btn-accent flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              {t.addProduct}
            </Link>
            <Link
              href="/weaver/yarn-board"
              className="btn-outline flex items-center gap-2 text-sm"
            >
              <Layers className="w-4 h-4" />
              {t.yarnBoard}
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
          {[
            {
              label: t.products,
              value: weaverProducts.length,
              icon: Package,
              color: "text-indigo-400",
              bg: "bg-indigo-500/10",
            },
            {
              label: t.orders,
              value: weaverOrders.length,
              icon: ShoppingCart,
              color: "text-amber-400",
              bg: "bg-amber-500/10",
            },
            {
              label: "Revenue",
              value: formatPrice(totalRevenue),
              icon: TrendingUp,
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
            },
            {
              label: "Rating",
              value: weaver.rating.toString(),
              icon: BarChart3,
              color: "text-rose-400",
              bg: "bg-rose-500/10",
            },
          ].map((stat) => (
            <div key={stat.label} className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-stone-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              href: "/weaver/products",
              label: "Manage Products / ఉత్పత్తులు నిర్వహించు",
              desc: "View, edit, update stock",
              icon: Package,
            },
            {
              href: "/weaver/orders",
              label: "View Orders / ఆర్డర్లు చూడు",
              desc: "Track and update order status",
              icon: ShoppingCart,
            },
            {
              href: "/weaver/profile",
              label: "My Profile / నా ప్రొఫైల్",
              desc: "Update your weaver profile",
              icon: BarChart3,
            },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="card p-5 group hover:border-amber-500/30"
            >
              <action.icon className="w-6 h-6 text-amber-400 mb-3" />
              <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-amber-400 transition-colors">
                {action.label}
              </h3>
              <p className="text-stone-500 text-xs">{action.desc}</p>
              <ArrowRight className="w-4 h-4 text-stone-600 mt-3 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="card p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">
              Recent Orders / ఇటీవలి ఆర్డర్లు
            </h2>
            <Link
              href="/weaver/orders"
              className="text-indigo-400 text-sm hover:text-indigo-300"
            >
              View All →
            </Link>
          </div>
          {weaverOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-stone-500 text-xs uppercase tracking-wider border-b border-stone-800">
                    <th className="pb-3 pr-4">Order ID</th>
                    <th className="pb-3 pr-4">Customer</th>
                    <th className="pb-3 pr-4">Product</th>
                    <th className="pb-3 pr-4">Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {weaverOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-stone-800/50 hover:bg-stone-800/30"
                    >
                      <td className="py-3 pr-4 font-mono text-amber-400 text-sm">
                        {order.orderId}
                      </td>
                      <td className="py-3 pr-4 text-white text-sm">
                        {order.customerName}
                      </td>
                      <td className="py-3 pr-4 text-stone-400 text-sm truncate max-w-[200px]">
                        {order.productName}
                        {order.isPreOrder && (
                          <span className="ml-2 badge bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] py-0 px-1">
                            Pre-Order
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-white text-sm">
                        {order.isPreOrder ? (
                          <>
                            {formatPrice(order.advancePaidAmount || 0)}
                            <span className="text-[10px] text-stone-500 block mt-0.5">Advance (50%)</span>
                          </>
                        ) : (
                          formatPrice(order.totalAmount)
                        )}
                      </td>
                      <td className="py-3">
                        <span
                          className={`badge text-[10px] ${
                            order.status === "delivered"
                              ? "badge-success"
                              : order.status === "shipped"
                                ? "badge-info"
                                : order.status === "processing" || order.status === "weaving-started"
                                  ? "badge-warning"
                                  : "badge-primary"
                          }`}
                        >
                          {order.status.replace("-", " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-stone-500 text-sm">
              No orders received yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
