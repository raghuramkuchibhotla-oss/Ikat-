"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  MapPin,
  Star,
} from "lucide-react";
import { type VerificationStatus } from "@/lib/data";
import { useDataStore } from "@/lib/data-store";

export default function AdminWeaversPage() {
  const { weavers, updateWeaverStatus } = useDataStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const pending = weavers.filter((w) => w.verificationStatus === "pending");
  const verified = weavers.filter((w) => w.verificationStatus === "verified");
  const rejected = weavers.filter((w) => w.verificationStatus === "rejected");

  return (
    <div className="bg-[#0c0a09] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-stone-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <h1 className="text-2xl font-serif font-bold text-white mb-1">Manage Weavers</h1>
        <p className="text-stone-400 text-sm mb-8">Verify weaver credentials and manage access</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{pending.length}</p>
            <p className="text-stone-500 text-sm">Pending</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{verified.length}</p>
            <p className="text-stone-500 text-sm">Verified</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-rose-400">{rejected.length}</p>
            <p className="text-stone-500 text-sm">Rejected</p>
          </div>
        </div>

        {/* Pending Verification */}
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
                    <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-amber-500 flex-shrink-0">
                      <Image src={weaver.photo} alt={weaver.name} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold">{weaver.name}</h3>
                      <p className="text-stone-400 text-xs flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {weaver.location}, {weaver.district}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                        <div>
                          <p className="text-stone-500 text-xs">Weaver ID</p>
                          <p className="text-white text-sm font-mono">{weaver.weaverId}</p>
                        </div>
                        <div>
                          <p className="text-stone-500 text-xs">Aadhaar</p>
                          <p className="text-white text-sm">{weaver.aadhaarVerified ? "✅ Verified" : "❌ Not verified"}</p>
                        </div>
                        <div>
                          <p className="text-stone-500 text-xs">Cooperative</p>
                          <p className="text-white text-sm">{weaver.cooperativeMembership || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-stone-500 text-xs">Experience</p>
                          <p className="text-white text-sm">{weaver.experienceYears} years</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => updateWeaverStatus(weaver.id, "verified")}
                        className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                        title="Approve"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => updateWeaverStatus(weaver.id, "rejected")}
                        className="p-2 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors"
                        title="Reject"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verified Weavers */}
        <div className="animate-fade-in-up">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Verified Weavers ({verified.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-stone-500 text-xs uppercase tracking-wider border-b border-stone-800">
                  <th className="pb-3 pr-4">Weaver</th>
                  <th className="pb-3 pr-4">ID</th>
                  <th className="pb-3 pr-4">Location</th>
                  <th className="pb-3 pr-4">Products</th>
                  <th className="pb-3 pr-4">Orders</th>
                  <th className="pb-3 pr-4">Rating</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {verified.map((weaver) => (
                  <tr key={weaver.id} className="border-b border-stone-800/50 hover:bg-stone-800/30">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                          <Image src={weaver.photo} alt={weaver.name} fill className="object-cover" sizes="32px" />
                        </div>
                        <span className="text-white text-sm">{weaver.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-stone-400 text-sm font-mono">{weaver.weaverId}</td>
                    <td className="py-3 pr-4 text-stone-400 text-sm">{weaver.location}</td>
                    <td className="py-3 pr-4 text-white text-sm">{weaver.totalProducts}</td>
                    <td className="py-3 pr-4 text-white text-sm">{weaver.totalOrders}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-amber-400 text-sm">{weaver.rating}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="badge badge-success text-[10px]">Verified</span>
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
