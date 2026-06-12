"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  Search,
  User,
  LogOut,
  Globe,
  Shield,
  LayoutDashboard,
} from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useCartStore } from "@/lib/cart-store";
import { labels } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isLoggedIn, role, logout, language, setLanguage } =
    useAuthStore();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const t = labels[language];

  useEffect(() => {
    setMounted(true);
  }, []);

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
              <span className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                IKAT
              </span>
              <span className="text-lg font-bold text-amber-400 group-hover:text-white transition-colors">
                {" "}CONNECT
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-stone-300 hover:text-white transition-colors text-sm font-medium"
            >
              {t.home}
            </Link>
            <Link
              href="/products"
              className="text-stone-300 hover:text-white transition-colors text-sm font-medium"
            >
              {t.products}
            </Link>
            <Link
              href="/verify"
              className="text-stone-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              {t.verify}
            </Link>

            {mounted && isLoggedIn && role === "weaver" && (
              <Link
                href="/weaver"
                className="text-stone-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                {t.dashboard}
              </Link>
            )}

            {mounted && isLoggedIn && role === "admin" && (
              <Link
                href="/admin"
                className="text-stone-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="text-stone-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-stone-800/50"
              >
                <Globe className="w-4 h-4" />
              </button>
              {showLangMenu && (
                <div className="absolute right-0 top-full mt-2 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl py-1 min-w-[120px] animate-fade-in">
                  {(["en", "te", "hi"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-stone-800 transition-colors ${
                        language === lang
                          ? "text-amber-400 font-semibold"
                          : "text-stone-300"
                      }`}
                    >
                      {lang === "en"
                        ? "English"
                        : lang === "te"
                          ? "తెలుగు"
                          : "हिंदी"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search */}
            <Link
              href="/products"
              className="text-stone-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-stone-800/50"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Cart */}
            <Link
              href="/checkout"
              className="text-stone-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-stone-800/50 relative"
            >
              <ShoppingCart className="w-4 h-4" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-stone-900 text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            {mounted && isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  href={
                    role === "weaver"
                      ? "/weaver/profile"
                      : role === "admin"
                        ? "/admin"
                        : "/orders"
                  }
                  className="flex items-center gap-2 text-stone-300 hover:text-white transition-colors text-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user?.name?.[0] || "U"}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="text-stone-400 hover:text-rose-400 transition-colors p-2"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="btn-primary text-sm py-2 px-4">
                {t.login}
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-stone-300 hover:text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-stone-800 py-4 animate-fade-in">
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="text-stone-300 hover:text-white transition-colors px-3 py-2"
                onClick={() => setIsOpen(false)}
              >
                {t.home}
              </Link>
              <Link
                href="/products"
                className="text-stone-300 hover:text-white transition-colors px-3 py-2"
                onClick={() => setIsOpen(false)}
              >
                {t.products}
              </Link>
              <Link
                href="/verify"
                className="text-stone-300 hover:text-white transition-colors px-3 py-2"
                onClick={() => setIsOpen(false)}
              >
                {t.verify}
              </Link>
              <Link
                href="/checkout"
                className="text-stone-300 hover:text-white transition-colors px-3 py-2 flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingCart className="w-4 h-4" />
                Cart {mounted && totalItems > 0 && `(${totalItems})`}
              </Link>
              {mounted && isLoggedIn && role === "weaver" && (
                <Link
                  href="/weaver"
                  className="text-stone-300 hover:text-white transition-colors px-3 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Weaver {t.dashboard}
                </Link>
              )}
              {mounted && isLoggedIn && role === "admin" && (
                <Link
                  href="/admin"
                  className="text-stone-300 hover:text-white transition-colors px-3 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Admin {t.dashboard}
                </Link>
              )}
              <div className="border-t border-stone-800 pt-3 mt-2 px-3 flex gap-2">
                {(["en", "te", "hi"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      language === lang
                        ? "bg-indigo-600 text-white"
                        : "bg-stone-800 text-stone-400 hover:text-white"
                    }`}
                  >
                    {lang === "en" ? "EN" : lang === "te" ? "తె" : "हि"}
                  </button>
                ))}
              </div>
              {(!mounted || !isLoggedIn) && (
                <Link
                  href="/auth/login"
                  className="btn-primary text-sm py-2 px-4 text-center mx-3 mt-2"
                  onClick={() => setIsOpen(false)}
                >
                  {t.login}
                </Link>
              )}
              {mounted && isLoggedIn && (
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="text-rose-400 hover:text-rose-300 transition-colors px-3 py-2 text-left flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
