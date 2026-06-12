"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Database, Smartphone, Table, RefreshCw, Trash2 } from "lucide-react";
import { useDataStore } from "@/lib/data-store";
import { formatPrice } from "@/lib/utils";

export default function SheetsSimulatorPage() {
  const { orders, weavers, notificationLogs, clearNotificationLogs } = useDataStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"sheets" | "sms">("sheets");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-[#0c0a09] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-stone-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-white mb-1 flex items-center gap-2">
              <Database className="w-6 h-6 text-blue-400" />
              Live DB & SMS Simulator
            </h1>
            <p className="text-stone-400 text-sm">
              View the simulated Google Sheets data and real-time SMS/WhatsApp logs.
            </p>
          </div>
          <div className="flex bg-stone-900 rounded-lg p-1 border border-stone-800">
            <button
              onClick={() => setActiveTab("sheets")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${
                activeTab === "sheets" ? "bg-stone-800 text-white" : "text-stone-400 hover:text-white"
              }`}
            >
              <Table className="w-4 h-4" />
              Google Sheets DB
            </button>
            <button
              onClick={() => setActiveTab("sms")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${
                activeTab === "sms" ? "bg-stone-800 text-white" : "text-stone-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              SMS/WhatsApp Logs
            </button>
          </div>
        </div>

        {activeTab === "sheets" && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="card overflow-hidden border-emerald-500/20">
              <div className="bg-emerald-900/20 border-b border-emerald-500/20 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Table className="w-5 h-5" />
                  <h2 className="font-semibold">Orders Sheet (Auto-sync)</h2>
                </div>
                <div className="flex items-center gap-2 text-stone-400 text-xs">
                  <RefreshCw className="w-3 h-3 animate-spin-slow" />
                  Live Sync Active
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left bg-stone-900/50 text-stone-400 border-b border-stone-800">
                      <th className="p-3 font-medium">Timestamp</th>
                      <th className="p-3 font-medium">Order ID</th>
                      <th className="p-3 font-medium">Customer Name</th>
                      <th className="p-3 font-medium">Customer Phone</th>
                      <th className="p-3 font-medium">Product ID</th>
                      <th className="p-3 font-medium">Weaver ID</th>
                      <th className="p-3 font-medium">Amount</th>
                      <th className="p-3 font-medium">Is Pre-Order</th>
                      <th className="p-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-stone-800/50 text-stone-300 font-mono text-xs hover:bg-stone-800/30">
                        <td className="p-3">{order.createdAt}</td>
                        <td className="p-3 text-amber-400">{order.orderId}</td>
                        <td className="p-3">{order.customerName}</td>
                        <td className="p-3">{order.customerPhone}</td>
                        <td className="p-3">{order.productId}</td>
                        <td className="p-3">{order.weaverId}</td>
                        <td className="p-3">{formatPrice(order.totalAmount)}</td>
                        <td className="p-3">{order.isPreOrder ? "TRUE" : "FALSE"}</td>
                        <td className="p-3 text-indigo-400">{order.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card overflow-hidden border-blue-500/20">
              <div className="bg-blue-900/20 border-b border-blue-500/20 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-400">
                  <Table className="w-5 h-5" />
                  <h2 className="font-semibold">Weavers Verification Sheet</h2>
                </div>
                <div className="flex items-center gap-2 text-stone-400 text-xs">
                  <RefreshCw className="w-3 h-3 animate-spin-slow" />
                  Live Sync Active
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left bg-stone-900/50 text-stone-400 border-b border-stone-800">
                      <th className="p-3 font-medium">Weaver ID</th>
                      <th className="p-3 font-medium">Name</th>
                      <th className="p-3 font-medium">Phone</th>
                      <th className="p-3 font-medium">District</th>
                      <th className="p-3 font-medium">Verification Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weavers.map((weaver) => (
                      <tr key={weaver.id} className="border-b border-stone-800/50 text-stone-300 font-mono text-xs hover:bg-stone-800/30">
                        <td className="p-3 text-amber-400">{weaver.weaverId}</td>
                        <td className="p-3">{weaver.name}</td>
                        <td className="p-3">{weaver.phone}</td>
                        <td className="p-3">{weaver.district}</td>
                        <td className="p-3">
                          <span className={`${
                            weaver.verificationStatus === "verified" ? "text-emerald-400" :
                            weaver.verificationStatus === "rejected" ? "text-rose-400" :
                            "text-amber-400"
                          }`}>
                            {weaver.verificationStatus.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "sms" && (
          <div className="card p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-indigo-400" />
                  Notification Hub Log
                </h2>
                <p className="text-stone-400 text-sm">Real-time simulator of SMS and WhatsApp messages sent by the system.</p>
              </div>
              {notificationLogs.length > 0 && (
                <button
                  onClick={clearNotificationLogs}
                  className="btn-outline flex items-center gap-2 text-rose-400 hover:text-rose-300 hover:border-rose-400/50"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Logs
                </button>
              )}
            </div>

            {notificationLogs.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-stone-800 rounded-xl">
                <Smartphone className="w-12 h-12 text-stone-600 mx-auto mb-3 opacity-50" />
                <p className="text-stone-500">No notifications sent yet.</p>
                <p className="text-stone-600 text-xs mt-1">Place an order or update an order status to trigger notifications.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notificationLogs.map((log) => (
                  <div key={log.id} className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      log.type === "whatsapp" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"
                    }`}>
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold uppercase ${
                            log.type === "whatsapp" ? "text-emerald-400" : "text-blue-400"
                          }`}>
                            {log.type}
                          </span>
                          <span className="text-stone-500 text-xs">•</span>
                          <span className="text-white text-sm font-medium">To: {log.recipient}</span>
                        </div>
                        <span className="text-stone-500 text-xs">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="bg-black/30 p-3 rounded-lg border border-stone-800 mt-2">
                        <p className="text-stone-300 text-sm whitespace-pre-wrap font-mono">
                          {log.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
