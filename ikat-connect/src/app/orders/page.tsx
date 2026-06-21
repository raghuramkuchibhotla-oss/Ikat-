"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "@/providers/session-provider";
import { Package, Truck, CheckCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { getMyOrders } from "@/actions/orders";
import { formatPrice } from "@/lib/utils";

const ORDERS_PER_PAGE = 5;

const STATUS_STEPS = [
  { key: "PLACED", label: "Order Placed", icon: Package },
  { key: "PROCESSING", label: "Processing", icon: Clock },
  { key: "SHIPPED", label: "Shipped", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: CheckCircle },
];

function statusBadgeClass(status: string) {
  if (status === "DELIVERED") return "badge-success";
  if (status === "SHIPPED") return "badge-info";
  if (status === "PROCESSING") return "badge-warning";
  if (status === "CANCELLED") return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
  return "badge-primary";
}

export default function OrdersPage() {
  const { user } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getMyOrders().then((data) => { setOrders(data as any[]); setLoading(false); }).catch(() => setLoading(false));
  }, [user]);

  return (
    <div className="bg-[#0c0a09] min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">My Orders</h1>
          <p className="text-stone-400">Track your authentic Ikat purchases</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="card p-6 animate-pulse h-24 bg-stone-800/50" />)}
          </div>
        ) : !user ? (
          <div className="card p-8 text-center animate-fade-in-up">
            <h3 className="text-white font-semibold mb-2">Sign in to see your orders</h3>
            <p className="text-stone-400 text-sm mb-4">View and track all your purchases in one place.</p>
            <Link href="/sign-in" className="btn-primary inline-block">Sign In</Link>
          </div>
        ) : orders.length === 0 ? (
          <div className="card p-12 text-center animate-fade-in-up">
            <Package className="w-12 h-12 text-stone-600 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">No orders yet</h3>
            <p className="text-stone-400 text-sm mb-6">Start shopping to see your orders here</p>
            <Link href="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in-up">
            {orders.slice((page - 1) * ORDERS_PER_PAGE, page * ORDERS_PER_PAGE).map((order) => {
              const firstItem = order.items?.[0];
              const currentStepIdx = STATUS_STEPS.findIndex((s) => s.key === order.status);
              return (
                <div key={order.id} className="card p-5">
                  <div className="flex items-start gap-4 mb-4">
                    {firstItem?.product?.images?.[0] && (
                      <div className="relative w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-stone-800">
                        <img src={firstItem.product.images[0]} alt={firstItem.product.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-amber-400 font-mono text-xs font-bold mb-0.5">{order.id.slice(0, 16).toUpperCase()}</p>
                      <h3 className="text-white font-medium text-sm truncate">
                        {firstItem?.product?.title ?? "Order"}
                        {order.items?.length > 1 && <span className="text-stone-500"> +{order.items.length - 1} more</span>}
                      </h3>
                      <p className="text-stone-500 text-xs mt-1">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        {" • "}{formatPrice(Number(order.totalAmount))}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className={`badge text-[10px] ${statusBadgeClass(order.status)}`}>{order.status}</span>
                      <span className={`text-[10px] ${order.paymentStatus === "PAID" ? "text-emerald-400" : "text-amber-400"}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Mini timeline */}
                  <div className="flex items-center gap-1 mt-3 border-t border-stone-800 pt-3">
                    {STATUS_STEPS.map((step, i) => {
                      const done = i <= currentStepIdx;
                      return (
                        <div key={step.key} className="flex items-center flex-1">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "bg-indigo-600" : "bg-stone-800"}`}>
                            <step.icon className={`w-3 h-3 ${done ? "text-white" : "text-stone-600"}`} />
                          </div>
                          {i < STATUS_STEPS.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-1 ${i < currentStepIdx ? "bg-indigo-600" : "bg-stone-800"}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-2">
                    {STATUS_STEPS.map((step) => (
                      <span key={step.key} className="text-[9px] text-stone-600 text-center flex-1">{step.label}</span>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            {orders.length > ORDERS_PER_PAGE && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-outline p-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-stone-400 text-sm">
                  Page {page} of {Math.ceil(orders.length / ORDERS_PER_PAGE)}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(Math.ceil(orders.length / ORDERS_PER_PAGE), p + 1))}
                  disabled={page === Math.ceil(orders.length / ORDERS_PER_PAGE)}
                  className="btn-outline p-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
