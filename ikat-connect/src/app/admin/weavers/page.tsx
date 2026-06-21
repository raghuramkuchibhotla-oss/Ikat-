"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, Clock, Shield, MapPin, Loader2 } from "lucide-react";
import { getPendingWeavers, getAllWeavers, verifyWeaver } from "@/actions/weavers";

export default function AdminWeaversPage() {
  const [pending, setPending] = useState<any[]>([]);
  const [verified, setVerified] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getPendingWeavers(), getAllWeavers()])
      .then(([p, all]) => {
        setPending(p as any[]);
        setVerified((all as any[]).filter((w) => w.status === "VERIFIED"));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAction = async (weaverId: string, action: "VERIFIED" | "REJECTED") => {
    setActing(weaverId);
    try {
      await verifyWeaver(weaverId, action);
      setPending((prev) => prev.filter((w) => w.id !== weaverId));
      if (action === "VERIFIED") {
        const updated = await getAllWeavers();
        setVerified((updated as any[]).filter((w) => w.status === "VERIFIED"));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActing(null);
    }
  };

  if (loading) {
    return <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center"><div className="text-stone-500">Loading...</div></div>;
  }

  return (
    <div className="bg-[#0c0a09] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-stone-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <h1 className="text-2xl font-serif font-bold text-white mb-1">Manage Weavers</h1>
        <p className="text-stone-400 text-sm mb-8">Verify weaver credentials and manage access</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card p-4 text-center"><p className="text-2xl font-bold text-amber-400">{pending.length}</p><p className="text-stone-500 text-sm">Pending</p></div>
          <div className="card p-4 text-center"><p className="text-2xl font-bold text-emerald-400">{verified.length}</p><p className="text-stone-500 text-sm">Verified</p></div>
          <div className="card p-4 text-center"><p className="text-2xl font-bold text-indigo-400">{pending.length + verified.length}</p><p className="text-stone-500 text-sm">Total</p></div>
        </div>

        {pending.length > 0 && (
          <div className="mb-8 animate-fade-in-up">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Pending Verification ({pending.length})
            </h2>
            <div className="space-y-4">
              {pending.map((weaver) => (
                <div key={weaver.id} className="card p-5 border-amber-500/20">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-indigo-500/20 ring-2 ring-amber-500 shrink-0 flex items-center justify-center">
                      <span className="text-amber-400 text-2xl font-bold">{weaver.user?.name?.[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold">{weaver.user?.name}</h3>
                      <p className="text-stone-400 text-xs flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />{weaver.location}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                        <div><p className="text-stone-500 text-xs">Weaver ID</p><p className="text-white text-sm font-mono">{weaver.weaverId}</p></div>
                        <div><p className="text-stone-500 text-xs">Aadhaar</p><p className="text-white text-sm">{weaver.aadhaarNumber.slice(0, 4)}****</p></div>
                        <div><p className="text-stone-500 text-xs">Cooperative</p><p className="text-white text-sm">{weaver.cooperativeMember ? "✅ Yes" : "❌ No"}</p></div>
                        <div><p className="text-stone-500 text-xs">Email</p><p className="text-white text-sm truncate">{weaver.user?.email ?? "—"}</p></div>
                      </div>
                      {weaver.bio && <p className="text-stone-500 text-xs mt-2 line-clamp-2">{weaver.bio}</p>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {acting === weaver.id ? (
                        <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
                      ) : (
                        <>
                          <button onClick={() => handleAction(weaver.id, "VERIFIED")} className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors" title="Approve">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleAction(weaver.id, "REJECTED")} className="p-2 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors" title="Reject">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="animate-fade-in-up">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Verified Weavers ({verified.length})
          </h2>
          {verified.length === 0 ? (
            <div className="card p-8 text-center text-stone-500">No verified weavers yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-stone-500 text-xs uppercase tracking-wider border-b border-stone-800">
                    <th className="pb-3 pr-4">Weaver</th>
                    <th className="pb-3 pr-4">ID</th>
                    <th className="pb-3 pr-4">Location</th>
                    <th className="pb-3 pr-4">Products</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {verified.map((weaver) => (
                    <tr key={weaver.id} className="border-b border-stone-800/50 hover:bg-stone-800/30">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                            <span className="text-indigo-400 text-sm font-bold">{weaver.user?.name?.[0]}</span>
                          </div>
                          <div>
                            <p className="text-white text-sm">{weaver.user?.name ?? "—"}</p>
                            <p className="text-stone-500 text-xs">{weaver.user?.email ?? "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-stone-400 text-sm font-mono">{weaver.weaverId}</td>
                      <td className="py-3 pr-4 text-stone-400 text-sm">{weaver.location}</td>
                      <td className="py-3 pr-4 text-white text-sm">{weaver.products?.length ?? 0}</td>
                      <td className="py-3">
                        <span className="badge badge-success text-[10px]">
                          <Shield className="w-3 h-3 mr-1" />Verified
                        </span>
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
