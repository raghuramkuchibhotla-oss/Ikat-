"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Phone, Eye, EyeOff, ArrowRight, Shield } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import type { UserRole } from "@/lib/data";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login, loginWithPhone, loginAsDemo } = useAuthStore();

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = login(email, password);
    if (success) {
      router.push("/");
    } else {
      setError("Invalid credentials. Try demo login below.");
    }
  };

  const handlePhoneLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      setOtpSent(true);
      return;
    }
    if (otp === "1234" || otp.length === 4) {
      loginWithPhone(phone);
      router.push("/");
    } else {
      setError("Invalid OTP. Use any 4-digit code for demo.");
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    loginAsDemo(role);
    if (role === "admin") router.push("/admin");
    else if (role === "weaver") router.push("/weaver");
    else router.push("/");
  };

  return (
    <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">IC</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white mb-2">
            Welcome to IKAT CONNECT
          </h1>
          <p className="text-stone-400 text-sm">
            Login to buy authentic Pochampally Ikat products
          </p>
        </div>

        {/* Login Card */}
        <div className="card p-6">
          {/* Tab Switcher */}
          <div className="flex bg-stone-800 rounded-xl p-1 mb-6">
            {(["email", "phone"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setError("");
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                {tab === "email" ? (
                  <Mail className="w-4 h-4" />
                ) : (
                  <Phone className="w-4 h-4" />
                )}
                {tab === "email" ? "Email" : "Phone OTP"}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3 mb-4">
              <p className="text-rose-400 text-sm">{error}</p>
            </div>
          )}

          {/* Email Login */}
          {activeTab === "email" && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="text-stone-400 text-sm block mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="text-stone-400 text-sm block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="input-field pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                Login <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Phone OTP Login */}
          {activeTab === "phone" && (
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              <div>
                <label className="text-stone-400 text-sm block mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="input-field"
                  required
                  disabled={otpSent}
                />
              </div>
              {otpSent && (
                <div className="animate-fade-in">
                  <label className="text-stone-400 text-sm block mb-1.5">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 4-digit OTP"
                    className="input-field text-center text-xl tracking-widest"
                    maxLength={4}
                    required
                  />
                  <p className="text-stone-500 text-xs mt-2">
                    Demo: Enter any 4-digit code
                  </p>
                </div>
              )}
              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {otpSent ? "Verify OTP" : "Send OTP"}{" "}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Register Link */}
          <p className="text-center text-stone-400 text-sm mt-6">
            New customer?{" "}
            <Link
              href="/auth/register"
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Register here
            </Link>
          </p>
        </div>

        {/* Demo Quick Access */}
        <div className="card p-6 mt-4">
          <h3 className="text-white text-sm font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            Quick Demo Access
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { role: "customer" as UserRole, label: "Customer", color: "bg-indigo-600 hover:bg-indigo-500" },
              { role: "weaver" as UserRole, label: "Weaver", color: "bg-amber-600 hover:bg-amber-500" },
              { role: "admin" as UserRole, label: "Admin", color: "bg-emerald-600 hover:bg-emerald-500" },
            ].map((demo) => (
              <button
                key={demo.role}
                onClick={() => handleDemoLogin(demo.role)}
                className={`${demo.color} text-white text-sm font-medium py-2.5 rounded-xl transition-all hover:scale-105`}
              >
                {demo.label}
              </button>
            ))}
          </div>
        </div>

        {/* Weaver Login Link */}
        <p className="text-center text-stone-500 text-sm mt-6">
          Weaver?{" "}
          <Link
            href="/weaver/auth"
            className="text-amber-400 hover:text-amber-300 font-medium"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
