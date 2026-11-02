"use client";

import Image from "next/image";
import Link from "next/link";
import HeroBannerCarousel from "@/components/home/HeroBannerCarousel";
import CategoryVisualShelf from "@/components/home/CategoryVisualShelf";
import FloatingCartBar from "@/components/cart/FloatingCartBar";
import CartDrawer from "@/components/cart/CartDrawer";
import ModalNewRental from "@/components/ModalNewRental";
import ModalEditImage from "@/components/ModalEditImage";
import {
  Tent,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  QrCode,
  Calendar,
  Sparkles,
  Phone,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-2xl overflow-hidden flex items-center justify-center drop-shadow-md group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/triva-logo.png"
                alt="TRIVA Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <span className="font-black text-xs sm:text-base tracking-tight text-slate-900 group-hover:text-triva-crimson transition-colors block leading-tight">
                TRIVA OUTDOOR
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-triva-crimson uppercase block mt-0.5">
                Style on the Trail
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/login"
              className="px-2.5 sm:px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-[11px] sm:text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/dashboard"
              className="px-3 sm:px-4 py-1.5 rounded-xl bg-triva-crimson text-white text-[11px] sm:text-xs font-bold shadow-md hover:bg-triva-crimson-700 active:scale-95 transition-all"
            >
              Buka Aplikasi
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-3 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 pb-28 sm:pb-12">
        {/* 1. Eiger-Style Sliding Hero Banner Carousel */}
        <HeroBannerCarousel />

        {/* 2. Eiger-Style Rounded Category Shelf */}
        <CategoryVisualShelf />

        {/* Value Proposition Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900">Jaminan KTP Aman</h3>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Penyimpanan aman jaminan identitas KTP fisik di toko, terlindungi privasi sesuai standar.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900">Anti Double-Booking</h3>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Database PostgreSQL memastikan alat yang sudah dibooking tidak akan bentrok tanggal.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900">QRIS & WhatsApp</h3>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Scan QRIS instan di kasir toko dan nota reservasi digital otomatis terkirim ke WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-triva-crimson to-rose-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
              Siap Menjelajahi Puncak Impianmu?
            </h2>
            <p className="text-xs text-rose-100">
              Sewa alat pendakian resmi TRIVA sekarang dan nikmati petualangan tanpa beban.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="self-start sm:self-auto px-5 py-3 rounded-2xl bg-white text-triva-crimson font-extrabold text-xs shadow-lg hover:bg-rose-50 active:scale-95 transition-all flex items-center gap-2"
          >
            <span>Mulai Sewa Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="relative w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center">
              <Image src="/triva-logo.png" alt="TRIVA Logo" fill className="object-contain" />
            </div>
            <span className="font-black text-xs text-slate-800 tracking-tight">
              TRIVA OUTDOOR &bull; Style on the Trail
            </span>
          </div>
          <p className="text-xs text-slate-400 text-center sm:text-right">
            &copy; 2026 TRIVA Outdoor Rental & CRM System. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Floating Cart Bar, Drawer, Rental Modal, and Image Edit Modal */}
      <FloatingCartBar />
      <CartDrawer />
      <ModalNewRental />
      <ModalEditImage />
    </div>
  );
}
