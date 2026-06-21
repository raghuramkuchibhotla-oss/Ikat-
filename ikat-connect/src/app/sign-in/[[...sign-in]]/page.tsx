"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";
import { loginUser } from "@/actions/auth";

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await loginUser(form.email, form.password);
      router.refresh();
      if (result.role === "ADMIN") router.push("/admin");
      else if (result.role === "WEAVER") router.push("/weaver");
      else router.push("/");
    } catch (err: any) {
      setError(err.message ?? "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#0D0906" }} className="min-h-screen flex pt-16">

      {/* ── LEFT PANEL — brand/image ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col">
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&h=1200&fit=crop"
          alt="Pochampally Ikat fabric"
          fill
          priority
          className="object-cover"
          sizes="52vw"
        />
        {/* Dark overlay — stronger at bottom for legibility */}
        <div className="absolute inset-0 bg-linear-to-t from-[#0D0906] via-[#0D0906]/60 to-[#0D0906]/20" />

        {/* Content over image */}
        <div className="relative z-10 flex flex-col justify-end h-full p-12 pb-16">
          {/* Eyebrow */}
          <p
            style={{ color: "#C9883A", letterSpacing: "0.22em" }}
            className="text-[10px] font-bold uppercase mb-5"
          >
            Pochampally · Telangana
          </p>

          {/* Pull quote */}
          <blockquote
            style={{ color: "#F2E8D5", lineHeight: "1.2" }}
            className="font-serif text-3xl xl:text-4xl font-bold mb-6 max-w-sm"
          >
            "Every thread is a<br />conversation between<br />the weaver and<br />the cloth."
          </blockquote>

          <div style={{ borderTopColor: "#2B1F16" }} className="border-t pt-5 flex items-center gap-4">
            <div
              style={{ background: "#963D3D" }}
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            >
              <span style={{ color: "#F2E8D5" }} className="font-bold font-serif text-sm">IC</span>
            </div>
            <div>
              <p style={{ color: "#F2E8D5" }} className="text-sm font-semibold">IKAT CONNECT</p>
              <p style={{ color: "#5A4A3A" }} className="text-xs">Direct weaver-to-customer marketplace</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — form ──────────────────────────────────── */}
      <div
        style={{ background: "#0D0906" }}
        className="flex-1 flex items-center justify-center px-6 py-12"
      >
        <div className="w-full max-w-sm">

          {/* Logo — mobile only */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div
              style={{ background: "#963D3D" }}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
            >
              <span style={{ color: "#F2E8D5" }} className="font-bold font-serif text-sm">IC</span>
            </div>
            <span style={{ color: "#F2E8D5" }} className="font-bold font-serif text-lg">IKAT CONNECT</span>
          </div>

          {/* Heading */}
          <p
            style={{ color: "#C9883A", letterSpacing: "0.2em" }}
            className="text-[10px] font-bold uppercase mb-4"
          >
            Welcome back
          </p>
          <h1 style={{ color: "#F2E8D5" }} className="font-serif text-3xl font-bold mb-2">
            Sign in
          </h1>
          <p style={{ color: "#5A4A3A" }} className="text-sm mb-8">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" style={{ color: "#C9883A" }} className="font-medium hover:opacity-70 transition-opacity">
              Sign up
            </Link>
          </p>

          {/* Error */}
          {error && (
            <div
              style={{ background: "rgba(150,61,61,0.12)", borderColor: "rgba(150,61,61,0.35)" }}
              className="border rounded-xl px-4 py-3 mb-6"
            >
              <p style={{ color: "#C87070" }} className="text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label style={{ color: "#8A7A68" }} className="text-xs font-medium uppercase tracking-wider block mb-2">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
                autoComplete="email"
                style={{
                  background: "#1A1411",
                  border: "1px solid #2B1F16",
                  color: "#F2E8D5",
                  borderRadius: "0.75rem",
                  padding: "0.75rem 1rem",
                  width: "100%",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#C9883A")}
                onBlur={(e) => (e.target.style.borderColor = "#2B1F16")}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label style={{ color: "#8A7A68" }} className="text-xs font-medium uppercase tracking-wider">
                  Password
                </label>
              </div>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                style={{
                  background: "#1A1411",
                  border: "1px solid #2B1F16",
                  color: "#F2E8D5",
                  borderRadius: "0.75rem",
                  padding: "0.75rem 1rem",
                  width: "100%",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#C9883A")}
                onBlur={(e) => (e.target.style.borderColor = "#2B1F16")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? "#3D2E22" : "linear-gradient(135deg,#A86820,#C9883A)",
                color: loading ? "#8A7A68" : "#0D0906",
                borderRadius: "0.75rem",
                padding: "0.85rem 1.5rem",
                width: "100%",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: loading ? "not-allowed" : "pointer",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "opacity 0.2s",
                marginTop: "0.5rem",
              }}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ borderTopColor: "#2B1F16" }} className="border-t mt-8 pt-6">
            <p style={{ color: "#3D2E22" }} className="text-[11px] text-center uppercase tracking-widest">
              IKAT CONNECT · Pochampally Handloom
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
