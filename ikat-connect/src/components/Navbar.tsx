"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Menu, X, ShoppingCart, Search, Globe, Shield, LayoutDashboard, LogOut, User,
} from "lucide-react";
import { useSession } from "@/providers/session-provider";
import { logoutUser } from "@/actions/auth";
import { labels } from "@/lib/utils";
import { useAuthStore } from "@/lib/auth-store";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { language, setLanguage } = useAuthStore();
  const { user, cartCount } = useSession();
  const router = useRouter();
  const t = labels[language];

  useEffect(() => { setMounted(true); }, []);

  const handleLogout = async () => {
    await logoutUser();
    router.refresh();
  };

  return (
    <nav className="fixed w-full z-50 bg-[#0c0a09]/80 backdrop-blur-xl border-b border-stone-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">IC</span>
            </div>
            <div>
              <span className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">IKAT</span>
              <span className="text-lg font-bold text-amber-400 group-hover:text-white transition-colors"> CONNECT</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-stone-300 hover:text-white transition-colors text-sm font-medium">{t.home}</Link>
            <Link href="/products" className="text-stone-300 hover:text-white transition-colors text-sm font-medium">{t.products}</Link>
            <Link href="/verify" className="text-stone-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />{t.verify}
            </Link>
            {user?.role === "WEAVER" && (
              <Link href="/weaver" className="text-stone-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
                <LayoutDashboard className="w-3.5 h-3.5" />{t.dashboard}
              </Link>
            )}
            {user?.role === "ADMIN" && (
              <Link href="/admin" className="text-stone-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
                <LayoutDashboard className="w-3.5 h-3.5" />Admin
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language */}
            <div className="relative">
              <button onClick={() => setShowLangMenu(!showLangMenu)} className="text-stone-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-stone-800/50">
                <Globe className="w-4 h-4" />
              </button>
              {showLangMenu && (
                <div className="absolute right-0 top-full mt-2 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl py-1 min-w-[120px] animate-fade-in">
                  {(["en", "te", "hi"] as const).map((lang) => (
                    <button key={lang} onClick={() => { setLanguage(lang); setShowLangMenu(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-stone-800 transition-colors ${language === lang ? "text-amber-400 font-semibold" : "text-stone-300"}`}>
                      {lang === "en" ? "English" : lang === "te" ? "తెలుగు" : "हिंदी"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search */}
            <Link href="/products" className="text-stone-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-stone-800/50">
              <Search className="w-4 h-4" />
            </Link>

            {/* Cart */}
            <Link href="/checkout" className="text-stone-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-stone-800/50 relative">
              <ShoppingCart className="w-4 h-4" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-stone-900 text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {!user ? (
              <Link href="/sign-in" className="btn-primary text-sm py-2 px-4">{t.login}</Link>
            ) : (
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 rounded-xl px-3 py-2 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <span className="text-indigo-400 text-xs font-bold">{user.name?.[0] ?? "U"}</span>
                  </div>
                  <span className="text-white text-sm truncate max-w-[80px]">{user.name?.split(" ")?.[0] ?? "User"}</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl py-1 min-w-[160px] animate-fade-in">
                    <div className="px-4 py-2 border-b border-stone-800">
                      <p className="text-white text-sm font-medium truncate">{user.name}</p>
                      <p className="text-stone-500 text-xs">{user.role}</p>
                    </div>
                    <Link href="/orders" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-stone-300 hover:text-white hover:bg-stone-800">
                      <User className="w-3.5 h-3.5" />My Orders
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-stone-800">
                      <LogOut className="w-3.5 h-3.5" />Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-stone-300 hover:text-white p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-stone-800 py-4 animate-fade-in">
            <div className="flex flex-col gap-3">
              <Link href="/" className="text-stone-300 hover:text-white px-3 py-2" onClick={() => setIsOpen(false)}>{t.home}</Link>
              <Link href="/products" className="text-stone-300 hover:text-white px-3 py-2" onClick={() => setIsOpen(false)}>{t.products}</Link>
              <Link href="/verify" className="text-stone-300 hover:text-white px-3 py-2" onClick={() => setIsOpen(false)}>{t.verify}</Link>
              <Link href="/checkout" className="text-stone-300 hover:text-white px-3 py-2 flex items-center gap-2" onClick={() => setIsOpen(false)}>
                <ShoppingCart className="w-4 h-4" />Cart {mounted && cartCount > 0 && `(${cartCount})`}
              </Link>
              {user?.role === "WEAVER" && (
                <Link href="/weaver" className="text-stone-300 hover:text-white px-3 py-2" onClick={() => setIsOpen(false)}>Weaver Dashboard</Link>
              )}
              {user?.role === "ADMIN" && (
                <Link href="/admin" className="text-stone-300 hover:text-white px-3 py-2" onClick={() => setIsOpen(false)}>Admin Dashboard</Link>
              )}
              <div className="border-t border-stone-800 pt-3 mt-2 px-3 flex gap-2">
                {(["en", "te", "hi"] as const).map((lang) => (
                  <button key={lang} onClick={() => setLanguage(lang)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${language === lang ? "bg-indigo-600 text-white" : "bg-stone-800 text-stone-400 hover:text-white"}`}>
                    {lang === "en" ? "EN" : lang === "te" ? "తె" : "हि"}
                  </button>
                ))}
              </div>
              <div className="px-3">
                {!user ? (
                  <Link href="/sign-in" className="btn-primary text-sm py-2 px-4 w-full text-center block">{t.login}</Link>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-stone-300 text-sm">{user.name}</span>
                    <button onClick={handleLogout} className="text-rose-400 text-sm flex items-center gap-1">
                      <LogOut className="w-3.5 h-3.5" />Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
