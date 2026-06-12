"use client";

import Link from "next/link";
import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  ArrowRight,
  Layers,
  Shield,
  Clock,
  AlertTriangle,
  Smartphone,
  BarChart,
} from "lucide-react";
import { useDataStore } from "@/lib/data-store";
import { formatPrice, formatDate } from "@/lib/utils";

export default function AdminDashboard() {
  const { weavers, products, orders, yarnRequests } = useDataStore();
  const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);
  const pendingWeavers = weavers.filter((w) => w.verificationStatus === "pending");
  const pendingOrders = orders.filter((o) => o.status === "order-received" || o.status === "processing");

  return (
    <div className="bg-[#0c0a09] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white mb-1">Admin Dashboard</h1>
            <p className="text-stone-400">Manage weavers, products, orders, and yarn board</p>
          </div>
          <span className="badge badge-success">
            <Shield className="w-3 h-3 mr-1" />
            Admin
          </span>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
          {[
            { label: "Total Weavers", value: weavers.length, icon: Users, color: "text-indigo-400", bg: "bg-indigo-500/10" },
            { label: "Total Products", value: products.length, icon: Package, color: "text-amber-400", bg: "bg-amber-500/10" },
            { label: "Total Orders", value: orders.length, icon: ShoppingCart, color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { label: "Revenue", value: formatPrice(totalRevenue), icon: TrendingUp, color: "text-rose-400", bg: "bg-rose-500/10" },
          ].map((stat) => (
            <div key={stat.label} className="card p-5">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-stone-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Alerts */}
        {pendingWeavers.length > 0 && (
          <div className="card p-4 mb-6 border-amber-500/20 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <p className="text-amber-400 text-sm">
                <span className="font-bold">{pendingWeavers.length}</span> weaver(s) pending verification
              </p>
              <Link href="/admin/weavers" className="ml-auto text-amber-400 text-sm hover:text-amber-300">
                Review →
              </Link>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { href: "/admin/weavers", label: "Manage Weavers", desc: `${pendingWeavers.length} pending`, icon: Users, color: "text-indigo-400" },
            { href: "/admin/products", label: "Manage Products", desc: `${products.length} listed`, icon: Package, color: "text-amber-400" },
            { href: "/admin/orders", label: "Manage Orders", desc: `${pendingOrders.length} active`, icon: ShoppingCart, color: "text-emerald-400" },
            { href: "/admin/yarn-board", label: "Yarn Board", desc: `${yarnRequests.length} requests`, icon: Layers, color: "text-rose-400" },
            { href: "/admin/sheets-sim", label: "Simulator", desc: "Live DB & SMS Hub", icon: Smartphone, color: "text-blue-400" },
            { href: "#", label: "Reports", desc: "Sales & Analytics", icon: BarChart, color: "text-purple-400" },
          ].map((action) => (
            <Link key={action.href} href={action.href} className="card p-5 group hover:border-indigo-500/30">
              <action.icon className={`w-6 h-6 ${action.color} mb-3`} />
              <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-amber-400 transition-colors">
                {action.label}
              </h3>
              <p className="text-stone-500 text-xs">{action.desc}</p>
              <ArrowRight className="w-4 h-4 text-stone-600 mt-3 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>

        {/* Recent Orders Table */}
        <div className="card p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-indigo-400 text-sm hover:text-indigo-300">View All →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-stone-500 text-xs uppercase tracking-wider border-b border-stone-800">
                  <th className="pb-3 pr-4">Order ID</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Weaver</th>
                  <th className="pb-3 pr-4">Product</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3 pr-4">Payment</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b border-stone-800/50 hover:bg-stone-800/30">
                    <td className="py-3 pr-4 font-mono text-amber-400 text-sm">{order.orderId}</td>
                    <td className="py-3 pr-4 text-white text-sm">{order.customerName}</td>
                    <td className="py-3 pr-4 text-stone-400 text-sm">{order.weaverName}</td>
                    <td className="py-3 pr-4 text-stone-400 text-sm truncate max-w-[150px]">{order.productName}</td>
                    <td className="py-3 pr-4 text-white text-sm">{formatPrice(order.totalAmount)}</td>
                    <td className="py-3 pr-4">
                      <span className="badge badge-success text-[10px]">{order.paymentMethod}</span>
                    </td>
                    <td className="py-3">
                      <span className={`badge text-[10px] ${
                        order.status === "delivered" ? "badge-success" :
                        order.status === "shipped" ? "badge-info" :
                        (order.status === "processing" || order.status === "weaving-started") ? "badge-warning" :
                        "badge-primary"
                      }`}>
                        {order.status.replace("-", " ")}
                      </span>
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
