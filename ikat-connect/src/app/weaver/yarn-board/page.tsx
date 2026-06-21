"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Layers, TrendingDown, Users, Package, CheckCircle, Loader2 } from "lucide-react";
import { getMyYarnRequests, submitYarnRequest, getAllYarnRequests } from "@/actions/yarn";
import { getMyWeaverProfile } from "@/actions/weavers";

const YARN_TYPES = ["Silk", "Cotton", "Mercerized Cotton", "Polyester", "Wool"];

export default function WeaverYarnBoardPage() {
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [allRequests, setAllRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [weaverStatus, setWeaverStatus] = useState<string | null>(null);
  const [form, setForm] = useState({ yarnType: "Silk", quantityKg: "", notes: "" });

  useEffect(() => {
    Promise.all([getMyYarnRequests(), getAllYarnRequests(), getMyWeaverProfile()])
      .then(([my, all, profile]) => {
        setMyRequests(my as any[]);
        setAllRequests(all as any[]);
        setWeaverStatus((profile as any)?.status ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      await submitYarnRequest({ yarnType: form.yarnType, quantityKg: Number(form.quantityKg), notes: form.notes || undefined });
      const [my, all] = await Promise.all([getMyYarnRequests(), getAllYarnRequests()]);
      setMyRequests(my as any[]);
      setAllRequests(all as any[]);
      setForm({ yarnType: "Silk", quantityKg: "", notes: "" });
      setSubmitted(true);
      setShowForm(false);
    } catch (err: any) {
      setSubmitError(err.message ?? "Failed to submit yarn request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isVerified = weaverStatus === "VERIFIED";

  const pooledByType: Record<string, number> = allRequests
    .filter((r) => r.status === "OPEN" || r.status === "POOLED")
    .reduce((acc: Record<string, number>, r) => { acc[r.yarnType] = (acc[r.yarnType] || 0) + Number(r.quantityKg); return acc; }, {});

  const totalPooledKg: number = Object.values(pooledByType).reduce((a, b) => a + b, 0);

  if (loading) {
    return <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center"><div className="text-stone-500">Loading Yarn Board...</div></div>;
  }

  return (
    <div className="bg-[#0c0a09] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/weaver" className="inline-flex items-center gap-2 text-stone-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-white mb-1">Yarn Requirement Board / నూలు బోర్డు</h1>
            <p className="text-stone-400 text-sm">Pool yarn requests with other weavers for bulk pricing</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            disabled={!isVerified}
            title={!isVerified ? "Only verified weavers can submit yarn requests" : undefined}
            className="btn-accent flex items-center gap-2 text-sm mt-4 md:mt-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" /> Add Request / అభ్యర్థన జోడించు
          </button>
        </div>

        {!isVerified && weaverStatus !== null && (
          <div className="card p-4 mb-6 border-amber-500/30 bg-amber-500/5">
            <p className="text-amber-400 text-sm">Your weaver account is <strong>{weaverStatus}</strong>. Only verified weavers can submit yarn requests. Please wait for admin approval.</p>
          </div>
        )}

        {submitError && (
          <div className="card p-4 mb-6 border-rose-500/30 bg-rose-500/5">
            <p className="text-rose-400 text-sm">{submitError}</p>
          </div>
        )}

        {submitted && (
          <div className="card p-4 mb-6 border-emerald-500/30 animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <p className="text-emerald-400 text-sm font-medium">Yarn request submitted! It will be pooled with other weavers for bulk ordering.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
          <div className="card p-5"><Layers className="w-6 h-6 text-indigo-400 mb-2" /><p className="text-2xl font-bold text-white">{totalPooledKg.toFixed(1)} kg</p><p className="text-stone-500 text-sm">Total Pooled</p></div>
          <div className="card p-5"><Users className="w-6 h-6 text-amber-400 mb-2" /><p className="text-2xl font-bold text-white">{new Set(allRequests.map((r) => r.weaverId)).size}</p><p className="text-stone-500 text-sm">Weavers Contributing</p></div>
          <div className="card p-5"><TrendingDown className="w-6 h-6 text-emerald-400 mb-2" /><p className="text-2xl font-bold text-white">20-30%</p><p className="text-stone-500 text-sm">Cost Savings</p></div>
          <div className="card p-5"><Package className="w-6 h-6 text-rose-400 mb-2" /><p className="text-2xl font-bold text-white">{allRequests.filter((r) => r.status === "ORDERED").length}</p><p className="text-stone-500 text-sm">Bulk Orders Placed</p></div>
        </div>

        {showForm && (
          <div className="card p-6 mb-8 animate-fade-in-up">
            <h3 className="text-white font-semibold mb-4">New Yarn Request / కొత్త నూలు అభ్యర్థన</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-stone-400 text-sm block mb-1.5">Yarn Type / నూలు రకం *</label>
                <select value={form.yarnType} onChange={(e) => setForm({ ...form, yarnType: e.target.value })} className="input-field" required>
                  {YARN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-stone-400 text-sm block mb-1.5">Quantity (kg) / పరిమాణం *</label>
                <input type="number" min="0.1" step="0.1" placeholder="e.g. 5" value={form.quantityKg} onChange={(e) => setForm({ ...form, quantityKg: e.target.value })} className="input-field" required />
              </div>
              <div className="md:col-span-2">
                <label className="text-stone-400 text-sm block mb-1.5">Notes (Optional)</label>
                <input type="text" placeholder="Color preference, quality grade, etc." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field" />
              </div>
              <div className="md:col-span-2">
                <button type="submit" disabled={submitting} className="btn-accent flex items-center justify-center gap-2 w-full disabled:opacity-60">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        )}

        {Object.keys(pooledByType).length > 0 && (
          <div className="card p-6 mb-8 animate-fade-in-up">
            <h3 className="text-white font-semibold mb-4">Bulk Order Progress / బల్క్ ఆర్డర్ ప్రగతి</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="text-left text-stone-500 text-xs uppercase tracking-wider border-b border-stone-800"><th className="pb-3 pr-4">Yarn Type</th><th className="pb-3 pr-4">Pooled (kg)</th><th className="pb-3 pr-4">Min Order (kg)</th><th className="pb-3">Progress</th></tr></thead>
                <tbody>
                  {Object.entries(pooledByType).map(([type, qty]) => {
                    const minOrder = type.toLowerCase().includes("silk") ? 15 : 25;
                    const progress = Math.min((qty / minOrder) * 100, 100);
                    return (
                      <tr key={type} className="border-b border-stone-800/50">
                        <td className="py-3 pr-4 text-white text-sm">{type}</td>
                        <td className="py-3 pr-4 text-amber-400 font-bold text-sm">{qty.toFixed(1)} kg</td>
                        <td className="py-3 pr-4 text-stone-400 text-sm">{minOrder} kg</td>
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 rounded-full bg-stone-800 overflow-hidden">
                              <div className={`h-full rounded-full transition-all ${progress >= 100 ? "bg-emerald-500" : "bg-indigo-500"}`} style={{ width: `${progress}%` }} />
                            </div>
                            <span className="text-stone-400 text-xs w-10 text-right">{Math.round(progress)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {myRequests.length > 0 && (
          <div className="card p-6 mb-8 animate-fade-in-up">
            <h3 className="text-white font-semibold mb-4">My Requests / నా అభ్యర్థనలు</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="text-left text-stone-500 text-xs uppercase tracking-wider border-b border-stone-800"><th className="pb-3 pr-4">Yarn Type</th><th className="pb-3 pr-4">Qty (kg)</th><th className="pb-3 pr-4">Notes</th><th className="pb-3">Status</th></tr></thead>
                <tbody>
                  {myRequests.map((req) => (
                    <tr key={req.id} className="border-b border-stone-800/50">
                      <td className="py-3 pr-4 text-white text-sm">{req.yarnType}</td>
                      <td className="py-3 pr-4 text-amber-400 font-bold text-sm">{Number(req.quantityKg).toFixed(1)}</td>
                      <td className="py-3 pr-4 text-stone-500 text-sm">{req.notes ?? "—"}</td>
                      <td className="py-3">
                        <span className={`badge text-[10px] ${req.status === "DELIVERED" ? "badge-success" : req.status === "ORDERED" ? "badge-info" : req.status === "POOLED" ? "badge-primary" : "badge-warning"}`}>{req.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="card p-6 animate-fade-in-up">
          <h3 className="text-white font-semibold mb-4">All Requests / అన్ని అభ్యర్థనలు</h3>
          {allRequests.length === 0 ? (
            <p className="text-stone-500 text-sm text-center py-6">No yarn requests yet. Be the first to add one!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="text-left text-stone-500 text-xs uppercase tracking-wider border-b border-stone-800"><th className="pb-3 pr-4">Weaver</th><th className="pb-3 pr-4">Yarn Type</th><th className="pb-3 pr-4">Qty (kg)</th><th className="pb-3 pr-4">Notes</th><th className="pb-3">Status</th></tr></thead>
                <tbody>
                  {allRequests.map((req) => (
                    <tr key={req.id} className="border-b border-stone-800/50 hover:bg-stone-800/30">
                      <td className="py-3 pr-4 text-white text-sm">{req.weaver?.user?.name ?? "—"}</td>
                      <td className="py-3 pr-4 text-stone-400 text-sm">{req.yarnType}</td>
                      <td className="py-3 pr-4 text-amber-400 font-bold text-sm">{Number(req.quantityKg).toFixed(1)}</td>
                      <td className="py-3 pr-4 text-stone-500 text-sm">{req.notes ?? "—"}</td>
                      <td className="py-3">
                        <span className={`badge text-[10px] ${req.status === "DELIVERED" ? "badge-success" : req.status === "ORDERED" ? "badge-info" : req.status === "POOLED" ? "badge-primary" : "badge-warning"}`}>{req.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
