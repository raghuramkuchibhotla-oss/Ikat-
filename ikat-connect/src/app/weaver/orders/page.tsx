"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getWeaverOrders, updateOrderStatus } from "@/actions/orders";
import { formatPrice } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "PLACED", label: "Placed / ఆర్డర్ అందింది" },
  { value: "PROCESSING", label: "Processing / ప్రాసెసింగ్" },
  { value: "SHIPPED", label: "Shipped / షిప్ చేయబడింది" },
  { value: "DELIVERED", label: "Delivered / డెలివరీ అయింది" },
  { value: "CANCELLED", label: "Cancelled / రద్దు చేయబడింది" },
];

export default function WeaverOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    getWeaverOrders().then((data) => { setOrders(data as any[]); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdating(orderId);
    setUpdateError("");
    try {
      await updateOrderStatus(orderId, status as any);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
    } catch (e: any) {
      setUpdateError(e.message ?? "Failed to update order status. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center"><div className="text-stone-500">Loading Orders...</div></div>;
  }

  return (
    <div className="bg-[#0c0a09] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/weaver" className="inline-flex items-center gap-2 text-stone-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <h1 className="text-2xl font-serif font-bold text-white mb-1">Orders / ఆర్డర్లు</h1>
        <p className="text-stone-400 text-sm mb-4">Manage and update your order statuses</p>

        {updateError && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/30 rounded-xl p-3">
            <p className="text-rose-400 text-sm">{updateError}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="card p-12 text-center text-stone-500">No orders received yet.</div>
        ) : (
          <div className="space-y-4 stagger-children">
            {orders.map((order) => {
              const firstItem = order.items?.[0];
              const shippingAddr = order.shippingAddress as any;
              return (
                <div key={order.id} className="card p-5">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {firstItem?.product?.images?.[0] && (
                      <div className="w-16 h-20 rounded-xl overflow-hidden shrink-0 bg-stone-800">
                        <img src={firstItem.product.images[0]} alt={firstItem.product.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-amber-400 font-mono text-sm font-bold">{order.id.slice(0, 12).toUpperCase()}</p>
                      <h3 className="text-white font-medium truncate">
                        {firstItem?.product?.title ?? "Order"}
                        {order.items?.length > 1 && <span className="text-stone-500 text-sm"> +{order.items.length - 1} items</span>}
                      </h3>
                      <p className="text-stone-500 text-xs mt-1">
                        Customer: {order.customer?.name ?? "—"}
                        {order.customer?.phone && ` • ${order.customer.phone}`}
                      </p>
                      <p className="text-stone-500 text-xs">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")} •{" "}
                        {formatPrice(Number(order.totalAmount))} • Qty: {firstItem?.quantity ?? 1}
                      </p>
                      {shippingAddr?.line1 && (
                        <p className="text-stone-600 text-xs mt-1 truncate">
                          📍 {shippingAddr.line1}, {shippingAddr.city}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={updating === order.id}
                          className={`input-field text-sm py-2 w-56 ${
                            order.status === "DELIVERED" ? "border-emerald-500/50 text-emerald-400" :
                            order.status === "SHIPPED" ? "border-blue-500/50 text-blue-400" :
                            order.status === "PROCESSING" ? "border-amber-500/50 text-amber-400" :
                            "border-indigo-500/50 text-indigo-400"
                          }`}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        {updating === order.id && (
                          <Loader2 className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-stone-400" />
                        )}
                      </div>
                      <p className="text-stone-600 text-[10px]">
                        Payment: <span className={order.paymentStatus === "PAID" ? "text-emerald-400" : "text-amber-400"}>{order.paymentStatus}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
