"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle, Clock, Truck, Package } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useDataStore } from "@/lib/data-store";
import { formatPrice, formatDate } from "@/lib/utils";
import type { OrderStatus } from "@/lib/data";

export default function WeaverOrdersPage() {
  const { user } = useAuthStore();
  const { weavers, orders: allOrders, updateOrderStatus, addNotificationLog } = useDataStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Dynamically find current weaver's profile
  const weaver = weavers.find((w) => w.userId === user?.id) || weavers[0];
  const weaverId = weaver.id;

  const orders = allOrders.filter((o) => o.weaverId === weaverId);

  const updateStatus = (orderId: string, newStatus: OrderStatus, order: any) => {
    updateOrderStatus(orderId, newStatus);
    
    // Trigger notification log
    addNotificationLog({
      type: "sms",
      recipient: order.customerName,
      message: `Your Ikat Connect order (${order.orderId}) status is now: ${newStatus.replace("-", " ")}`,
    });
    addNotificationLog({
      type: "whatsapp",
      recipient: order.customerName,
      message: `Hi ${order.customerName}, your order for ${order.productName} is now: ${newStatus.replace("-", " ")}. Thank you for supporting authentic Ikat!`,
    });
  };

  const statusOptions: { value: OrderStatus; label: string; labelTE: string }[] = [
    { value: "order-received", label: "Order Received", labelTE: "ఆర్డర్ అందింది" },
    { value: "yarn-purchased", label: "Yarn Purchased (Pre-order)", labelTE: "నూలు కొనుగోలు (ప్రీ-ఆర్డర్)" },
    { value: "weaving-started", label: "Weaving Started (Pre-order)", labelTE: "నేత ప్రారంభించబడింది (ప్రీ-ఆర్డర్)" },
    { value: "processing", label: "Processing", labelTE: "ప్రాసెసింగ్" },
    { value: "shipped", label: "Shipped", labelTE: "షిప్ చేయబడింది" },
    { value: "delivered", label: "Delivered", labelTE: "డెలివరీ అయింది" },
  ];

  return (
    <div className="bg-[#0c0a09] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/weaver" className="inline-flex items-center gap-2 text-stone-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <h1 className="text-2xl font-serif font-bold text-white mb-1">Orders / ఆర్డర్లు</h1>
        <p className="text-stone-400 text-sm mb-8">Manage and update your order statuses</p>

        <div className="space-y-4 stagger-children">
          {orders.map((order) => (
            <div key={order.id} className="card p-5">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="relative w-16 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={order.productImage} alt={order.productName} fill className="object-cover" sizes="64px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-amber-400 font-mono text-sm font-bold">{order.orderId}</p>
                  <h3 className="text-white font-medium truncate">
                    {order.productName}
                    {order.isPreOrder && (
                      <span className="ml-2 badge bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] py-0 px-1">
                        Pre-Order
                      </span>
                    )}
                  </h3>
                  <p className="text-stone-500 text-xs mt-1">
                    Customer: {order.customerName} • {order.customerPhone}
                  </p>
                  <p className="text-stone-500 text-xs">
                    {formatDate(order.createdAt)} • {order.isPreOrder ? `Advance: ${formatPrice(order.advancePaidAmount || 0)}` : formatPrice(order.totalAmount)} • Qty: {order.quantity}
                  </p>
                  <p className="text-stone-600 text-xs mt-1 truncate">📍 {order.customerAddress}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus, order)}
                    className={`input-field text-sm py-2 w-56 ${
                      order.status === "delivered" ? "border-emerald-500/50 text-emerald-400" :
                      order.status === "shipped" ? "border-blue-500/50 text-blue-400" :
                      (order.status === "processing" || order.status === "weaving-started") ? "border-amber-500/50 text-amber-400" :
                      "border-indigo-500/50 text-indigo-400"
                    }`}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} / {opt.labelTE}
                      </option>
                    ))}
                  </select>
                  <p className="text-stone-600 text-[10px] whitespace-nowrap">
                    📱 SMS/WhatsApp notification will be sent
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
