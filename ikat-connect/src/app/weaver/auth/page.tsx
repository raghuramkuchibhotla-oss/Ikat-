"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, ArrowRight, Shield, AlertTriangle } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

export default function WeaverAuthPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { loginAsDemo } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      setOtpSent(true);
      return;
    }
    if (otp.length === 4) {
      loginAsDemo("weaver");
      router.push("/weaver");
    } else {
      setError("Enter a valid 4-digit OTP");
    }
  };

  return (
    <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 flex items-center justify-center mb-4">
            <Shield className="w-7 h-7 text-amber-400" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white mb-1">
            Weaver Login
          </h1>
          <p className="text-lg text-stone-400">నేతగాడి లాగిన్ • बुनकर लॉगिन</p>
          <p className="text-stone-500 text-sm mt-2">
            Only verified weavers can access the dashboard
          </p>
        </div>

        {/* Warning */}
        <div className="card p-4 mb-4 border-amber-500/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-400 text-sm font-medium">
                Verification Required
              </p>
              <p className="text-stone-400 text-xs mt-1">
                Admin verifies your Aadhaar, Weaver ID, and Cooperative
                Membership before you can register. Contact admin if you are a
                new weaver.
              </p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="card p-6">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3 mb-4">
              <p className="text-rose-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-stone-400 text-sm block mb-1.5">
                Phone Number / ఫోన్ నంబర్
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="input-field pl-11"
                  required
                  disabled={otpSent}
                />
              </div>
            </div>
            {otpSent && (
              <div className="animate-fade-in">
                <label className="text-stone-400 text-sm block mb-1.5">
                  OTP / ఓటీపీ
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
                <p className="text-stone-600 text-xs mt-2">
                  Demo: Enter any 4-digit code
                </p>
              </div>
            )}
            <button
              type="submit"
              className="btn-accent w-full flex items-center justify-center gap-2"
            >
              {otpSent ? "Verify / ధృవీకరించు" : "Send OTP / OTP పంపు"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Quick Demo */}
        <div className="card p-4 mt-4">
          <button
            onClick={() => {
              loginAsDemo("weaver");
              router.push("/weaver");
            }}
            className="w-full text-center text-amber-400 hover:text-amber-300 text-sm font-medium py-2 transition-colors"
          >
            🧵 Quick Demo: Login as Weaver Ramesh Kumar →
          </button>
        </div>
      </div>
    </div>
  );
}
