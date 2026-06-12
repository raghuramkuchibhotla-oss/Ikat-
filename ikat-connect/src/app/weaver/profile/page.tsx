"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle, MapPin, Star, Award, Calendar } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useDataStore } from "@/lib/data-store";
import { formatDate } from "@/lib/utils";

export default function WeaverProfilePage() {
  const { user } = useAuthStore();
  const { weavers } = useDataStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dynamically find current weaver's profile
  const weaver = weavers.find((w) => w.userId === user?.id) || weavers[0];

  if (!mounted) {
    return (
      <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center">
        <div className="text-center text-stone-500">Loading Profile...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#0c0a09] min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/weaver" className="inline-flex items-center gap-2 text-stone-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <h1 className="text-2xl font-serif font-bold text-white mb-6">My Profile / నా ప్రొఫైల్</h1>

        {/* Profile Card */}
        <div className="card p-6 mb-6 animate-fade-in-up">
          <div className="flex items-start gap-6">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-amber-500 flex-shrink-0">
              <Image src={weaver.photo} alt={weaver.name} fill className="object-cover" sizes="96px" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-white">{weaver.name}</h2>
                {weaver.aadhaarVerified && (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                )}
              </div>
              <p className="text-stone-400 text-sm flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {weaver.location}, {weaver.district}, {weaver.state}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-amber-400 font-medium">{weaver.rating}</span>
                <span className="text-stone-500 text-sm">({weaver.totalOrders} orders)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 stagger-children">
          {[
            { label: "Weaver ID / నేతగాడి ID", value: weaver.weaverId },
            { label: "Phone / ఫోన్", value: weaver.phone },
            { label: "Specialization / ప్రత్యేకత", value: weaver.specialization },
            { label: "Experience / అనుభవం", value: `${weaver.experienceYears} years` },
            { label: "Cooperative / సహకార సంఘం", value: weaver.cooperativeMembership || "N/A" },
            { label: "Joined / చేరిన తేదీ", value: formatDate(weaver.joinedDate) },
            { label: "Aadhaar Verified / ఆధార్ ధృవీకృతం", value: weaver.aadhaarVerified ? "✅ Yes" : "❌ No" },
            { label: "Verification Status", value: weaver.verificationStatus },
          ].map((item) => (
            <div key={item.label} className="card p-4">
              <p className="text-stone-500 text-xs uppercase tracking-wider">{item.label}</p>
              <p className="text-white font-medium mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Bio */}
        <div className="card p-6 animate-fade-in-up">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">About / గురించి</h3>
          <p className="text-stone-300 leading-relaxed">{weaver.bio}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { label: "Products", value: weaver.totalProducts, icon: Award },
            { label: "Orders", value: weaver.totalOrders, icon: Calendar },
            { label: "Rating", value: weaver.rating, icon: Star },
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
