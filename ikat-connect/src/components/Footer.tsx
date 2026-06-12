import Link from "next/link";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0a0908] border-t border-stone-800/50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">IC</span>
              </div>
              <div>
                <span className="text-lg font-bold text-white">IKAT</span>
                <span className="text-lg font-bold text-amber-400"> CONNECT</span>
              </div>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed max-w-sm mb-6">
              Direct Weaver-to-Customer Marketplace for authentic Pochampally
              Ikat. Empowering weavers, eliminating middlemen, and bringing
              genuine handloom products to your doorstep.
            </p>
            <div className="flex flex-col gap-2 text-sm text-stone-400">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" />
                Pochampally, Yadadri Bhuvanagiri, Telangana
              </span>
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400" />
                +91 9876 543 210
              </span>
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                support@ikatconnect.com
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Products", href: "/products" },
                { label: "Verify Authenticity", href: "/verify" },
                { label: "Track Order", href: "/orders" },
                { label: "Weaver Stories", href: "/products" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-stone-400 hover:text-amber-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Weavers */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              For Weavers
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Weaver Login", href: "/weaver/auth" },
                { label: "Yarn Board", href: "/weaver/yarn-board" },
                { label: "Sell Your Products", href: "/weaver/products/new" },
                { label: "Weaver Support", href: "/weaver" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-stone-400 hover:text-amber-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Multilingual Note */}
        <div className="border-t border-stone-800/50 pt-6 mb-6">
          <div className="flex flex-wrap gap-4 justify-center text-xs text-stone-500">
            <span>🇮🇳 Available in English, తెలుగు, हिंदी</span>
            <span>•</span>
            <span>GI Tagged Pochampally Ikat</span>
            <span>•</span>
            <span>Handloom Mark Certified</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-stone-800/50 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-stone-500 text-xs">
            © 2026 IKAT CONNECT. All rights reserved.
          </p>
          <p className="text-stone-500 text-xs flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-500" /> for
            Pochampally Weavers
          </p>
        </div>
      </div>
    </footer>
  );
}
