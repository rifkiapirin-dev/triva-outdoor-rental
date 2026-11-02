"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import HeroBannerCarousel from "@/components/home/HeroBannerCarousel";
import CategoryVisualShelf from "@/components/home/CategoryVisualShelf";
import TestimonialCommunitySection from "@/components/home/TestimonialCommunitySection";
import {
  Compass,
  Tent,
  Calendar,
  Clock,
  Shield,
  FileText,
  MapPin,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function CustomerDashboard() {
  const { rentals, items, currentUser, setShowNewRentalModal, openNewRentalModalWithItem, settings } = useApp();

  // Filter only this customer's rentals
  const myRentals = rentals.filter((r) => r.customerId === currentUser.id);
  const activeRental = myRentals.find(
    (r) => r.status === "pending_dp" || r.status === "confirmed" || r.status === "active"
  );

  const handleOpenWaReceipt = (bookingCode: string) => {
    const rental = myRentals.find((r) => r.bookingCode === bookingCode);
    if (!rental) return;

    const text = encodeURIComponent(
      `*TIKET RESERVASI SEWA TRIVA*\n\n` +
      `Halo TRIVA Outdoor, saya *${rental.customerName}*.\n` +
      `Kode Booking: *${rental.bookingCode}*\n` +
      `Jadwal: ${rental.startDate} s/d ${rental.endDate}\n` +
      `Perlengkapan: ${rental.items.map((i) => i.name).join(", ")}\n` +
      `Total: Rp ${rental.totalAmount.toLocaleString("id-ID")}\n` +
      `Sisa Bayar di Toko: Rp ${rental.remainingAmount.toLocaleString("id-ID")}\n\n` +
      `Saya akan mengambil alat langsung di toko TRIVA dengan membawa KTP fisik asli.`
    );
    window.open(`https://wa.me/${settings.storePhoneWa}?text=${text}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* 1. SLIDING HERO BANNER CAROUSEL (ALA EIGER) */}
      <HeroBannerCarousel />

      {/* 2. VISUAL CATEGORY CAPSULES (ALA EIGER) */}
      <CategoryVisualShelf />

      {/* 3. ACTIVE RENTAL DIGITAL TICKET PASS (IF ANY) */}
      {activeRental && (
        <div
          className={`bg-white rounded-3xl border-2 shadow-lg p-5 space-y-4 relative overflow-hidden ${
            activeRental.status === "pending_dp"
              ? "border-amber-300 ring-2 ring-amber-400/20"
              : activeRental.status === "confirmed"
              ? "border-emerald-300 ring-2 ring-emerald-400/20"
              : "border-triva-crimson/30"
          }`}
        >
          <div
            className={`absolute top-0 right-0 text-white text-[10px] font-extrabold px-4 py-1 rounded-bl-2xl uppercase tracking-widest ${
              activeRental.status === "active"
                ? "bg-emerald-600"
                : activeRental.status === "confirmed"
                ? "bg-blue-600"
                : "bg-amber-600 animate-pulse"
            }`}
          >
            {activeRental.status === "active"
              ? "⛺ Sedang Digunakan"
              : activeRental.status === "confirmed"
              ? "🎫 Siap Diambil di Toko"
              : "⏳ Menunggu Verifikasi DP"}
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Tiket Reservasi Digital Aktif Anda
            </span>
            <div className="text-xl font-mono font-extrabold text-slate-900 mt-0.5 flex items-center gap-2 flex-wrap">
              <span>{activeRental.bookingCode}</span>
              {activeRental.handledByStaffName && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Diverifikasi Staf: {activeRental.handledByStaffName}
                </span>
              )}
            </div>
          </div>

          {/* Visual Step Tracker: Read-only Progress Pass */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
              {/* Step 1 */}
              <div className="space-y-1">
                <div
                  className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-[10px] font-black ${
                    activeRental.status === "pending_dp"
                      ? "bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  {activeRental.status === "pending_dp" ? "1" : "✓"}
                </div>
                <span className={activeRental.status === "pending_dp" ? "text-amber-900 font-black" : "text-slate-600"}>
                  1. Verifikasi DP
                </span>
              </div>

              {/* Step 2 */}
              <div className="space-y-1">
                <div
                  className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-[10px] font-black ${
                    activeRental.status === "confirmed"
                      ? "bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse"
                      : activeRental.status === "active"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  {activeRental.status === "active" ? "✓" : "2"}
                </div>
                <span className={activeRental.status === "confirmed" ? "text-blue-900 font-black" : "text-slate-500"}>
                  2. Siap Diambil
                </span>
              </div>

              {/* Step 3 */}
              <div className="space-y-1">
                <div
                  className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-[10px] font-black ${
                    activeRental.status === "active"
                      ? "bg-emerald-600 text-white ring-4 ring-emerald-100 animate-pulse"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  3
                </div>
                <span className={activeRental.status === "active" ? "text-emerald-900 font-black" : "text-slate-500"}>
                  3. Digunakan
                </span>
              </div>

              {/* Step 4 */}
              <div className="space-y-1">
                <div className="w-6 h-6 mx-auto rounded-full flex items-center justify-center text-[10px] font-black bg-slate-200 text-slate-400">
                  4
                </div>
                <span className="text-slate-400">
                  4. Selesai
                </span>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-center text-[10px] text-slate-500">
              🔒 <em>Persetujuan serah-terima alat &amp; pemeriksaan fisik kembali dilakukan langsung oleh staf di kasir toko TRIVA.</em>
            </div>
          </div>

          {/* Banner Penjelasan Status Persetujuan */}
          {activeRental.status === "pending_dp" && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-spin" />
              <div className="text-xs space-y-1">
                <span className="font-extrabold block">
                  Pembayaran DP Berhasil Dikirim &bull; Menunggu Verifikasi Staf Kasir
                </span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Staf kasir TRIVA sedang mencocokkan mutasi rekening/QRIS toko. Begitu disetujui, tiket ini otomatis berubah status menjadi <strong>Siap Diambil di Toko</strong> dan perlengkapan Anda langsung disiapkan di rak pengambilan.
                </p>
              </div>
            </div>
          )}

          {activeRental.status === "confirmed" && (
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-extrabold block">
                  Pesanan Telah Disetujui! Siap Diambil di Toko TRIVA
                </span>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Perlengkapan Anda sudah selesai dipacking oleh tim TRIVA. Silakan datang langsung ke toko fisik dengan menunjukkan kode booking ini ke kasir. Pastikan Anda membawa <strong>{activeRental.idCardType} fisik asli</strong> untuk dititipkan di brankas toko dan menyiapkan sisa pelunasan sebesar <strong>Rp {activeRental.remainingAmount.toLocaleString("id-ID")}</strong>.
                </p>
              </div>
            </div>
          )}

          {activeRental.status === "active" && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-2.5">
              <Compass className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-extrabold flex items-center gap-1.5 flex-wrap">
                  <span>Perlengkapan Sedang Digunakan &bull; Selamat Berpetualang!</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-black">
                    KTP Asli di Brankas Toko
                  </span>
                </span>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Alat telah diserahterimakan di toko. Harap jaga kebersihan dan keutuhan seluruh unit. Kembalikan ke toko TRIVA sebelum <strong>{activeRental.endDate} maks pukul {settings.returnDeadlineHour} WIB</strong> agar tidak terkena denda. Staf toko akan melakukan cek fisik sebelum mengembalikan {activeRental.idCardType} fisik asli Anda.
                </p>
              </div>
            </div>
          )}

          {/* Schedule & Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 block mb-0.5">Jadwal Penggunaan:</span>
              <strong className="text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-triva-crimson" />
                {activeRental.startDate} s/d {activeRental.endDate} ({activeRental.durationDays} Hari)
              </strong>
              <div className="text-[11px] text-amber-700 font-semibold mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Kembalikan maks pukul {settings.returnDeadlineHour} WIB
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block mb-0.5">Perlengkapan yang Disewa:</span>
              <div className="space-y-1">
                {activeRental.items.map((it) => (
                  <div key={it.itemId} className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Tent className="w-3.5 h-3.5 text-slate-400" />
                    <span>{it.name} <strong className="text-triva-crimson">({it.unitCode})</strong></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment & Collateral Status */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs pt-1">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">
                {activeRental.remainingAmount === 0 ? "Pelunasan:" : "Sisa Pelunasan (Saat Ambil Alat):"}
              </span>
              <span
                className={`font-extrabold text-sm ${
                  activeRental.remainingAmount === 0 ? "text-emerald-700" : "text-triva-crimson"
                }`}
              >
                {activeRental.remainingAmount === 0
                  ? "✓ LUNAS"
                  : `Rp ${activeRental.remainingAmount.toLocaleString("id-ID")}`}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold">
                Jaminan: {activeRental.idCardType}
              </span>
            </div>

            <button
              onClick={() => handleOpenWaReceipt(activeRental.bookingCode)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-triva-crimson" />
              <span>Buka Nota Digital WA</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. STORE LOCATION & MANDATORY PHYSICAL ID WARNING */}
      <div className="p-4 bg-amber-50/70 rounded-3xl border border-amber-200/80 text-xs text-amber-900 space-y-2">
        <div className="flex items-center gap-2 font-bold">
          <Shield className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Ketentuan Pengambilan Alat di Toko Fisik TRIVA</span>
        </div>
        <p className="text-[11px] leading-relaxed text-amber-800/90">
          Pengambilan alat wajib datang langsung ke toko fisik untuk serah-terima dan pemeriksaan fisik alat.
          Pastikan Anda membawa <strong>KTP fisik asli</strong> yang masih berlaku sebagai jaminan.
        </p>
        <div className="flex items-center gap-1.5 text-[11px] text-amber-950 font-semibold pt-1">
          <MapPin className="w-3.5 h-3.5 text-triva-crimson" />
          <span>{settings.storeAddress} (Buka setiap hari 08:00 &ndash; 21:00 WIB)</span>
        </div>
      </div>

      {/* 5. POPULAR GEAR HIGHLIGHTS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-triva-amber" />
            Rekomendasi Alat Pendakian Populer
          </h2>
          <Link href="/dashboard/catalog" className="text-[11px] font-bold text-triva-crimson hover:underline">
            Lihat Semua Katalog &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {items.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-triva-crimson bg-white px-2 py-0.5 rounded border border-slate-200 inline-block mb-1">
                  {item.unitCode}
                </span>
                <h3 className="font-bold text-xs text-slate-800">{item.name}</h3>
                <span className="text-xs font-extrabold text-slate-900 block mt-1">
                  Rp {item.pricePerDay.toLocaleString("id-ID")}
                  <span className="text-[10px] font-normal text-slate-400">/hari</span>
                </span>
              </div>

              <button
                onClick={() => openNewRentalModalWithItem(item)}
                className="mt-3 w-full py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-triva-crimson hover:bg-triva-crimson hover:text-white transition-all"
              >
                Booking Alat
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 6. TESTIMONI & GALERI KOMUNITAS PENDAKI (#StyleOnTheTrail) */}
      <TestimonialCommunitySection />
    </div>
  );
}
