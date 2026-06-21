"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Layers, TrendingDown, Truck, Loader2 } from "lucide-react";
import { getAllYarnRequests, poolYarnRequests, updateYarnRequestStatus } from "@/actions/yarn";

export default function AdminYarnBoardPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  useEffect(() => {
    getAllYarnRequests().then((data) => { setRequests(data as any[]); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const refresh = () => getAllYarnRequests().then((data) => setRequests(data as any[])).catch(() => {});

  const handlePool = async (yarnType: string) => {
    setActing(`pool-${yarnType}`);
    try { await poolYarnRequests(yarnType); await refresh(); } catch (e) { console.error(e); } finally { setActing(null); }
  };

  const handleMarkOrdered = async (id: string) => {
    setActing(id);
    try { await updateYarnRequestStatus(id, "ORDERED"); await refresh(); } catch (e) { console.error(e); } finally { setActing(null); }
  };

  const activeRequests = requests.filter((r) => r.status === "OPEN" || r.status === "POOLED");
  const pooledByType: Record<string, { totalKg: number; count: number; requests: any[] }> = activeRequests.reduce(
    (acc: Record<string, { totalKg: number; count: number; requests: any[] }>, r) => {
      if (!acc[r.yarnType]) acc[r.yarnType] = { totalKg: 0, count: 0, requests: [] };
      acc[r.yarnType].totalKg += Number(r.quantityKg);
      acc[r.yarnType].count += 1;
      acc[r.yarnType].requests.push(r);
      return acc;
    }, {}
  );

  if (loading) return <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center"><div className="text-stone-500">Loading Yarn Board...</div></div>;

  return (
    <div className="bg-[#0c0a09] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-stone-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <h1 className="text-2xl font-serif font-bold text-white mb-1">Yarn Requirement Board (Admin)</h1>
        <p className="text-stone-400 text-sm mb-8">Manage bulk yarn orders and supplier negotiations</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card p-4 text-center"><Layers className="w-6 h-6 text-indigo-400 mx-auto mb-2" /><p className="text-2xl font-bold text-white">{Object.keys(pooledByType).length}</p><p className="text-stone-500 text-sm">Active Pools</p></div>
          <div className="card p-4 text-center"><TrendingDown className="w-6 h-6 text-emerald-400 mx-auto mb-2" /><p className="text-2xl font-bold text-white">20-30%</p><p className="text-stone-500 text-sm">Potential Savings</p></div>
          <div className="card p-4 text-center"><Truck className="w-6 h-6 text-rose-400 mx-auto mb-2" /><p className="text-2xl font-bold text-white">{requests.filter((r) => r.status === "ORDERED").length}</p><p className="text-stone-500 text-sm">Pending Deliveries</p></div>
        </div>

        <div className="animate-fade-in-up mb-8">
          <h2 className="text-white font-semibold mb-4">Active Pools — Pool & Place Orders</h2>
          {Object.keys(pooledByType).length === 0 ? (
            <div className="card p-8 text-center text-stone-500">No active yarn pools currently.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(pooledByType).map(([type, pool]) => {
                const minOrder = type.toLowerCase().includes("silk") ? 15 : 25;
                const isReady = pool.totalKg >= minOrder;
                const allPooled = pool.requests.every((r) => r.status === "POOLED");
                return (
                  <div key={type} className={`card p-5 ${isReady ? "border-emerald-500/30 bg-emerald-500/5" : ""}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-white font-semibold">{type}</h3>
                        <p className="text-stone-400 text-sm">{pool.count} weavers contributing</p>
                      </div>
                      {isReady && <span className="badge badge-success">Ready</span>}
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1"><span className="text-stone-400">Pooled:</span><span className="text-white font-bold">{pool.totalKg.toFixed(1)} kg</span></div>
                      <div className="flex justify-between text-sm mb-2"><span className="text-stone-400">Min Order:</span><span className="text-stone-500">{minOrder} kg</span></div>
                      <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${isReady ? "bg-emerald-500" : "bg-indigo-500"}`} style={{ width: `${minOrder > 0 ? Math.min((pool.totalKg / minOrder) * 100, 100) : 0}%` }} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!allPooled && (
                        <button onClick={() => handlePool(type)} disabled={acting === `pool-${type}`} className="flex-1 btn-outline text-sm flex items-center justify-center gap-1 disabled:opacity-60">
                          {acting === `pool-${type}` ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                          Pool Requests
                        </button>
                      )}
                      <button onClick={() => pool.requests.forEach((r) => handleMarkOrdered(r.id))} disabled={!isReady || acting !== null} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all ${isReady ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-stone-800 text-stone-500 cursor-not-allowed"} disabled:opacity-60`}>
                        <Truck className="w-4 h-4" />
                        Mark Ordered
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="card p-6 animate-fade-in-up">
          <h2 className="text-white font-semibold mb-4">All Yarn Requests</h2>
          {requests.length === 0 ? (
            <p className="text-stone-500 text-sm text-center py-6">No yarn requests yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="text-left text-stone-500 text-xs uppercase tracking-wider border-b border-stone-800"><th className="pb-3 pr-4">Weaver</th><th className="pb-3 pr-4">Type</th><th className="pb-3 pr-4">Qty (kg)</th><th className="pb-3 pr-4">Notes</th><th className="pb-3 pr-4">Date</th><th className="pb-3">Status</th></tr></thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id} className="border-b border-stone-800/50 hover:bg-stone-800/30">
                      <td className="py-3 pr-4 text-white text-sm">{req.weaver?.user?.name ?? "—"}</td>
                      <td className="py-3 pr-4 text-stone-400 text-sm">{req.yarnType}</td>
                      <td className="py-3 pr-4 text-amber-400 font-bold text-sm">{Number(req.quantityKg).toFixed(1)}</td>
                      <td className="py-3 pr-4 text-stone-500 text-sm">{req.notes ?? "—"}</td>
                      <td className="py-3 pr-4 text-stone-500 text-xs">{new Date(req.createdAt).toLocaleDateString("en-IN")}</td>
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
