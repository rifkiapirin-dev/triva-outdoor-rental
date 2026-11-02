"use client";

import React from "react";
import Image from "next/image";
import {
  X,
  ShieldCheck,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  Tent,
  Compass,
  Award,
  Lock,
  ExternalLink,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

interface ModalCompanyProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalCompanyProfile({ isOpen, onClose }: ModalCompanyProfileProps) {
  const { settings, setShowNewRentalModal } = useApp();

  if (!isOpen) return null;

  const handleOpenWa = () => {
    const text = encodeURIComponent(
      "Halo TRIVA Outdoor, saya ingin bertanya seputar sewa alat pendakian dan lokasi basecamp."
    );
    window.open(`https://wa.me/${settings.storePhoneWa}?text=${text}`, "_blank");
  };

  const handleOpenMaps = () => {
    const query = encodeURIComponent(`TRIVA Outdoor ${settings.storeAddress}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Cover Banner */}
        <div className="relative h-44 sm:h-52 bg-slate-950 shrink-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1200&auto=format&fit=crop&q=80"
            alt="TRIVA Outdoor Basecamp"
            fill
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center border border-white/20 transition-all hover:scale-110 z-10"
            aria-label="Tutup Profil"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Badge & Title in Cover */}
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-white p-1 shadow-lg shrink-0 border border-slate-100">
                <Image
                  src="/triva-logo.png"
                  alt="TRIVA Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-triva-crimson/90 text-white text-[10px] font-extrabold uppercase tracking-widest">
                  <Award className="w-3 h-3" />
                  Profil Resmi Toko
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                  TRIVA OUTDOOR
                </h2>
                <p className="text-xs text-rose-200 font-medium tracking-wide">
                  Style on the Trail &bull; Persewaan Alat Gunung & Ekspedisi
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs sm:text-sm">
          {/* Tentang TRIVA */}
          <div className="space-y-2">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-triva-crimson" />
              Tentang Kami & Komitmen Kualitas
            </h3>
            <p className="text-slate-600 leading-relaxed">
              <strong>TRIVA Outdoor</strong> adalah penyedia jasa persewaan perlengkapan pendakian gunung dan kegiatan outdoor premium yang berdedikasi mendemokratisasi petualangan alam bebas. Kami hadir agar siapa pun dapat menikmati keindahan puncak gunung dengan aman, nyaman, dan berkelas tanpa harus terbebani biaya pembelian alat yang mahal.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="block text-xl font-black text-triva-crimson">49+</span>
              <span className="text-[11px] text-slate-500 font-bold">Unit Siap Pakai</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="block text-xl font-black text-emerald-600">100%</span>
              <span className="text-[11px] text-slate-500 font-bold">Steril & Bersih</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="block text-xl font-black text-blue-600">0</span>
              <span className="text-[11px] text-slate-500 font-bold">Insiden Data KTP</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="block text-xl font-black text-amber-500">4.9/5</span>
              <span className="text-[11px] text-slate-500 font-bold">Rating Kepuasan</span>
            </div>
          </div>

          {/* 4 Pilar Standar Operasional */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              4 Standar Pelayanan TRIVA Outdoor
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Cuci & Sterilisasi</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Setiap tenda, sleeping bag, dan matras dibersihkan dengan sabun khusus dan disterilkan sebelum disewakan kembali.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                  <Lock className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Jaminan KTP Aman di Brankas</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Identitas fisik pelanggan disimpan dalam brankas khusus berpasscode dan dikembalikan utuh tanpa disalahgunakan.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                  <Tent className="w-4 h-4 text-triva-crimson shrink-0" />
                  <span>Uji Fisik & QC Bersama</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Pengecekan zipper, frame alloy, pasak, dan kompor dilakukan bersama staf sebelum dibawa agar siap hadapi cuaca gunung.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Sistem Realtime & Transparan</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Stok terintegrasi langsung dengan database Supabase realtime. Bebas biaya tersembunyi dengan DP mudah via QRIS.
                </p>
              </div>
            </div>
          </div>

          {/* Informasi Toko & Basecamp */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-rose-300 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Lokasi Toko & Jam Operasional
            </h4>
            <div className="space-y-1.5 text-xs text-slate-300">
              <p className="flex items-start gap-2">
                <strong className="text-white shrink-0">Alamat:</strong>
                <span>{settings.storeAddress}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Buka Setiap Hari: <strong>08.00 - 21.00 WIB</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Hotline WA: <strong>+{settings.storePhoneWa}</strong></span>
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleOpenWa}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Chat WhatsApp</span>
            </button>
            <button
              onClick={handleOpenMaps}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Maps</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors w-1/3 sm:w-auto"
            >
              Tutup
            </button>
            <button
              onClick={() => {
                onClose();
                setShowNewRentalModal(true);
              }}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-triva-crimson hover:bg-triva-crimson-700 text-white font-bold text-xs shadow-md shadow-triva-crimson/25 transition-all hover:scale-105 active:scale-95"
            >
              Sewa Perlengkapan Sekarang &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
