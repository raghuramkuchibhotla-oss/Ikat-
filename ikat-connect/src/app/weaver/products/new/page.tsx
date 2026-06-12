"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Plus, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useDataStore } from "@/lib/data-store";
import { generateProductId } from "@/lib/utils";

export default function NewProductPage() {
  const { user } = useAuthStore();
  const { weavers, addProduct } = useDataStore();
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    nameTE: "",
    nameHI: "",
    description: "",
    price: "",
    category: "sarees",
    fabric: "",
    color: "",
    stockQuantity: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Find weaver profile
  const weaver = weavers.find((w) => w.userId === user?.id) || weavers[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct = {
      id: `p-${Date.now()}`,
      productId: generateProductId(),
      name: form.name,
      nameTE: form.nameTE || undefined,
      nameHI: form.nameHI || undefined,
      description: form.description,
      price: Number(form.price),
      category: form.category as any,
      fabric: form.fabric,
      color: form.color,
      images: [
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop",
      ],
      weaverId: weaver.id,
      weaverName: weaver.name,
      inStock: Number(form.stockQuantity) > 0,
      stockQuantity: Number(form.stockQuantity),
      rating: 5.0,
      reviews: 0,
      tags: [form.fabric.toLowerCase(), form.color.toLowerCase(), form.category],
      createdAt: new Date().toISOString().split("T")[0],
    };

    addProduct(newProduct);
    setSubmitted(true);
  };

  if (!mounted) {
    return (
      <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center">
        <div className="text-center text-stone-500">Loading Form...</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center py-12 px-4">
        <div className="text-center animate-fade-in-up">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mb-2">Product Added!</h2>
          <p className="text-stone-400 mb-6">Your product is now listed on IKAT CONNECT</p>
          <div className="flex gap-4 justify-center">
            <Link href="/weaver/products" className="btn-outline">View Products</Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setForm({
                  name: "",
                  nameTE: "",
                  nameHI: "",
                  description: "",
                  price: "",
                  category: "sarees",
                  fabric: "",
                  color: "",
                  stockQuantity: "",
                });
              }}
              className="btn-accent"
            >
              Add Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0c0a09] min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/weaver/products" className="inline-flex items-center gap-2 text-stone-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <h1 className="text-2xl font-serif font-bold text-white mb-1">Add New Product</h1>
        <p className="text-stone-400 text-sm mb-6">కొత్త ఉత్పత్తిని జోడించు • नया उत्पाद जोड़ें</p>

        <form onSubmit={handleSubmit} className="card p-6 space-y-5">
          {/* Product Name */}
          <div>
            <label className="text-stone-400 text-sm block mb-1.5">Product Name (English) *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Royal Indigo Silk Saree" className="input-field" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-stone-400 text-sm block mb-1.5">Name (తెలుగు)</label>
              <input type="text" value={form.nameTE} onChange={(e) => setForm({ ...form, nameTE: e.target.value })} placeholder="తెలుగు పేరు" className="input-field" />
            </div>
            <div>
              <label className="text-stone-400 text-sm block mb-1.5">Name (हिंदी)</label>
              <input type="text" value={form.nameHI} onChange={(e) => setForm({ ...form, nameHI: e.target.value })} placeholder="हिंदी नाम" className="input-field" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-stone-400 text-sm block mb-1.5">Description *</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your product..." className="input-field min-h-[100px]" required />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-stone-400 text-sm block mb-1.5">Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                <option value="sarees">Sarees / చీరలు</option>
                <option value="dupattas">Dupattas / దుపట్టాలు</option>
                <option value="dress-materials">Dress Materials</option>
              </select>
            </div>
            <div>
              <label className="text-stone-400 text-sm block mb-1.5">Price (₹) *</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g. 5000" className="input-field" required />
            </div>
          </div>

          {/* Fabric & Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-stone-400 text-sm block mb-1.5">Fabric *</label>
              <input type="text" value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} placeholder="e.g. Pure Silk" className="input-field" required />
            </div>
            <div>
              <label className="text-stone-400 text-sm block mb-1.5">Color *</label>
              <input type="text" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="e.g. Indigo Blue" className="input-field" required />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="text-stone-400 text-sm block mb-1.5">Stock Quantity *</label>
            <input type="number" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} placeholder="e.g. 10" className="input-field" required />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="text-stone-400 text-sm block mb-1.5">Product Photos</label>
            <div className="border-2 border-dashed border-stone-700 rounded-xl p-8 text-center hover:border-amber-500/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-stone-500 mx-auto mb-2" />
              <p className="text-stone-400 text-sm">Click to upload photos</p>
              <p className="text-stone-600 text-xs mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>

          <button type="submit" className="btn-accent w-full flex items-center justify-center gap-2 mt-2">
            <Plus className="w-4 h-4" />
            Add Product / ఉత్పత్తిని జోడించు
          </button>
        </form>
      </div>
    </div>
  );
}
