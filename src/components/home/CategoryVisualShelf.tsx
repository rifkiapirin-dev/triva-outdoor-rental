"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Pencil, Save } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface CategoryVisualShelfProps {
  activeCategory?: string;
  onSelectCategory?: (slug: string) => void;
}

export default function CategoryVisualShelf({
  activeCategory,
  onSelectCategory,
}: CategoryVisualShelfProps) {
  const router = useRouter();
  const { categories, currentUser, setEditingTarget, persistCurrentPhotosToServer } = useApp();

  const handleCardClick = (slug: string) => {
    if (onSelectCategory) {
      onSelectCategory(slug);
    } else {
      router.push(`/dashboard/catalog?cat=${slug}`);
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Shelf Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div>
          <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight uppercase flex items-center gap-1.5">
            <span>Kategori Perlengkapan Outdoor</span>
            {currentUser.role === "admin" && (
              <span className="text-[10px] font-bold text-triva-crimson bg-triva-crimson-50 border border-triva-crimson-200 px-2 py-0.5 rounded-md">
                Admin Mode (Klik ✏️ ganti foto)
              </span>
            )}
          </h2>
          <div className="flex items-center gap-2">
            <p className="text-[11px] text-slate-500">Pilih kategori alat untuk melihat stok unit siap sewa</p>
            <span className="sm:hidden text-[9px] font-black text-triva-crimson bg-triva-crimson-50 px-1.5 py-0.5 rounded border border-triva-crimson-200">
              Geser &rarr;
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5">
          {currentUser.role === "admin" && (
            <button
              onClick={() => persistCurrentPhotosToServer()}
              title="Kunci dan simpan semua foto manual ke server fisik agar tidak pernah berubah lagi"
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg shadow-sm transition-all active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Permanen Foto</span>
            </button>
          )}

          <Link
            href="/dashboard/catalog"
            className="text-xs font-bold text-triva-crimson hover:underline flex items-center gap-1"
          >
            <span>Lihat Semua Katalog</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>

      {/* 7 CATEGORY CARDS (TENDA, BAGS, SEPATU, ACCESSORIES, CELANA, ALAT MASAK, JACKET) */}
      <div className="flex overflow-x-auto pb-3 pt-1 gap-2.5 sm:gap-4 sm:grid sm:grid-cols-4 lg:grid-cols-7 no-scrollbar snap-x snap-mandatory -mx-3 px-3 sm:mx-0 sm:px-0">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat.slug;

          return (
            <div
              key={cat.id}
              onClick={() => handleCardClick(cat.slug)}
              className={`w-[130px] sm:w-auto shrink-0 snap-start group cursor-pointer rounded-2xl sm:rounded-3xl transition-all duration-300 relative select-none flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 ${
                isSelected
                  ? "border-2 border-triva-crimson ring-2 ring-triva-crimson/25 shadow-md bg-white"
                  : "border border-slate-200/90 hover:border-slate-800 bg-slate-50/70 hover:bg-white"
              }`}
            >
              {/* ADMIN ONLY: EDIT FOTO KATEGORI BUTTON */}
              {currentUser.role === "admin" && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingTarget({
                      type: "category",
                      id: cat.id,
                      name: cat.name,
                      currentImageUrl: cat.imageUrl || "",
                      categorySlug: cat.slug,
                    });
                  }}
                  title={`Ubah Foto Kategori ${cat.name} (Khusus Admin)`}
                  className="absolute top-2 left-2 z-30 w-7 h-7 rounded-xl bg-slate-900/80 hover:bg-triva-crimson text-white flex items-center justify-center shadow-lg backdrop-blur-sm transition-all hover:scale-110 active:scale-95"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}

              {/* FLASH SALE STICKER BADGE (ALA TRIVA APPAREL) */}
              {cat.hasFlashSale && (
                <div className="absolute top-2.5 right-2.5 z-20">
                  <div className="relative bg-gradient-to-r from-amber-500 via-rose-600 to-triva-crimson text-white font-black text-[9px] px-2 py-0.5 rounded shadow-lg uppercase tracking-wider flex items-center gap-1 animate-pulse">
                    <Zap className="w-2.5 h-2.5 fill-current" />
                    <span>FLASH SALE</span>
                  </div>
                </div>
              )}

              {/* Product Cutout Photo Container */}
              <div className="relative w-full aspect-[4/5] p-3 sm:p-4 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src={cat.imageUrl || "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=400&auto=format&fit=crop&q=80"}
                    alt={cat.name}
                    fill
                    className="object-contain group-hover:scale-108 transition-transform duration-300 drop-shadow"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
                  />
                </div>
              </div>

              {/* Bottom Solid Dark Pill / Bar */}
              <div
                className={`w-full py-2.5 px-1 text-center transition-colors ${
                  isSelected
                    ? "bg-triva-crimson text-white"
                    : "bg-[#18181b] text-white group-hover:bg-triva-crimson"
                }`}
              >
                <span className="text-[11px] sm:text-xs font-black tracking-widest uppercase block leading-none">
                  {cat.name}
                </span>
                <span className="text-[9px] text-slate-300 font-medium block mt-0.5 opacity-80 group-hover:opacity-100">
                  {cat.sublabel || cat.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}