"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, Check } from "lucide-react";
import { registerUser } from "@/actions/auth";

const inputStyle = {
  background: "#1A1411",
  border: "1px solid #2B1F16",
  color: "#F2E8D5",
  borderRadius: "0.75rem",
  padding: "0.75rem 1rem",
  width: "100%",
  fontSize: "0.95rem",
  outline: "none",
  transition: "border-color 0.2s",
};

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER" as "CUSTOMER" | "WEAVER",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await registerUser(form);
      router.refresh();
      if (result.role === "WEAVER") router.push("/weaver/profile");
      else router.push("/");
    } catch (err: any) {
      setError(err.message ?? "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#0D0906" }} className="min-h-screen flex pt-16">

      {/* ── LEFT PANEL — brand/image ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col">
        <Image
          src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900&h=1200&fit=crop"
          alt="Ikat pattern close-up"
          fill
          priority
          className="object-cover"
          sizes="52vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0D0906] via-[#0D0906]/55 to-[#0D0906]/15" />

        <div className="relative z-10 flex flex-col justify-end h-full p-12 pb-16">
          <p
            style={{ color: "#C9883A", letterSpacing: "0.22em" }}
            className="text-[10px] font-bold uppercase mb-5"
          >
            Pochampally · Telangana
          </p>

          <h2 style={{ color: "#F2E8D5", lineHeight: "1.15" }} className="font-serif text-3xl xl:text-4xl font-bold mb-4 max-w-xs">
            The loom has no middleman.
          </h2>
          <p style={{ color: "#6A5A4A" }} className="text-sm leading-relaxed mb-8 max-w-xs">
            IKAT CONNECT brings authentic Pochampally handloom directly from weaver workshops to your doorstep — GI tagged, zero markup.
          </p>

          <div className="space-y-2">
            {[
              "Verified weaver credentials",
              "Authentic GI-tagged products",
              "Fair price, direct to artisan",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div
                  style={{ background: "rgba(201,136,58,0.15)", borderColor: "rgba(201,136,58,0.3)" }}
                  className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0"
                >
                  <Check style={{ color: "#C9883A" }} className="w-3 h-3" strokeWidth={2.5} />
                </div>
                <span style={{ color: "#8A7A68" }} className="text-xs">{item}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTopColor: "#2B1F16" }} className="border-t mt-8 pt-5 flex items-center gap-4">
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
      <div style={{ background: "#0D0906" }} className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div style={{ background: "#963D3D" }} className="w-9 h-9 rounded-xl flex items-center justify-center">
              <span style={{ color: "#F2E8D5" }} className="font-bold font-serif text-sm">IC</span>
            </div>
            <span style={{ color: "#F2E8D5" }} className="font-bold font-serif text-lg">IKAT CONNECT</span>
          </div>

          <p style={{ color: "#C9883A", letterSpacing: "0.2em" }} className="text-[10px] font-bold uppercase mb-4">
            Create account
          </p>
          <h1 style={{ color: "#F2E8D5" }} className="font-serif text-3xl font-bold mb-2">
            Join the marketplace
          </h1>
          <p style={{ color: "#5A4A3A" }} className="text-sm mb-8">
            Already a member?{" "}
            <Link href="/sign-in" style={{ color: "#C9883A" }} className="font-medium hover:opacity-70 transition-opacity">
              Sign in
            </Link>
          </p>

          {error && (
            <div
              style={{ background: "rgba(150,61,61,0.12)", borderColor: "rgba(150,61,61,0.35)" }}
              className="border rounded-xl px-4 py-3 mb-6"
            >
              <p style={{ color: "#C87070" }} className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label style={{ color: "#8A7A68" }} className="text-xs font-medium uppercase tracking-wider block mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#C9883A")}
                onBlur={(e) => (e.target.style.borderColor = "#2B1F16")}
              />
            </div>

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
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#C9883A")}
                onBlur={(e) => (e.target.style.borderColor = "#2B1F16")}
              />
            </div>

            <div>
              <label style={{ color: "#8A7A68" }} className="text-xs font-medium uppercase tracking-wider block mb-2">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                autoComplete="new-password"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#C9883A")}
                onBlur={(e) => (e.target.style.borderColor = "#2B1F16")}
              />
            </div>

            {/* Role selector */}
            <div>
              <label style={{ color: "#8A7A68" }} className="text-xs font-medium uppercase tracking-wider block mb-3">
                I am registering as
              </label>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: "CUSTOMER", label: "Customer", sub: "Browse & buy" },
                  { value: "WEAVER", label: "Weaver", sub: "Sell products" },
                ] as const).map((opt) => {
                  const active = form.role === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm({ ...form, role: opt.value })}
                      style={{
                        background: active ? "rgba(201,136,58,0.1)" : "#1A1411",
                        border: `1px solid ${active ? "#C9883A" : "#2B1F16"}`,
                        borderRadius: "0.75rem",
                        padding: "0.85rem 1rem",
                        textAlign: "left",
                        transition: "all 0.2s",
                        cursor: "pointer",
                      }}
                    >
                      <p style={{ color: active ? "#C9883A" : "#F2E8D5" }} className="text-sm font-semibold">
                        {opt.label}
                      </p>
                      <p style={{ color: "#5A4A3A" }} className="text-xs mt-0.5">{opt.sub}</p>
                    </button>
                  );
                })}
              </div>
              {form.role === "WEAVER" && (
                <p style={{ color: "#5A4A3A", background: "rgba(201,136,58,0.06)", borderColor: "rgba(201,136,58,0.15)" }}
                  className="text-xs mt-3 border rounded-lg p-3 leading-relaxed">
                  After signing up, submit your Aadhaar and location for admin verification. You can list products once approved.
                </p>
              )}
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
                marginTop: "0.25rem",
              }}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</>
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

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
