"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import {
  X,
  Plus,
  Minus,
  Trash2,
  Calendar,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tent,
} from "lucide-react";

export default function CartDrawer() {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateCartQty,
    removeFromCart,
    clearCart,
    checkoutFromCart,
    settings,
  } = useApp();

  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );

  if (!isCartDrawerOpen) return null;

  const totalQty = cart.reduce((sum, c) => sum + c.qty, 0);
  const totalPricePerDay = cart.reduce(
    (sum, c) => sum + c.item.pricePerDay * c.qty,
    0
  );

  const calculateDays = () => {
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = e.getTime() - s.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24)) + 1;
    return days > 0 ? days : 1;
  };

  const durationDays = calculateDays();
  const totalAmount = totalPricePerDay * durationDays;
  const downPayment = Math.round(
    (totalAmount * (settings.minDpPercentage || 30)) / 100
  );
  const remainingAmount = totalAmount - downPayment;

  return (
    <div
      onClick={() => setIsCartDrawerOpen(false)}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] sm:max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-5 duration-300"
      >
        {/* Mobile Pull Sheet Indicator */}
        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto my-2 sm:hidden shrink-0" />

        {/* Drawer Header */}
        <div className="px-5 py-3.5 sm:py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-triva-crimson/20 text-triva-crimson flex items-center justify-center border border-triva-crimson/30 shadow-inner">
              <ShoppingBag className="w-5 h-5 text-triva-crimson" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black tracking-tight">
                  Keranjang Sewa Alat
                </h2>
                <span className="text-[10px] font-black bg-triva-crimson text-white px-2 py-0.5 rounded-full">
                  {totalQty} Unit
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Periksa daftar alat & sesuaikan durasi sewa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-[11px] text-slate-400 hover:text-rose-400 font-bold hover:underline transition-colors px-2 py-1"
                title="Hapus semua barang dari keranjang"
              >
                Kosongkan
              </button>
            )}
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {cart.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-triva-crimson-50 text-triva-crimson mx-auto flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800">
                  Keranjang Sewa Masih Kosong
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Jelajahi katalog alat outdoor kami dan tekan tombol &quot;+ Keranjang&quot; pada alat yang Anda inginkan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-triva-crimson text-white text-xs font-black shadow-md hover:bg-triva-crimson-700 active:scale-95 transition-all"
              >
                Pilih Alat di Katalog
              </button>
            </div>
          ) : (
            <>
              {/* List of Cart Items */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                  Daftar Alat Dipilih:
                </span>

                {cart.map(({ item, qty }) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50 border border-slate-200/90 rounded-2xl flex items-center justify-between gap-3 hover:bg-white transition-all shadow-xs"
                  >
                    {/* Left: Thumbnail & Info */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0 p-1">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Tent className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[9px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded">
                            {item.unitCode}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase truncate">
                            {item.categoryName}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-slate-900 line-clamp-1 mt-0.5">
                          {item.name}
                        </h4>
                        <div className="text-[11px] font-black text-triva-crimson mt-0.5">
                          Rp {item.pricePerDay.toLocaleString("id-ID")}
                          <span className="text-[9px] text-slate-400 font-normal"> /hari</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Quantity Counter & Remove */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.id, qty - 1)}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 flex items-center justify-center transition-colors active:scale-90"
                          title="Kurangi"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-black text-slate-900">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.id, qty + 1)}
                          className="w-7 h-7 rounded-lg bg-triva-crimson hover:bg-triva-crimson-700 text-white flex items-center justify-center transition-colors active:scale-90"
                          title="Tambah"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors active:scale-90"
                        title="Hapus unit ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Date Selector Box */}
              <div className="p-3.5 bg-triva-crimson-50/60 border border-triva-crimson-200 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-triva-crimson tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-triva-crimson" />
                    <span>Jadwal Durasi Sewa:</span>
                  </span>
                  <span className="text-[10px] font-black bg-triva-crimson text-white px-2 py-0.5 rounded-md">
                    {durationDays} Hari Sewa
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">
                      Tanggal Ambil:
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => {
                        const newStart = e.target.value;
                        setStartDate(newStart);
                        if (newStart > endDate) {
                          setEndDate(newStart);
                        }
                      }}
                      className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-triva-crimson"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">
                      Tanggal Kembali:
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-triva-crimson"
                    />
                  </div>
                </div>
              </div>

              {/* Financial Calculation Summary */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Sewa per Hari:</span>
                  <span className="font-bold">
                    Rp {totalPricePerDay.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Durasi Sewa:</span>
                  <span className="font-bold">{durationDays} Hari</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <span className="font-black text-slate-900 text-sm">
                    Total Biaya Sewa:
                  </span>
                  <span className="font-black text-slate-900 text-base">
                    Rp {totalAmount.toLocaleString("id-ID")}
                  </span>
                </div>

                {/* DP & Sisa Pelunasan */}
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 block">
                      Uang Muka (DP 30% via QRIS):
                    </span>
                    <span className="text-sm font-black text-emerald-900">
                      Rp {downPayment.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-amber-900 block">
                      Sisa Pelunasan (Saat Ambil Alat):
                    </span>
                    <span className="text-xs font-black text-amber-950">
                      Rp {remainingAmount.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Sticky Footer Action Button */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-slate-200 shrink-0 space-y-2">
            <button
              type="button"
              onClick={() => checkoutFromCart({ startDate, endDate })}
              className="w-full py-3.5 rounded-2xl bg-triva-crimson hover:bg-triva-crimson-700 text-white text-xs sm:text-sm font-black shadow-lg shadow-triva-crimson-950/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Lanjut ke Booking &amp; DP QRIS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Jaminan KTP Asli ditahan di kasir saat serah-terima alat</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
