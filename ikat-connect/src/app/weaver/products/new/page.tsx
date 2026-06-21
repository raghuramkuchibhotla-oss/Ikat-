"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Plus, CheckCircle, Loader2 } from "lucide-react";
import { createProduct } from "@/actions/products";

const CATEGORIES = [
  { value: "SAREE", label: "Sarees / చీరలు" },
  { value: "DUPATTA", label: "Dupattas / దుపట్టాలు" },
  { value: "DRESS_MATERIAL", label: "Dress Materials" },
];

export default function NewProductPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreview(previews);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const formData = new FormData(e.currentTarget);
      await createProduct(formData);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message ?? "Failed to add product. Make sure you are a verified weaver.");
    } finally {
      setSubmitting(false);
    }
  };

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
            <button onClick={() => { setSubmitted(false); setImagePreview([]); }} className="btn-accent">Add Another</button>
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

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 mb-4">
            <p className="text-rose-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card p-6 space-y-5">
          <div>
            <label className="text-stone-400 text-sm block mb-1.5">Product Title *</label>
            <input name="title" type="text" placeholder="e.g. Royal Indigo Silk Saree" className="input-field" required />
          </div>

          <div>
            <label className="text-stone-400 text-sm block mb-1.5">Description *</label>
            <textarea name="description" placeholder="Describe your product — materials, technique, dimensions..." className="input-field min-h-[100px]" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-stone-400 text-sm block mb-1.5">Category *</label>
              <select name="category" className="input-field" required>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-stone-400 text-sm block mb-1.5">Price (₹) *</label>
              <input name="price" type="number" min="1" placeholder="e.g. 5000" className="input-field" required />
            </div>
          </div>

          <div>
            <label className="text-stone-400 text-sm block mb-1.5">Stock Quantity *</label>
            <input name="stock" type="number" min="0" placeholder="e.g. 10" className="input-field" required />
          </div>

          <div>
            <label className="text-stone-400 text-sm block mb-1.5">Product Photos</label>
            <input
              ref={fileInputRef}
              type="file"
              name="images"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-700 rounded-xl p-8 text-center hover:border-amber-500/50 transition-colors cursor-pointer"
            >
              <Upload className="w-8 h-8 text-stone-500 mx-auto mb-2" />
              <p className="text-stone-400 text-sm">Click to upload photos</p>
              <p className="text-stone-600 text-xs mt-1">PNG, JPG up to 5MB each</p>
            </div>
            {imagePreview.length > 0 && (
              <div className="flex gap-3 mt-3 flex-wrap">
                {imagePreview.map((src, i) => (
                  <img key={i} src={src} alt={`Preview ${i + 1}`} className="w-20 h-24 object-cover rounded-xl border border-stone-700" />
                ))}
              </div>
            )}
            <p className="text-stone-600 text-xs mt-2">Images will be uploaded to Cloudinary once credentials are configured.</p>
          </div>

          <button type="submit" disabled={submitting} className="btn-accent w-full flex items-center justify-center gap-2 mt-2 disabled:opacity-60">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {submitting ? "Adding Product..." : "Add Product / ఉత్పత్తిని జోడించు"}
          </button>
        </form>
      </div>
    </div>
  );
}
