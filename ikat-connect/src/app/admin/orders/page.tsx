"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Search } from "lucide-react";
import { mockOrders, type OrderStatus } from "@/lib/data";
import { formatPrice, formatDate } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = mockOrders.filter((o) => {
    if (filter !== "all" && o.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        o.orderId.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.weaverName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="bg-[#0c0a09] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-stone-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-white mb-1">
              Order Management
            </h1>
            <p className="text-stone-400 text-sm">
              Google Sheets-style order tracking • {mockOrders.length} total orders
            </p>
          </div>
          <button className="btn-outline flex items-center gap-2 text-sm mt-4 md:mt-0">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order ID, Customer, or Weaver..."
              className="input-field pl-11"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["all", "order-received", "processing", "shipped", "delivered"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === s
                    ? "bg-indigo-600 text-white"
                    : "bg-stone-800 text-stone-400 hover:text-white"
                }`}
              >
                {s === "all" ? "All" : s.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table (Google Sheets Style) */}
        <div className="card overflow-hidden animate-fade-in-up">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-stone-500 text-xs uppercase tracking-wider bg-stone-900">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Weaver</th>
                  <th className="p-4">Qty</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => (
                  <tr
                    key={order.id}
                    className={`border-b border-stone-800/50 hover:bg-stone-800/30 ${
                      i % 2 === 0 ? "bg-stone-900/30" : ""
                    }`}
                  >
                    <td className="p-4 font-mono text-amber-400 text-sm font-bold">
                      {order.orderId}
                    </td>
                    <td className="p-4 text-stone-400 text-sm">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="p-4 text-white text-sm">{order.customerName}</td>
                    <td className="p-4 text-stone-400 text-sm">{order.customerPhone}</td>
                    <td className="p-4 text-stone-400 text-sm truncate max-w-[150px]">
                      {order.productName}
                    </td>
                    <td className="p-4 text-stone-400 text-sm">{order.weaverName}</td>
                    <td className="p-4 text-white text-sm text-center">{order.quantity}</td>
                    <td className="p-4 text-white text-sm font-medium">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="p-4">
                      <span className="badge badge-success text-[10px]">{order.paymentMethod}</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`badge text-[10px] ${
                          order.status === "delivered"
                            ? "badge-success"
                            : order.status === "shipped"
                              ? "badge-info"
                              : order.status === "processing"
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
          {filtered.length === 0 && (
            <div className="p-8 text-center text-stone-500">
              No orders match your filters
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
