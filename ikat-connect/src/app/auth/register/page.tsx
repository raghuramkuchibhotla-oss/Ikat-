"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const router = useRouter();
  const { loginWithPhone } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithPhone(form.phone);
    router.push("/");
  };

  return (
    <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif font-bold text-white mb-2">
            Create Account
          </h1>
          <p className="text-stone-400 text-sm">
            Join IKAT CONNECT to buy authentic Pochampally Ikat
          </p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-stone-400 text-sm block mb-1.5">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
                className="input-field"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-stone-400 text-sm block mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@email.com"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="text-stone-400 text-sm block mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765..."
                  className="input-field"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-stone-400 text-sm block mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Create a password"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="text-stone-400 text-sm block mb-1.5">Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Street address"
                className="input-field"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-stone-400 text-sm block mb-1.5">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="City"
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-stone-400 text-sm block mb-1.5">State</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  placeholder="State"
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-stone-400 text-sm block mb-1.5">PIN</label>
                <input
                  type="text"
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  placeholder="500001"
                  className="input-field"
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              Create Account <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-stone-500 text-sm mt-4">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
