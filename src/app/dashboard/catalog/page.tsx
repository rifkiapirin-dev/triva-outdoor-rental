"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import CategoryVisualShelf from "@/components/home/CategoryVisualShelf";
import ModalEditImage from "@/components/ModalEditImage";
import {
  Tent,
  Search,
  PlusCircle,
  Layers,
  Flame,
  Shirt,
  Compass,
  Package,
  Backpack,
  Footprints,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  Camera,
  Pencil,
  Plus,
  Minus,
  ShoppingBag,
} from "lucide-react";

function CatalogContent() {
  const {
    categories,
    items,
    setShowNewRentalModal,
    openNewRentalModalWithItem,
    setEditingTarget,
    currentUser,
    cart,
    addToCart,
    updateCartQty,
  } = useApp();

  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") || "all";

  const [search, setSearch] = useState("");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState(initialCat);

  // Sync if query param changes
  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat) {
      setActiveCategoryFilter(cat);
    }
  }, [searchParams]);

  // Stock counters
  const totalItemsCount = items.length;
  const availableItemsCount = items.filter((i) => i.status === "available").length;
  const rentedItemsCount = items.filter((i) => i.status === "rented").length;

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case "tenda":
        return Tent;
      case "carrier":
        return Backpack;
      case "sepatu":
        return Footprints;
      case "aksesoris":
        return Compass;
      case "celana":
        return Shirt;
      case "alat-masak":
        return Flame;
      case "jaket":
        return Layers;
      default:
        return Package;
    }
  };

  // Filter items by category & search query
  const getItemsForCategory = (categoryId: string) => {
    return items.filter((it) => {
      if (it.categoryId !== categoryId) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          it.name.toLowerCase().includes(q) ||
          it.unitCode.toLowerCase().includes(q) ||
          (it.conditionNotes && it.conditionNotes.toLowerCase().includes(q))
        );
      }
      return true;
    });
  };

  // When user clicks category card from Eiger shelf
  const handleSelectCategoryFromShelf = (slug: string) => {
    const matchedCategory = categories.find((c) => c.slug === slug);
    if (matchedCategory) {
      setActiveCategoryFilter(matchedCategory.id);
      // Smooth scroll to that category section
      const el = document.getElementById(`cat-sec-${slug}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const displayedCategories =
    activeCategoryFilter === "all"
      ? categories
      : categories.filter((c) => c.id === activeCategoryFilter || c.slug === activeCategoryFilter);

  const activeCategoryObj = categories.find(
    (c) => c.id === activeCategoryFilter || c.slug === activeCategoryFilter
  );

  return (
    <div className="space-y-6">
      {/* 1. Header & Live Stock Metrics Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-triva-charcoal-800 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-rose-300 text-[10px] font-bold tracking-wider uppercase">
              <Layers className="w-3.5 h-3.5 text-rose-400" />
              Katalog Master & Manajemen Stok TRIVA
            </div>
            <h1 className="text-xl sm:text-3xl font-black mt-2 tracking-tight">
              Katalog Lengkap Perlengkapan Outdoor
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Semua unit dikelompokkan rapi per kategori (7 unit per kategori) dengan foto produk asli dan status ketersediaan di toko.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {currentUser.role === "admin" && (
              <span className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                <span>Mode Admin Aktif</span>
              </span>
            )}
            <button
              onClick={() => setShowNewRentalModal(true)}
              className="self-start sm:self-auto px-5 py-3 bg-triva-crimson hover:bg-triva-crimson-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-triva-crimson/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Buat Reservasi Sewa</span>
            </button>
          </div>
        </div>

        {/* 3 Quick Stock Counters Inside Banner */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-5 mt-5 border-t border-white/10 text-center">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <span className="text-[10px] sm:text-xs text-slate-400 block font-medium">Total Inventaris</span>
            <span className="text-lg sm:text-2xl font-black text-white">{totalItemsCount} Unit</span>
          </div>
          <div className="bg-emerald-950/40 rounded-2xl p-3 border border-emerald-500/30">
            <span className="text-[10px] sm:text-xs text-emerald-300 block font-medium">Siap Sewa di Toko</span>
            <span className="text-lg sm:text-2xl font-black text-emerald-400">{availableItemsCount} Unit</span>
          </div>
          <div className="bg-rose-950/40 rounded-2xl p-3 border border-rose-500/30">
            <span className="text-[10px] sm:text-xs text-rose-300 block font-medium">Sedang di Gunung</span>
            <span className="text-lg sm:text-2xl font-black text-rose-400">{rentedItemsCount} Unit</span>
          </div>
        </div>
      </div>

      {/* 2. EIGER-STYLE VISUAL CATEGORY SHELF (INTERAKTIF FILTER DENGAN CELANA) */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-sm space-y-2">
        <CategoryVisualShelf
          activeCategory={activeCategoryObj?.slug}
          onSelectCategory={handleSelectCategoryFromShelf}
        />
      </div>

      {/* 3. Sticky Filter & Search Control Bar */}
      <div className="sticky top-14 sm:top-16 z-10 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-slate-200 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0 no-scrollbar flex-1 -mx-1 px-1">
            <button
              onClick={() => setActiveCategoryFilter("all")}
              className={`px-3.5 py-2 rounded-xl font-black shrink-0 transition-all ${
                activeCategoryFilter === "all"
                  ? "bg-[#18181b] text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Semua Kategori ({items.length})
            </button>
            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat.slug);
              const count = items.filter((i) => i.categoryId === cat.id).length;
              const isActive = activeCategoryFilter === cat.id || activeCategoryFilter === cat.slug;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryFilter(cat.id)}
                  className={`px-3 py-2 rounded-xl font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-triva-crimson text-white shadow-md shadow-triva-crimson/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.name} ({count})</span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kode (TND-01), merk, nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-8 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-triva-crimson"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Notice */}
        {activeCategoryFilter !== "all" && activeCategoryObj && (
          <div className="flex items-center justify-between text-xs bg-rose-50 text-rose-950 px-3 py-1.5 rounded-xl border border-rose-200/60">
            <div className="flex items-center gap-1.5 font-bold">
              <span>Menampilkan kategori:</span>
              <strong className="text-triva-crimson uppercase">{activeCategoryObj.name}</strong>
            </div>
            <button
              onClick={() => setActiveCategoryFilter("all")}
              className="text-[11px] font-bold text-triva-crimson hover:underline flex items-center gap-0.5"
            >
              <span>Reset Tampilkan Semua</span>
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* 4. GROUPED CATEGORY SECTIONS (7 UNIT PER KATEGORI DENGAN FOTO ASLI & FITUR UBAH FOTO ADMIN) */}
      <div className="space-y-8">
        {displayedCategories.map((category) => {
          const categoryItems = getItemsForCategory(category.id);
          const Icon = getCategoryIcon(category.slug);

          if (categoryItems.length === 0 && search) {
            return null; // Skip empty category when user searches
          }

          return (
            <section
              key={category.id}
              id={`cat-sec-${category.slug}`}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-6 space-y-4"
            >
              {/* Category Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-triva-crimson flex items-center justify-center shrink-0 border border-rose-100">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <span>{category.name}</span>
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {categoryItems.length} Unit
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">{category.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-start sm:self-auto">
                  {currentUser.role === "admin" && (
                    <button
                      type="button"
                      onClick={() =>
                        setEditingTarget({
                          type: "category",
                          id: category.id,
                          name: category.name,
                          currentImageUrl: category.imageUrl || "",
                          categorySlug: category.slug,
                        })
                      }
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-triva-crimson text-slate-600 hover:text-triva-crimson text-xs font-bold flex items-center gap-1.5 transition-all bg-white shadow-sm"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Ubah Foto Kategori</span>
                    </button>
                  )}

                  <div className="text-xs text-slate-400 font-semibold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    Tersedia di Toko:{" "}
                    <strong className="text-emerald-600 font-bold">
                      {categoryItems.filter((i) => i.status === "available").length} Unit
                    </strong>
                  </div>
                </div>
              </div>

              {/* Items Grid for this Category with Real Product Images */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
                {categoryItems.map((item) => {
                  const isAvailable = item.status === "available";

                  return (
                    <div
                      key={item.id}
                      className="group bg-[#f9fafb] hover:bg-white rounded-2xl border border-slate-200 hover:border-triva-crimson/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
                    >
                      <div>
                        {/* 1. Real Product Image Container */}
                        <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-108 transition-transform duration-500"
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Tent className="w-8 h-8" />
                            </div>
                          )}

                          {/* Floating Status Pill over photo */}
                          <div className="absolute top-2 left-2 z-10">
                            <span
                              className={`text-[9px] sm:text-[10px] font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md backdrop-blur-md uppercase tracking-wider ${
                                isAvailable
                                  ? "bg-emerald-600 text-white"
                                  : "bg-rose-700 text-white"
                              }`}
                            >
                              {isAvailable ? "Siap" : "Disewa"}
                            </span>
                          </div>

                          {/* ADMIN ONLY: BUTTON GANTI GAMBAR PRODUK */}
                          {currentUser.role === "admin" && (
                            <button
                              type="button"
                              onClick={() =>
                                setEditingTarget({
                                  type: "item",
                                  id: item.id,
                                  name: item.name,
                                  currentImageUrl: item.imageUrl || "",
                                  categorySlug: category.slug,
                                })
                              }
                              title="Ubah Foto Produk (Khusus Admin)"
                              className="absolute top-2 right-2 z-20 p-1 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl bg-slate-900/85 hover:bg-triva-crimson text-white text-[9px] sm:text-[10px] font-black flex items-center gap-1 shadow-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                            >
                              <Camera className="w-3 h-3 text-rose-300" />
                              <span className="hidden sm:inline">Ganti Foto</span>
                            </button>
                          )}

                          {/* Unit Code Badge */}
                          <div className="absolute bottom-2 left-2 z-10">
                            <span className="font-mono text-[9px] sm:text-[11px] font-black text-white bg-slate-900/90 px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 rounded shadow-md tracking-wider">
                              {item.unitCode}
                            </span>
                          </div>
                        </div>

                        {/* 2. Content Info with Consistent Height */}
                        <div className="p-2.5 sm:p-3.5 space-y-1 sm:space-y-2">
                          <h3 className="font-black text-xs sm:text-sm text-slate-800 leading-snug line-clamp-2 min-h-[2.25rem] sm:min-h-[2.5rem] group-hover:text-triva-crimson transition-colors">
                            {item.name}
                          </h3>

                          {item.conditionNotes ? (
                            <p className="hidden sm:block text-[11px] text-slate-500 bg-white/90 p-2 rounded-xl border border-slate-100 line-clamp-2 leading-relaxed min-h-[44px]">
                              {item.conditionNotes}
                            </p>
                          ) : (
                            <div className="hidden sm:block min-h-[44px]" />
                          )}
                        </div>
                      </div>

                      {/* 3. Bottom Price & Action with Jitter-free Equal Heights */}
                      <div className="p-2.5 sm:p-3.5 pt-0">
                        <div className="pt-2 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
                          <div className="min-w-0">
                            <span className="text-[8px] sm:text-[9px] text-slate-400 uppercase font-bold block leading-none">
                              Tarif Sewa
                            </span>
                            <span className="text-xs sm:text-base font-black text-triva-crimson block mt-0.5 truncate">
                              Rp {item.pricePerDay.toLocaleString("id-ID")}
                              <span className="text-[9px] sm:text-[10px] font-normal text-slate-400"> /hr</span>
                            </span>
                          </div>

                          {/* ShopeeFood / GoFood Style Add to Cart & Counter */}
                          {!isAvailable ? (
                            <span className="w-full sm:w-auto h-8 sm:h-9 px-3 rounded-xl text-[10px] font-bold bg-slate-200 text-slate-400 flex items-center justify-center text-center cursor-not-allowed">
                              Disewa
                            </span>
                          ) : (() => {
                            const cartEntry = cart.find((c) => c.item.id === item.id);
                            const inCartQty = cartEntry ? cartEntry.qty : 0;

                            if (inCartQty === 0) {
                              return (
                                <button
                                  type="button"
                                  onClick={() => addToCart(item)}
                                  className="w-full sm:w-auto h-8 sm:h-9 px-3 rounded-xl text-[11px] sm:text-xs font-black bg-triva-crimson hover:bg-triva-crimson-700 text-white shadow-md shadow-triva-crimson/20 active:scale-95 flex items-center justify-center gap-1 transition-all shrink-0"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>+ Keranjang</span>
                                </button>
                              );
                            }

                            return (
                              <div className="flex items-center justify-between sm:justify-center gap-1.5 bg-rose-50 border border-rose-300 rounded-xl px-1.5 h-8 sm:h-9 shadow-xs w-full sm:w-auto shrink-0">
                                <button
                                  type="button"
                                  onClick={() => updateCartQty(item.id, inCartQty - 1)}
                                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white text-triva-crimson hover:bg-triva-crimson hover:text-white font-black flex items-center justify-center shadow-xs transition-colors active:scale-90"
                                  title="Kurangi"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-5 sm:w-6 text-center text-xs font-black text-rose-950">
                                  {inCartQty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => addToCart(item)}
                                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-triva-crimson text-white hover:bg-triva-crimson-700 font-black flex items-center justify-center shadow-xs transition-colors active:scale-90"
                                  title="Tambah"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* 5. MODAL EDIT GAMBAR MANUAL (KHUSUS ADMIN) */}
      <ModalEditImage />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center p-8 text-stone-500 font-medium">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-triva-crimson border-t-transparent rounded-full animate-spin" />
            <span>Memuat Katalog Perlengkapan TRIVA...</span>
          </div>
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}