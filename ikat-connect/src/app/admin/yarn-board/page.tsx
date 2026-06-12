"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Layers,
  CheckCircle,
  Truck,
  TrendingDown,
} from "lucide-react";
import { mockYarnRequests, type YarnType } from "@/lib/data";

export default function AdminYarnBoardPage() {
  const [requests, setRequests] = useState(mockYarnRequests);

  // Group by yarn type and color
  const pooled = requests.reduce(
    (acc, req) => {
      if (req.status !== "ordered" && req.status !== "delivered") {
        const key = `${req.yarnType}-${req.yarnColor}`;
        if (!acc[key]) {
          acc[key] = {
            type: req.yarnType,
            color: req.yarnColor,
            totalKg: 0,
            requests: [],
          };
        }
        acc[key].totalKg += req.quantityKg;
        acc[key].requests.push(req);
      }
      return acc;
    },
    {} as Record<
      string,
      { type: YarnType; color: string; totalKg: number; requests: typeof mockYarnRequests }
    >
  );

  const placeBulkOrder = (key: string) => {
    const pool = pooled[key];
    setRequests((prev) =>
      prev.map((r) =>
        pool.requests.find((pr) => pr.id === r.id)
          ? { ...r, status: "ordered" }
          : r
      )
    );
  };

  return (
    <div className="bg-[#0c0a09] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <h1 className="text-2xl font-serif font-bold text-white mb-1">
          Yarn Requirement Board (Admin)
        </h1>
        <p className="text-stone-400 text-sm mb-8">
          Manage bulk yarn orders and supplier negotiations
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card p-4 text-center">
            <Layers className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              {Object.keys(pooled).length}
            </p>
            <p className="text-stone-500 text-sm">Active Pools</p>
          </div>
          <div className="card p-4 text-center">
            <TrendingDown className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">28%</p>
            <p className="text-stone-500 text-sm">Avg Savings Achieved</p>
          </div>
          <div className="card p-4 text-center">
            <Truck className="w-6 h-6 text-rose-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              {requests.filter((r) => r.status === "ordered").length}
            </p>
            <p className="text-stone-500 text-sm">Pending Deliveries</p>
          </div>
        </div>

        {/* Actionable Pools */}
        <div className="animate-fade-in-up mb-8">
          <h2 className="text-white font-semibold mb-4">
            Ready for Bulk Ordering
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(pooled).map(([key, pool]) => {
              const minOrder = pool.type === "silk" ? 15 : 25;
              const isReady = pool.totalKg >= minOrder;

              return (
                <div
                  key={key}
                  className={`card p-5 ${
                    isReady ? "border-emerald-500/30 bg-emerald-500/5" : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white font-semibold capitalize">
                        {pool.type.replace("-", " ")}
                      </h3>
                      <p className="text-stone-400 text-sm">{pool.color}</p>
                    </div>
                    {isReady && (
                      <span className="badge badge-success">Ready</span>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-stone-400">Pooled:</span>
                      <span className="text-white font-bold">{pool.totalKg} kg</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-stone-400">Min Order:</span>
                      <span className="text-stone-500">{minOrder} kg</span>
                    </div>
                    <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isReady ? "bg-emerald-500" : "bg-indigo-500"
                        }`}
                        style={{
                          width: `${Math.min((pool.totalKg / minOrder) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <p className="text-stone-500 text-xs mb-4">
                    From {pool.requests.length} weavers
                  </p>

                  <button
                    onClick={() => placeBulkOrder(key)}
                    disabled={!isReady}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all ${
                      isReady
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                        : "bg-stone-800 text-stone-500 cursor-not-allowed"
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    Place Order with Supplier
                  </button>
                </div>
              );
            })}
          </div>
          {Object.keys(pooled).length === 0 && (
            <div className="card p-8 text-center text-stone-500">
              No active yarn pools currently.
            </div>
          )}
        </div>

        {/* All Requests Log */}
        <div className="card p-6 animate-fade-in-up">
          <h2 className="text-white font-semibold mb-4">All Yarn Requests</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-stone-500 text-xs uppercase tracking-wider border-b border-stone-800">
                  <th className="pb-3 pr-4">Weaver</th>
                  <th className="pb-3 pr-4">Type</th>
                  <th className="pb-3 pr-4">Color</th>
                  <th className="pb-3 pr-4">Qty</th>
                  <th className="pb-3 pr-4">Urgency</th>
                  <th className="pb-3 pr-4">Submitted</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr
                    key={req.id}
                    className="border-b border-stone-800/50 hover:bg-stone-800/30"
                  >
                    <td className="py-3 pr-4 text-white text-sm">
                      {req.weaverName}
                    </td>
                    <td className="py-3 pr-4 text-stone-400 text-sm capitalize">
                      {req.yarnType.replace("-", " ")}
                    </td>
                    <td className="py-3 pr-4 text-stone-400 text-sm">
                      {req.yarnColor}
                    </td>
                    <td className="py-3 pr-4 text-white text-sm font-bold">
                      {req.quantityKg} kg
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`badge text-[10px] ${
                          req.urgency === "high"
                            ? "badge-danger"
                            : req.urgency === "medium"
                              ? "badge-warning"
                              : "badge-info"
                        }`}
                      >
                        {req.urgency}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-stone-500 text-xs">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <span
                        className={`badge text-[10px] ${
                          req.status === "delivered"
                            ? "badge-success"
                            : req.status === "ordered"
                              ? "badge-info"
                              : req.status === "pooled"
                                ? "badge-primary"
                                : "badge-warning"
                        }`}
                      >
                        {req.status}
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
