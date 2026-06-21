"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Database, Smartphone, Table, RefreshCw } from "lucide-react";
import { getAllOrders } from "@/actions/orders";
import { getAllWeavers } from "@/actions/weavers";
import { formatPrice } from "@/lib/utils";

export default function SheetsSimulatorPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [weavers, setWeavers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [activeTab, setActiveTab] = useState<"sheets" | "sms">("sheets");

  useEffect(() => {
    Promise.all([getAllOrders(), getAllWeavers()])
      .then(([o, w]) => { setOrders(o as any[]); setWeavers(w as any[]); setLoading(false); })
      .catch((e: any) => { setFetchError(e.message ?? "Failed to load data. Please refresh."); setLoading(false); });
  }, []);

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
              Live DB & Notification Hub
            </h1>
            <p className="text-stone-400 text-sm">Live view of orders, weavers, and notification status from the real database.</p>
          </div>
          <div className="flex bg-stone-900 rounded-lg p-1 border border-stone-800">
            <button onClick={() => setActiveTab("sheets")} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${activeTab === "sheets" ? "bg-stone-800 text-white" : "text-stone-400 hover:text-white"}`}>
              <Table className="w-4 h-4" /> Google Sheets DB
            </button>
            <button onClick={() => setActiveTab("sms")} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${activeTab === "sms" ? "bg-stone-800 text-white" : "text-stone-400 hover:text-white"}`}>
              <Smartphone className="w-4 h-4" /> SMS/WhatsApp Logs
            </button>
          </div>
        </div>

        {loading && <div className="text-stone-500 text-center py-12">Loading...</div>}
        {fetchError && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 mb-6">
            <p className="text-rose-400 text-sm">{fetchError}</p>
          </div>
        )}

        {!loading && activeTab === "sheets" && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="card overflow-hidden border-emerald-500/20">
              <div className="bg-emerald-900/20 border-b border-emerald-500/20 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Table className="w-5 h-5" />
                  <h2 className="font-semibold">Orders Sheet — {orders.length} records</h2>
                </div>
                <div className="flex items-center gap-2 text-stone-400 text-xs">
                  <RefreshCw className="w-3 h-3" />
                  Synced from Neon DB
                </div>
              </div>
              <div className="overflow-x-auto">
                {orders.length === 0 ? (
                  <p className="text-stone-500 text-sm text-center py-8">No orders yet.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left bg-stone-900/50 text-stone-400 border-b border-stone-800">
                        <th className="p-3 font-medium">Created At</th>
                        <th className="p-3 font-medium">Order ID</th>
                        <th className="p-3 font-medium">Customer</th>
                        <th className="p-3 font-medium">Items</th>
                        <th className="p-3 font-medium">Amount</th>
                        <th className="p-3 font-medium">Payment</th>
                        <th className="p-3 font-medium">Status</th>
                        <th className="p-3 font-medium">Sheets Row</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-stone-800/50 text-stone-300 font-mono text-xs hover:bg-stone-800/30">
                          <td className="p-3">{new Date(order.createdAt).toLocaleString("en-IN")}</td>
                          <td className="p-3 text-amber-400">{order.id.slice(0, 12).toUpperCase()}</td>
                          <td className="p-3">{order.customer?.name ?? "—"}</td>
                          <td className="p-3">{order.items?.length ?? 0} item(s)</td>
                          <td className="p-3">{formatPrice(Number(order.totalAmount))}</td>
                          <td className="p-3"><span className={order.paymentStatus === "PAID" ? "text-emerald-400" : "text-amber-400"}>{order.paymentStatus}</span></td>
                          <td className="p-3 text-indigo-400">{order.status}</td>
                          <td className="p-3 text-stone-500">{order.sheetsRowId ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="card overflow-hidden border-blue-500/20">
              <div className="bg-blue-900/20 border-b border-blue-500/20 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-400">
                  <Table className="w-5 h-5" />
                  <h2 className="font-semibold">Weavers Verification Sheet — {weavers.length} records</h2>
                </div>
                <div className="flex items-center gap-2 text-stone-400 text-xs">
                  <RefreshCw className="w-3 h-3" />
                  Synced from Neon DB
                </div>
              </div>
              <div className="overflow-x-auto">
                {weavers.length === 0 ? (
                  <p className="text-stone-500 text-sm text-center py-8">No weavers registered yet.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left bg-stone-900/50 text-stone-400 border-b border-stone-800">
                        <th className="p-3 font-medium">Weaver ID</th>
                        <th className="p-3 font-medium">Name</th>
                        <th className="p-3 font-medium">Email</th>
                        <th className="p-3 font-medium">Location</th>
                        <th className="p-3 font-medium">Cooperative</th>
                        <th className="p-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weavers.map((weaver) => (
                        <tr key={weaver.id} className="border-b border-stone-800/50 text-stone-300 font-mono text-xs hover:bg-stone-800/30">
                          <td className="p-3 text-amber-400">{weaver.weaverId}</td>
                          <td className="p-3">{weaver.user?.name ?? "—"}</td>
                          <td className="p-3">{weaver.user?.email ?? "—"}</td>
                          <td className="p-3">{weaver.location}</td>
                          <td className="p-3">{weaver.cooperativeMember ? "YES" : "NO"}</td>
                          <td className="p-3">
                            <span className={weaver.status === "VERIFIED" ? "text-emerald-400" : weaver.status === "REJECTED" ? "text-rose-400" : "text-amber-400"}>
                              {weaver.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {!loading && activeTab === "sms" && (
          <div className="card p-6 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <Smartphone className="w-5 h-5 text-indigo-400" />
              <div>
                <h2 className="text-xl font-bold text-white">Notification Hub</h2>
                <p className="text-stone-400 text-sm">SMS and WhatsApp notifications via MSG91</p>
              </div>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 text-center">
              <Smartphone className="w-12 h-12 text-stone-600 mx-auto mb-3 opacity-50" />
              <p className="text-stone-400 font-medium mb-1">Real SMS Integration Active</p>
              <p className="text-stone-500 text-sm max-w-md mx-auto">
                Notifications are sent directly via MSG91 when orders are placed or status changes. Configure your MSG91 API key in <span className="font-mono text-indigo-400">.env</span> to activate live SMS/WhatsApp delivery.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 max-w-sm mx-auto">
                <div className="bg-stone-800 rounded-lg p-3">
                  <p className="text-white font-bold text-lg">{orders.length}</p>
                  <p className="text-stone-500 text-xs">Notifications Triggered</p>
                </div>
                <div className="bg-stone-800 rounded-lg p-3">
                  <p className="text-white font-bold text-lg">{weavers.filter((w) => w.status === "VERIFIED").length}</p>
                  <p className="text-stone-500 text-xs">Weavers Subscribed</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
