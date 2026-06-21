"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, X, Package, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product, ProductCategory } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { useAuthStore } from "@/lib/auth-store";
import { labels } from "@/lib/utils";
import { getProducts } from "@/actions/products";

const CATEGORY_MAP: Record<string, ProductCategory> = {
  SAREE: "sarees",
  DUPATTA: "dupattas",
  DRESS_MATERIAL: "dress-materials",
};

const PAGE_SIZE = 12;

function adaptProduct(p: any): Product {
  return {
    id: p.id,
    productId: p.productCode,
    name: p.title,
    description: p.description ?? "",
    price: Number(p.price),
    category: CATEGORY_MAP[p.category] ?? "sarees",
    fabric: "Handloom Ikat",
    color: "Traditional",
    images: p.images?.length > 0 ? p.images : ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop"],
    weaverId: p.weaverId,
    weaverName: p.weaver?.user?.name ?? "Artisan Weaver",
    inStock: p.stock > 0,
    stockQuantity: p.stock,
    rating: 0,
    reviews: 0,
    isPreOrder: false,
  } as unknown as Product;
}

export default function ProductsPage() {
  const { language } = useAuthStore();
  const t = labels[language];
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [sortBy, setSortBy] = useState<"default" | "price-low" | "price-high">("default");
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data.map(adaptProduct));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [searchQuery, selectedCategory, sortBy, minPrice, maxPrice]);

  const categories: { value: ProductCategory | "all"; label: string }[] = [
    { value: "all", label: "All Products" },
    { value: "sarees", label: t.sarees },
    { value: "dupattas", label: t.dupattas },
    { value: "dress-materials", label: t.dressMaterials },
  ];

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.weaverName.toLowerCase().includes(q));
    }
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }
    const min = minPrice ? Number(minPrice) : 0;
    const max = maxPrice ? Number(maxPrice) : Infinity;
    if (min > 0 || max < Infinity) {
      list = list.filter((p) => p.price >= min && p.price <= max);
    }
    if (sortBy === "price-low") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, searchQuery, selectedCategory, sortBy, minPrice, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const pageProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || minPrice || maxPrice;

  function clearFilters() {
    setSearchQuery("");
    setSelectedCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("default");
  }

  return (
    <div className="bg-[#0c0a09] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">{t.products}</h1>
          <p className="text-stone-400">Browse authentic Pochampally Ikat products from verified weavers</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in-up">
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
              <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="input-field w-full md:w-48">
            <option value="default">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          <button onClick={() => setShowFilters(!showFilters)} className="md:hidden btn-outline flex items-center justify-center gap-2">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-56 flex-shrink-0`}>
            <div className="card p-4 sticky top-24 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Categories</h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat.value ? "bg-indigo-600 text-white font-medium" : "text-stone-400 hover:text-white hover:bg-stone-800"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="border-t border-stone-800 pt-5">
                <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Price Range</h3>
                <div className="space-y-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-sm">₹</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      min={0}
                      className="input-field pl-7 text-sm"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-sm">₹</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      min={0}
                      className="input-field pl-7 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Stats + Clear */}
              <div className="border-t border-stone-800 pt-4">
                <p className="text-stone-500 text-xs mb-3">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-indigo-400 hover:text-indigo-300 text-xs flex items-center gap-1 transition-colors">
                    <X className="w-3 h-3" /> Clear all filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Product grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card aspect-[3/4] animate-pulse bg-stone-800/50" />
                ))}
              </div>
            ) : pageProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
                  {pageProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-10">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="btn-outline p-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                            p === page
                              ? "bg-indigo-600 text-white"
                              : "text-stone-400 hover:text-white hover:bg-stone-800"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="btn-outline p-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <Package className="w-12 h-12 text-stone-600 mx-auto mb-4" />
                <h3 className="text-white text-lg font-semibold mb-2">
                  {products.length === 0 ? "No products listed yet" : "No products found"}
                </h3>
                <p className="text-stone-400 text-sm">
                  {products.length === 0
                    ? "Weavers will list their products here once verified"
                    : "Try adjusting your search or filters"}
                </p>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="btn-outline mt-4">
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
