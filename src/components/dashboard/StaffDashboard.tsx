"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { RentalTransaction } from "@/types";
import HeroBannerCarousel from "@/components/home/HeroBannerCarousel";
import {
  Store,
  ArrowUpRight,
  ArrowDownLeft,
  AlertTriangle,
  ShieldCheck,
  PlusCircle,
  QrCode,
  Camera,
  CheckCircle,
  MessageCircle,
  FileText,
  Clock,
  Tent,
  CheckCheck,
  XCircle,
  AlertCircle,
  Sparkles,
  Download,
} from "lucide-react";
import { exportRentalsToExcel } from "@/lib/exportExcel";

export default function StaffDashboard() {
  const {
    rentals,
    items,
    currentUser,
    settings,
    updateRentalStatus,
    setShowNewRentalModal,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"checkout" | "checkin" | "all">("checkout");

  const todayStr = new Date().toISOString().slice(0, 10);
  const outgoingToday = rentals.filter((r) => r.startDate === todayStr).length;
  const incomingToday = rentals.filter((r) => r.endDate === todayStr).length;
  const overdueRentals = rentals.filter(
    (r) => r.status === "active" && r.endDate < todayStr
  );
  const ktpHeldCount = rentals.filter((r) => r.status === "active").length;
  const pendingApprovalCount = rentals.filter((r) => r.status === "pending_dp").length;

  // Filter rentals based on operational tab
  const getDisplayedRentals = () => {
    if (activeTab === "checkout") {
      return rentals.filter((r) => r.status === "confirmed" || r.status === "pending_dp");
    }
    if (activeTab === "checkin") {
      return rentals.filter((r) => r.status === "active");
    }
    return rentals;
  };

  const displayedRentals = getDisplayedRentals();

  const handleSendWaReminder = (r: RentalTransaction) => {
    const text = encodeURIComponent(
      `*PENGINGAT KASIR TRIVA OUTDOOR*\n\n` +
      `Halo Kak *${r.customerName}*,\n` +
      `Mengingatkan waktu sewa alat (${r.items.map((i) => i.name).join(", ")}) berakhir hari ini.\n\n` +
      `⏰ *Batas Pengembalian:* Maksimal pukul ${settings.returnDeadlineHour} WIB malam ini.\n` +
      `📍 *Lokasi Toko:* ${settings.storeAddress}\n` +
      `💵 *Sisa Pelunasan:* Rp ${r.remainingAmount.toLocaleString("id-ID")}\n\n` +
      `KTP fisik asli Anda akan dikembalikan setelah pemeriksaan kelengkapan alat selesai.`
    );
    window.open(`https://wa.me/${r.customerPhone.replace(/^0/, "62")}?text=${text}`, "_blank");
  };

  return (
    <div className="space-y-5">
      {/* Staff Counter Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 rounded-3xl p-5 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-amber-100 text-[10px] font-bold tracking-wider uppercase">
              <Store className="w-3.5 h-3.5" />
              Meja Kasir & Operasional Toko
            </div>
            <h1 className="text-xl font-extrabold mt-2 tracking-tight">
              Konsol Petugas: {currentUser.name}
            </h1>
            <p className="text-xs text-amber-100 mt-0.5">
              Fokus: Serah-terima alat di toko, verifikasi KTP fisik jaminan, dan pemeriksaan pengembalian.
            </p>
          </div>

          {/* Quick Counter Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                const today = new Date().toISOString().slice(0, 10);
                exportRentalsToExcel(rentals, `Kasir_${today}`);
              }}
              className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
              title="Unduh Rekap Laporan Kasir ke Excel (.csv)"
            >
              <Download className="w-4 h-4" />
              <span>Export Excel</span>
            </button>
            <button
              onClick={() => setShowNewRentalModal(true)}
              className="px-4 py-2.5 bg-white text-amber-900 rounded-xl text-xs font-bold shadow-md hover:bg-amber-50 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-triva-crimson" />
              <span>+ Layani Sewa Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Auto-sliding Banner Promo Toko (Tampil Langsung di Layar Kasir) */}
      <HeroBannerCarousel />

      {/* 4 Operational Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Stat 1: Ambil Hari Ini */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Ambil di Toko Hari Ini</span>
            <ArrowUpRight className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-800">{outgoingToday} Order</div>
          <span className="text-[10px] text-blue-600 font-semibold block mt-1">Siapkan unit di rak</span>
        </div>

        {/* Stat 2: Kembali Hari Ini */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Kembali Hari Ini</span>
            <ArrowDownLeft className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-800">{incomingToday} Order</div>
          <span className="text-[10px] text-slate-400 block mt-1">Maks {settings.returnDeadlineHour} WIB</span>
        </div>

        {/* Stat 3: Overdue / Peringatan */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Telat Pengembalian</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className={`text-xl font-extrabold ${overdueRentals.length > 0 ? "text-rose-600 animate-pulse" : "text-slate-800"}`}>
            {overdueRentals.length} Orang
          </div>
          <span className="text-[10px] text-rose-600 font-bold block mt-1">
            {overdueRentals.length > 0 ? "Klik Chat WA Tagih Denda" : "Semua Tepat Waktu"}
          </span>
        </div>

        {/* Stat 4: KTP Fisik Ditahan */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">KTP Fisik di Laci Jaminan</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-emerald-700">{ktpHeldCount} KTP</div>
          <span className="text-[10px] text-slate-500 block mt-1">Jaminan aktif di toko</span>
        </div>
      </div>

      {/* Antrean Kerja Meja Kasir */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tab Antrean */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Antrean Kasir & Serah-Terima Lapangan</h2>
            <p className="text-[11px] text-slate-400">Pilih tab operasional untuk melayani tamu di toko</p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab("checkout")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "checkout" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>Antrean Ambil ({rentals.filter((r) => r.status === "confirmed" || r.status === "pending_dp").length})</span>
              {pendingApprovalCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black animate-pulse">
                  {pendingApprovalCount} Perlu Persetujuan
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("checkin")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "checkin" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Antrean Kembali ({rentals.filter((r) => r.status === "active").length})
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Semua
            </button>
          </div>
        </div>

        {/* Antrean Items */}
        <div className="divide-y divide-slate-100">
          {displayedRentals.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Tidak ada antrean dalam kategori ini.
            </div>
          ) : (
            displayedRentals.map((r) => (
              <div
                key={r.id}
                className={`p-4 transition-colors space-y-3 ${
                  r.status === "pending_dp"
                    ? "bg-amber-50/50 border-l-4 border-amber-500 hover:bg-amber-50/80"
                    : "hover:bg-slate-50/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-900">{r.bookingCode}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.status === "active"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : r.status === "confirmed"
                          ? "bg-blue-50 text-blue-800 border border-blue-200"
                          : "bg-amber-100 text-amber-900 border border-amber-300 font-extrabold"
                      }`}
                    >
                      {r.status === "active"
                        ? "Sedang Digunakan"
                        : r.status === "confirmed"
                        ? "Siap Diambil"
                        : "⏳ Perlu Persetujuan DP"}
                    </span>
                    {r.handledByStaffName && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Disetujui: {r.handledByStaffName}
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 block">
                      Total: Rp {r.totalAmount.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[10px] text-amber-700 font-bold">
                      Sisa Bayar: Rp {r.remainingAmount.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {/* Callout khusus pesanan baru pending_dp */}
                {r.status === "pending_dp" && (
                  <div className="p-3 rounded-2xl bg-amber-100/70 border border-amber-300 text-amber-950 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div className="flex-1 text-[11px] leading-relaxed">
                      <div className="font-extrabold flex items-center gap-1.5 flex-wrap">
                        <span>Pesanan Baru Masuk dari Aplikasi &bull; Menunggu Verifikasi Kasir</span>
                        <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-black">
                          DP: Rp {r.downPayment.toLocaleString("id-ID")} ({r.paymentMethod.toUpperCase()})
                        </span>
                      </div>
                      <p className="text-amber-800 text-[10px] mt-0.5">
                        Cek mutasi rekening/QRIS toko TRIVA. Jika dana DP sudah masuk, klik <strong>&quot;Verifikasi DP &amp; Setujui&quot;</strong> di bawah ini agar pesanan terkonfirmasi dan siap dipacking.
                      </p>
                    </div>
                  </div>
                )}

                {/* Pelanggan & Jaminan */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{r.customerName}</span> &bull;{" "}
                    <span className="text-slate-500">{r.customerPhone}</span> &bull; Jaminan:{" "}
                    <strong className="text-amber-800">{r.idCardType}</strong>
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Jadwal: {r.startDate} s/d {r.endDate} ({r.durationDays} hari)
                  </div>
                </div>

                {/* Barang yang disewa */}
                <div className="flex flex-wrap gap-1.5">
                  {r.items.map((i) => (
                    <span
                      key={i.itemId}
                      className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 font-medium"
                    >
                      <strong className="text-triva-crimson">{i.unitCode}</strong> {i.name}
                    </span>
                  ))}
                </div>

                {/* Operational Action Buttons */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSendWaReminder(r)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Chat WA
                    </button>
                    {r.ktpPhotoUrl && (
                      <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
                        <CheckCircle className="w-3 h-3" /> Foto KTP Siap
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Action 1: Approval for pending_dp -> confirmed */}
                    {r.status === "pending_dp" && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                `Setujui pesanan ${r.bookingCode} atas nama ${r.customerName}?\n\nPastikan DP sebesar Rp ${r.downPayment.toLocaleString("id-ID")} (${r.paymentMethod.toUpperCase()}) telah masuk ke mutasi toko.`
                              )
                            ) {
                              updateRentalStatus(r.id, "confirmed");
                            }
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold active:scale-95 shadow-md shadow-emerald-950/20 transition-all flex items-center gap-1.5"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Verifikasi DP &amp; Setujui</span>
                        </button>
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                `Tolak / batalkan pesanan ${r.bookingCode}?\n\nUnit alat akan langsung dikembalikan ke stok siap sewa.`
                              )
                            ) {
                              updateRentalStatus(r.id, "cancelled");
                            }
                          }}
                          className="px-2.5 py-1.5 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 rounded-xl text-xs font-bold active:scale-95 transition-all flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Tolak</span>
                        </button>
                      </div>
                    )}

                    {/* Action 2: Check-Out (Serah Terima Alat) */}
                    {r.status === "confirmed" && (
                      <button
                        onClick={() => {
                          if (confirm(`Serah terima alat kepada ${r.customerName}? Pastikan KTP fisik asli sudah ditahan.`)) {
                            updateRentalStatus(r.id, "active");
                          }
                        }}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 active:scale-95 shadow-sm"
                      >
                        Serahkan Alat &amp; Tahan KTP
                      </button>
                    )}

                    {/* Action 3: Check-In (Pengembalian) */}
                    {r.status === "active" && (
                      <button
                        onClick={() => {
                          const hasDamage = confirm("Apakah alat dikembalikan dalam kondisi lengkap & bersih?\n\n(Klik 'Cancel' jika ada denda atau kerusakan)");
                          if (hasDamage) {
                            updateRentalStatus(r.id, "returned");
                          } else {
                            const penalty = prompt("Masukkan nominal denda/ganti rugi (Rp):", "25000");
                            const notes = prompt("Catatan denda (misal: pasak hilang 2 pcs):", "Pasak tenda hilang");
                            if (penalty) {
                              updateRentalStatus(r.id, "returned", Number(penalty), notes || "");
                            }
                          }
                        }}
                        className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 active:scale-95 shadow-sm"
                      >
                        Cek Fisik &amp; Selesai
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
