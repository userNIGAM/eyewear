"use client";

import { useState } from "react";
import { products } from "@/data/products";
import ProductCard from "@/components/product-card";
import { SlidersHorizontal } from "lucide-react";

const CATEGORIES = ["All", "Classic", "Minimalist", "Sport", "Retro", "Sun"];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-zinc-950 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-8 mb-10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-green-500">
            Premium Catalog
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl mt-1">
            Signature Eyewear
          </h1>
          <p className="text-zinc-400 text-sm mt-2 max-w-xl">
            Explore our curated catalog of 20 premium sunglasses frames, meticulously designed for visual excellence and comfort.
          </p>
        </div>

        {/* Filter bar container */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mr-2 border border-zinc-800 rounded-lg px-3 py-2 bg-zinc-900/30">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Styles:</span>
          </div>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-green-500 text-zinc-950 shadow-md shadow-green-500/10"
                  : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Product Cards */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={product.image}
              title={product.title}
              description={product.description}
              price={product.price}
              rating={product.rating}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-zinc-500 text-lg">No sunglasses found in this category.</p>
          <button
            onClick={() => setSelectedCategory("All")}
            className="text-xs font-semibold text-green-500 hover:underline mt-2"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
