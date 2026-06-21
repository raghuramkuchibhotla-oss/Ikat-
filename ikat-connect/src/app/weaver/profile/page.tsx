"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, MapPin, Award, Calendar, Loader2 } from "lucide-react";
import { getMyWeaverProfile, registerWeaver } from "@/actions/weavers";

export default function WeaverProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ aadhaarNumber: "", location: "", bio: "", cooperativeMember: false });

  useEffect(() => {
    getMyWeaverProfile().then((data) => { setProfile(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleRegister = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await registerWeaver(form);
      const updated = await getMyWeaverProfile();
      setProfile(updated);
    } catch (err: any) {
      setError(err.message ?? "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center"><div className="text-stone-500">Loading Profile...</div></div>;
  }

  if (!profile) {
    return (
      <div className="bg-[#0c0a09] min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/weaver" className="inline-flex items-center gap-2 text-stone-400 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <h1 className="text-2xl font-serif font-bold text-white mb-1">Register as Weaver</h1>
          <p className="text-stone-400 text-sm mb-6">నేతగాడిగా నమోదు చేయండి — Admin will verify your details</p>

          {error && <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 mb-4"><p className="text-rose-400 text-sm">{error}</p></div>}

          <form onSubmit={handleRegister} className="card p-6 space-y-5">
            <div>
              <label className="text-stone-400 text-sm block mb-1.5">Aadhaar Number *</label>
              <input type="text" value={form.aadhaarNumber} onChange={(e) => setForm({ ...form, aadhaarNumber: e.target.value })} placeholder="12-digit Aadhaar number" className="input-field" required maxLength={12} />
            </div>
            <div>
              <label className="text-stone-400 text-sm block mb-1.5">Village / Location *</label>
              <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Pochampally, Nalgonda" className="input-field" required />
            </div>
            <div>
              <label className="text-stone-400 text-sm block mb-1.5">About You / Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Years of experience, specialization, family tradition..." className="input-field min-h-[80px]" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="coop" checked={form.cooperativeMember} onChange={(e) => setForm({ ...form, cooperativeMember: e.target.checked })} className="w-4 h-4 rounded border-stone-700" />
              <label htmlFor="coop" className="text-stone-300 text-sm">Member of a Weaver Cooperative Society</label>
            </div>
            <button type="submit" disabled={submitting} className="btn-accent w-full flex items-center justify-center gap-2 disabled:opacity-60">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {submitting ? "Submitting..." : "Submit for Verification"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const statusColor = profile.status === "VERIFIED" ? "text-emerald-400" : profile.status === "REJECTED" ? "text-rose-400" : "text-amber-400";

  return (
    <div className="bg-[#0c0a09] min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/weaver" className="inline-flex items-center gap-2 text-stone-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-serif font-bold text-white mb-6">My Profile / నా ప్రొఫైల్</h1>

        <div className="card p-6 mb-6 animate-fade-in-up">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-indigo-500/20 ring-2 ring-amber-500 shrink-0 flex items-center justify-center">
              <span className="text-amber-400 text-3xl font-bold">{profile.user?.name?.[0] ?? "W"}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-white">{profile.user?.name ?? "Weaver"}</h2>
                {profile.status === "VERIFIED" && <CheckCircle className="w-5 h-5 text-emerald-400" />}
              </div>
              <p className="text-stone-400 text-sm flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />{profile.location}
              </p>
              <p className={`text-sm mt-2 font-medium ${statusColor}`}>Status: {profile.status}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 stagger-children">
          {[
            { label: "Weaver ID / నేతగాడి ID", value: profile.weaverId },
            { label: "Email", value: profile.user?.email ?? "—" },
            { label: "Cooperative Member", value: profile.cooperativeMember ? "✅ Yes" : "❌ No" },
            { label: "Joined", value: new Date(profile.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
            { label: "Verification Status", value: profile.status },
            { label: "Products Listed", value: profile.products?.length ?? 0 },
          ].map((item) => (
            <div key={item.label} className="card p-4">
              <p className="text-stone-500 text-xs uppercase tracking-wider">{item.label}</p>
              <p className="text-white font-medium mt-1">{String(item.value)}</p>
            </div>
          ))}
        </div>

        {profile.bio && (
          <div className="card p-6 animate-fade-in-up">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">About / గురించి</h3>
            <p className="text-stone-300 leading-relaxed">{profile.bio}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { label: "Products", value: profile.products?.length ?? 0, icon: Award },
            { label: "Aadhaar", value: `${profile.aadhaarNumber.slice(0, 4)}****`, icon: CheckCircle },
            { label: "Joined", value: new Date(profile.createdAt).getFullYear(), icon: Calendar },
          ].map((stat) => (
            <div key={stat.label} className="card p-4 text-center">
              <stat.icon className="w-5 h-5 text-amber-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-stone-500 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
