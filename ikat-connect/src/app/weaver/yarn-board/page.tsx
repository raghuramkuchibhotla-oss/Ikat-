"use client";
import { useAuthStore } from "@/lib/auth-store";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Layers, TrendingDown, Users, Package, CheckCircle } from "lucide-react";
import { type YarnType } from "@/lib/data";
import { useDataStore } from "@/lib/data-store";

export default function WeaverYarnBoardPage() {
  const { user } = useAuthStore();
  const { weavers, yarnRequests, addYarnRequest } = useDataStore();
  const weaverProfile = weavers.find((w) => w.userId === user?.id);
  const weaverId = weaverProfile?.id || "w1";
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    yarnType: "silk" as YarnType,
    yarnColor: "",
    quantityKg: "",
    urgency: "medium" as "low" | "medium" | "high",
    notes: "",
  });

  
  const myRequests = yarnRequests.filter((r) => r.weaverId === weaverId);
  const allRequests = yarnRequests;

  // Calculate pooled totals
  const pooledByType = allRequests
    .filter((r) => r.status === "pooled" || r.status === "pending")
    .reduce(
      (acc, r) => {
        acc[r.yarnType] = (acc[r.yarnType] || 0) + r.quantityKg;
        return acc;
      },
      {} as Record<string, number>
    );

  const totalPooledKg = Object.values(pooledByType).reduce((a, b) => a + b, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRequest = {
      id: `yr${Date.now()}`,
      weaverId: weaverId,
      weaverName: weaverProfile?.name || "Unknown",
      yarnType: form.yarnType,
      yarnColor: form.yarnColor,
      quantityKg: Number(form.quantityKg),
      urgency: form.urgency,
      status: "pending" as const,
      createdAt: new Date().toISOString().split("T")[0],
      notes: form.notes,
    };
    addYarnRequest(newRequest);
    setSubmitted(true);
    setShowForm(false);
    setForm({
      yarnType: "silk" as YarnType,
      yarnColor: "",
      quantityKg: "",
      urgency: "medium" as "low" | "medium" | "high",
      notes: "",
    });
  };

  if (!mounted) {
    return (
      <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center">
        <div className="text-center text-stone-500">Loading Yarn Board...</div>
      </div>
    );
  }
  return (
    <div className="bg-[#0c0a09] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/weaver" className="inline-flex items-center gap-2 text-stone-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-white mb-1">
              Yarn Requirement Board / నూలు బోర్డు
            </h1>
            <p className="text-stone-400 text-sm">
              Pool yarn requests with other weavers for bulk pricing • धागा बोर्ड
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-accent flex items-center gap-2 text-sm mt-4 md:mt-0"
          >
            <Plus className="w-4 h-4" />
            Add Request / అభ్యర్థన జోడించు
          </button>
        </div>

        {submitted && (
          <div className="card p-4 mb-6 border-emerald-500/30 animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <p className="text-emerald-400 text-sm font-medium">
                Yarn request submitted! It will be pooled with other weavers for bulk ordering.
              </p>
            </div>
          </div>
        )}

        {/* Pooling Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
          <div className="card p-5">
            <Layers className="w-6 h-6 text-indigo-400 mb-2" />
            <p className="text-2xl font-bold text-white">{totalPooledKg} kg</p>
            <p className="text-stone-500 text-sm">Total Pooled</p>
          </div>
          <div className="card p-5">
            <Users className="w-6 h-6 text-amber-400 mb-2" />
            <p className="text-2xl font-bold text-white">
              {new Set(allRequests.map((r) => r.weaverId)).size}
            </p>
            <p className="text-stone-500 text-sm">Weavers Contributing</p>
          </div>
          <div className="card p-5">
            <TrendingDown className="w-6 h-6 text-emerald-400 mb-2" />
            <p className="text-2xl font-bold text-white">20-30%</p>
            <p className="text-stone-500 text-sm">Cost Savings</p>
          </div>
          <div className="card p-5">
            <Package className="w-6 h-6 text-rose-400 mb-2" />
            <p className="text-2xl font-bold text-white">
              {allRequests.filter((r) => r.status === "ordered").length}
            </p>
            <p className="text-stone-500 text-sm">Bulk Orders Placed</p>
          </div>
        </div>

        {/* Add Request Form */}
        {showForm && (
          <div className="card p-6 mb-8 animate-fade-in-up">
            <h3 className="text-white font-semibold mb-4">
              New Yarn Request / కొత్త నూలు అభ్యర్థన
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-stone-400 text-sm block mb-1.5">Yarn Type / నూలు రకం *</label>
                <select
                  value={form.yarnType}
                  onChange={(e) => setForm({ ...form, yarnType: e.target.value as YarnType })}
                  className="input-field"
                >
                  <option value="silk">Silk / సిల్క్</option>
                  <option value="cotton">Cotton / కాటన్</option>
                  <option value="mercerized-cotton">Mercerized Cotton</option>
                  <option value="polyester">Polyester</option>
                  <option value="wool">Wool / ఉన్ని</option>
                </select>
              </div>
              <div>
                <label className="text-stone-400 text-sm block mb-1.5">Color / రంగు *</label>
                <input
                  type="text"
                  value={form.yarnColor}
                  onChange={(e) => setForm({ ...form, yarnColor: e.target.value })}
                  placeholder="e.g. Indigo Blue"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="text-stone-400 text-sm block mb-1.5">Quantity (kg) / పరిమాణం *</label>
                <input
                  type="number"
                  value={form.quantityKg}
                  onChange={(e) => setForm({ ...form, quantityKg: e.target.value })}
                  placeholder="e.g. 5"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="text-stone-400 text-sm block mb-1.5">Urgency / తక్షణత</label>
                <select
                  value={form.urgency}
                  onChange={(e) => setForm({ ...form, urgency: e.target.value as "low" | "medium" | "high" })}
                  className="input-field"
                >
                  <option value="low">Low / తక్కువ</option>
                  <option value="medium">Medium / మధ్యస్తం</option>
                  <option value="high">High / ఎక్కువ</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-stone-400 text-sm block mb-1.5">Notes (Optional)</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any specific requirements..."
                  className="input-field"
                />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="btn-accent flex items-center justify-center gap-2 w-full">
                  <Plus className="w-4 h-4" />
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Pooled Summary Table */}
        <div className="card p-6 mb-8 animate-fade-in-up">
          <h3 className="text-white font-semibold mb-4">
            Bulk Order Progress / బల్క్ ఆర్డర్ ప్రగతి
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-stone-500 text-xs uppercase tracking-wider border-b border-stone-800">
                  <th className="pb-3 pr-4">Yarn Type</th>
                  <th className="pb-3 pr-4">Pooled (kg)</th>
                  <th className="pb-3 pr-4">Min Order (kg)</th>
                  <th className="pb-3">Progress</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(pooledByType).map(([type, qty]) => {
                  const minOrder = type === "silk" ? 15 : 25;
                  const progress = Math.min((qty / minOrder) * 100, 100);
                  return (
                    <tr key={type} className="border-b border-stone-800/50">
                      <td className="py-3 pr-4 text-white capitalize text-sm">{type.replace("-", " ")}</td>
                      <td className="py-3 pr-4 text-amber-400 font-bold text-sm">{qty} kg</td>
                      <td className="py-3 pr-4 text-stone-400 text-sm">{minOrder} kg</td>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 rounded-full bg-stone-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${progress >= 100 ? "bg-emerald-500" : "bg-indigo-500"}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-stone-400 text-xs w-10 text-right">
                            {Math.round(progress)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* All Yarn Requests Table */}
        <div className="card p-6 animate-fade-in-up">
          <h3 className="text-white font-semibold mb-4">
            All Requests / అన్ని అభ్యర్థనలు
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-stone-500 text-xs uppercase tracking-wider border-b border-stone-800">
                  <th className="pb-3 pr-4">Weaver</th>
                  <th className="pb-3 pr-4">Yarn Type</th>
                  <th className="pb-3 pr-4">Color</th>
                  <th className="pb-3 pr-4">Qty (kg)</th>
                  <th className="pb-3 pr-4">Urgency</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {allRequests.map((req) => (
                  <tr key={req.id} className="border-b border-stone-800/50 hover:bg-stone-800/30">
                    <td className="py-3 pr-4 text-white text-sm">{req.weaverName}</td>
                    <td className="py-3 pr-4 text-stone-400 text-sm capitalize">{req.yarnType.replace("-", " ")}</td>
                    <td className="py-3 pr-4 text-stone-400 text-sm">{req.yarnColor}</td>
                    <td className="py-3 pr-4 text-amber-400 font-bold text-sm">{req.quantityKg}</td>
                    <td className="py-3 pr-4">
                      <span className={`badge text-[10px] ${
                        req.urgency === "high" ? "badge-danger" :
                        req.urgency === "medium" ? "badge-warning" :
                        "badge-info"
                      }`}>
                        {req.urgency}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`badge text-[10px] ${
                        req.status === "delivered" ? "badge-success" :
                        req.status === "ordered" ? "badge-info" :
                        req.status === "pooled" ? "badge-primary" :
                        "badge-warning"
                      }`}>
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
