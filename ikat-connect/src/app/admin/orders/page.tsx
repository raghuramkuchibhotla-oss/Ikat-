"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Loader2 } from "lucide-react";
import { getAllOrders, updateOrderStatus } from "@/actions/orders";
import { formatPrice } from "@/lib/utils";

const STATUS_OPTIONS = ["all", "PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    getAllOrders().then((data) => { setOrders(data as any[]); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId: string, status: any) => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
    } catch (e) { console.error(e); } finally { setUpdating(null); }
  };

  const filtered = orders.filter((o) => {
    if (filter !== "all" && o.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return o.id.toLowerCase().includes(q) || (o.customer?.name ?? "").toLowerCase().includes(q);
    }
    return true;
  });

  if (loading) return <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center"><div className="text-stone-500">Loading Orders...</div></div>;

  return (
    <div className="bg-[#0c0a09] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-stone-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-white mb-1">Order Management</h1>
            <p className="text-stone-400 text-sm">{orders.length} total orders from real database</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by Order ID or Customer..." className="input-field pl-11" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map((s) => (
              <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${filter === s ? "bg-indigo-600 text-white" : "bg-stone-800 text-stone-400 hover:text-white"}`}>
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden animate-fade-in-up">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-stone-500 text-xs uppercase tracking-wider bg-stone-900">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => (
                  <tr key={order.id} className={`border-b border-stone-800/50 hover:bg-stone-800/30 ${i % 2 === 0 ? "bg-stone-900/30" : ""}`}>
                    <td className="p-4 font-mono text-amber-400 text-xs">{order.id.slice(0, 12).toUpperCase()}</td>
                    <td className="p-4 text-stone-400 text-sm">{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="p-4 text-white text-sm">{order.customer?.name ?? "—"}</td>
                    <td className="p-4 text-stone-400 text-sm">{order.items?.length ?? 0} item(s)</td>
                    <td className="p-4 text-white text-sm font-medium">{formatPrice(Number(order.totalAmount))}</td>
                    <td className="p-4">
                      <span className={`badge text-[10px] ${order.paymentStatus === "PAID" ? "badge-success" : "badge-warning"}`}>{order.paymentStatus}</span>
                    </td>
                    <td className="p-4">
                      {updating === order.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-stone-400" />
                      ) : (
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`text-xs bg-stone-900 border rounded-lg px-2 py-1 outline-none cursor-pointer ${
                            order.status === "DELIVERED" ? "border-emerald-600 text-emerald-400" :
                            order.status === "SHIPPED" ? "border-blue-600 text-blue-400" :
                            order.status === "CANCELLED" ? "border-rose-600 text-rose-400" :
                            "border-stone-700 text-stone-300"
                          }`}
                        >
                          {["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="p-8 text-center text-stone-500">No orders match your filters</div>}
        </div>
      </div>
    </div>
  );
}
