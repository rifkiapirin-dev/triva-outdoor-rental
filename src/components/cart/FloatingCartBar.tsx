"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function FloatingCartBar() {
  const { cart, setIsCartDrawerOpen } = useApp();

  if (cart.length === 0) return null;

  const totalQty = cart.reduce((sum, c) => sum + c.qty, 0);
  const totalPricePerDay = cart.reduce((sum, c) => sum + c.item.pricePerDay * c.qty, 0);

  return (
    <aside
      aria-label="Keranjang Sewa Melayang"
      className="fixed bottom-[74px] sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:w-[400px] z-40 animate-in slide-in-from-bottom-4 duration-300 pointer-events-auto"
    >
      <div
        onClick={() => setIsCartDrawerOpen(true)}
        className="cursor-pointer bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 shadow-2xl shadow-triva-crimson-950/40 border border-triva-crimson/80 hover:border-triva-crimson ring-1 ring-white/10 flex items-center justify-between gap-2.5 sm:gap-3 backdrop-blur-md hover:scale-[1.01] active:scale-[0.98] transition-all"
      >
        {/* Left: Bag Icon & Counters */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-triva-crimson to-rose-700 flex items-center justify-center shrink-0 shadow-lg shadow-triva-crimson/40">
            <ShoppingBag className="w-5 h-5 text-white" />
            <span className="absolute -top-1.5 -right-1.5 bg-white text-triva-crimson text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-slate-950">
              {totalQty}
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-rose-300 tracking-wider">
                Keranjang
              </span>
              <span className="text-[10px] text-slate-400 font-bold">&bull; {totalQty} Unit</span>
            </div>
            <div className="text-xs sm:text-base font-black text-white truncate">
              Rp {totalPricePerDay.toLocaleString("id-ID")}
              <span className="text-[9px] sm:text-[10px] font-normal text-slate-300"> /hari</span>
            </div>
          </div>
        </div>

        {/* Right: CTA Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsCartDrawerOpen(true);
          }}
          className="px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-triva-crimson hover:bg-triva-crimson-700 text-white text-xs font-black shrink-0 flex items-center gap-1.5 shadow-lg shadow-triva-crimson-950/50 transition-all hover:translate-x-0.5"
        >
          <span>Lihat Keranjang</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </aside>
  );
}
