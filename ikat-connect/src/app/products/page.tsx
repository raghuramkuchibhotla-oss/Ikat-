"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { mockProducts, type ProductCategory } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { useAuthStore } from "@/lib/auth-store";
import { labels } from "@/lib/utils";

export default function ProductsPage() {
  const { language } = useAuthStore();
  const t = labels[language];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [sortBy, setSortBy] = useState<"default" | "price-low" | "price-high" | "rating">("default");
  const [showFilters, setShowFilters] = useState(false);

  const categories: { value: ProductCategory | "all"; label: string }[] = [
    { value: "all", label: "All Products" },
    { value: "sarees", label: t.sarees },
    { value: "dupattas", label: t.dupattas },
    { value: "dress-materials", label: t.dressMaterials },
  ];

  const filteredProducts = useMemo(() => {
    let products = [...mockProducts];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.weaverName.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q) ||
          p.productId.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory !== "all") {
      products = products.filter((p) => p.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        products.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        products.sort((a, b) => b.rating - a.rating);
        break;
    }

    return products;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="bg-[#0c0a09] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">
            {t.products}
          </h1>
          <p className="text-stone-400">
            Browse authentic Pochampally Ikat products from verified weavers
          </p>
        </div>

        {/* Search & Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in-up">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-11"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="input-field w-full md:w-48"
          >
            <option value="default">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>

          {/* Filter Toggle (mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden btn-outline flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } md:block w-full md:w-56 flex-shrink-0`}
          >
            <div className="card p-4 sticky top-24">
              <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat.value
                        ? "bg-indigo-600 text-white font-medium"
                        : "text-stone-400 hover:text-white hover:bg-stone-800"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Quick Info */}
              <div className="mt-6 pt-4 border-t border-stone-800">
                <p className="text-stone-500 text-xs">
                  Showing {filteredProducts.length} of {mockProducts.length}{" "}
                  products
                </p>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Search className="w-12 h-12 text-stone-600 mx-auto mb-4" />
                <h3 className="text-white text-lg font-semibold mb-2">
                  No products found
                </h3>
                <p className="text-stone-400 text-sm">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="btn-outline mt-4"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
