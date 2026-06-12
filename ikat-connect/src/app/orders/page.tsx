"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useDataStore } from "@/lib/data-store";
import { formatPrice, formatDate } from "@/lib/utils";

const statusSteps = [
  { key: "order-received", label: "Order Received", icon: Package },
  { key: "processing", label: "Processing", icon: Clock },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

export default function OrdersPage() {
  const { orders } = useDataStore();
  const { user, isLoggedIn } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [trackedOrder, setTrackedOrder] = useState<any>(undefined);
  const [showTracker, setShowTracker] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const id = searchId.trim().toUpperCase();
    const order = orders.find((o) => o.orderId === id || o.id === id);
    setTrackedOrder(order);
    setShowTracker(true);
  };

  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex((s) => s.key === status);
  };

  // Filter orders for the logged-in customer
  const customerOrders = user
    ? orders.filter((o) => o.customerId === user.id)
    : [];

  return (
    <div className="bg-[#0c0a09] min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">
            Track Your Order
          </h1>
          <p className="text-stone-400">
            Enter your Order ID to track the delivery status
          </p>
        </div>

        {/* Search */}
        <form
          onSubmit={handleTrack}
          className="card p-6 mb-10 animate-fade-in-up"
        >
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value.toUpperCase())}
                placeholder="Enter Order ID (e.g. POC-IKAT-2001)"
                className="input-field pl-11 font-mono"
              />
            </div>
            <button
              type="submit"
              className="btn-primary flex items-center gap-2"
            >
              Track <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-stone-600 text-xs mt-2">
            Try: POC-IKAT-2001, POC-IKAT-2002, POC-IKAT-2003
          </p>
        </form>

        {/* Tracked Order */}
        {showTracker && trackedOrder && (
          <div className="animate-fade-in-up mb-10">
            <div className="card p-6">
              <div className="flex items-start gap-4 mb-8">
                <div className="relative w-16 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={trackedOrder.productImage}
                    alt={trackedOrder.productName}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-amber-400 font-mono text-sm font-bold">
                    {trackedOrder.orderId}
                  </p>
                  <h3 className="text-white font-semibold">
                    {trackedOrder.productName}
                  </h3>
                  <p className="text-stone-500 text-xs">
                    by {trackedOrder.weaverName} • Qty: {trackedOrder.quantity}
                  </p>
                  <p className="text-stone-400 text-sm mt-1">
                    {formatPrice(trackedOrder.totalAmount)}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative">
                {statusSteps.map((step, i) => {
                  const currentIdx = getStatusIndex(trackedOrder.status);
                  const isCompleted = i <= currentIdx;
                  const isCurrent = i === currentIdx;

                  return (
                    <div key={step.key} className="flex items-start gap-4 mb-6 last:mb-0">
                      {/* Line & Dot */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isCompleted
                              ? isCurrent
                                ? "gradient-primary animate-pulse-glow"
                                : "bg-emerald-600"
                              : "bg-stone-800"
                          }`}
                        >
                          <step.icon
                            className={`w-5 h-5 ${
                              isCompleted ? "text-white" : "text-stone-500"
                            }`}
                          />
                        </div>
                        {i < statusSteps.length - 1 && (
                          <div
                            className={`w-0.5 h-8 mt-1 ${
                              i < currentIdx
                                ? "bg-emerald-600"
                                : "bg-stone-800"
                            }`}
                          />
                        )}
                      </div>
                      {/* Content */}
                      <div className="pt-1.5">
                        <p
                          className={`font-medium ${
                            isCompleted ? "text-white" : "text-stone-500"
                          }`}
                        >
                          {step.label}
                        </p>
                        {isCurrent && (
                          <p className="text-indigo-400 text-xs mt-0.5">
                            Current Status
                          </p>
                        )}
                        {step.key === "delivered" && isCompleted && (
                          <p className="text-emerald-400 text-xs mt-0.5">
                            Delivered on {formatDate(trackedOrder.estimatedDelivery)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-stone-800 text-sm text-stone-400">
                <p>
                  Estimated Delivery:{" "}
                  <span className="text-white font-medium">
                    {formatDate(trackedOrder.estimatedDelivery)}
                  </span>
                </p>
                <p className="mt-1">
                  Payment:{" "}
                  <span className="text-white">
                    {trackedOrder.paymentMethod}
                  </span>{" "}
                  •{" "}
                  <span className="text-emerald-400">
                    {trackedOrder.paymentStatus}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {showTracker && !trackedOrder && (
          <div className="card p-8 text-center animate-fade-in-up mb-10">
            <Package className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-1">Order Not Found</h3>
            <p className="text-stone-400 text-sm">
              Please check your Order ID and try again
            </p>
          </div>
        )}

        {/* Recent Orders */}
        {mounted && isLoggedIn ? (
          <div className="animate-fade-in-up">
            <h2 className="text-xl font-serif font-bold text-white mb-6">
              Recent Orders
            </h2>
            {customerOrders.length > 0 ? (
              <div className="space-y-4">
                {customerOrders.map((order) => (
                  <div key={order.id} className="card p-4 flex items-center gap-4">
                    <div className="relative w-14 h-18 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={order.productImage}
                        alt={order.productName}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-amber-400 font-mono text-xs font-bold">
                        {order.orderId}
                      </p>
                      <h3 className="text-white text-sm font-medium truncate">
                        {order.productName}
                      </h3>
                      <p className="text-stone-500 text-xs">
                        {formatDate(order.createdAt)} •{" "}
                        {formatPrice(order.totalAmount)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
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
                      <button
                        onClick={() => {
                          setSearchId(order.orderId);
                          setTrackedOrder(order);
                          setShowTracker(true);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="text-indigo-400 text-xs hover:text-indigo-300"
                      >
                        Track →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card p-8 text-center text-stone-500">
                You haven't placed any orders yet.
              </div>
            )}
          </div>
        ) : (
          mounted && (
            <div className="card p-6 text-center animate-fade-in-up">
              <h3 className="text-white font-semibold mb-2">
                Want to see your full order history?
              </h3>
              <p className="text-stone-400 text-sm mb-4">
                Log in to view and track all your purchases in one place.
              </p>
              <Link href="/auth/login" className="btn-primary inline-block">
                Log In
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
}
