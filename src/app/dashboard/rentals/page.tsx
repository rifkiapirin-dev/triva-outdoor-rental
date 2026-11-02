"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import ModalReceipt from "@/components/ModalReceipt";
import ModalHandoverSettlement from "@/components/ModalHandoverSettlement";
import { RentalTransaction, PaymentMethod } from "@/types";
import {
  Receipt,
  Search,
  PlusCircle,
  MessageCircle,
  CheckCircle,
  CheckCheck,
  XCircle,
  AlertCircle,
  Clock,
  Shield,
  Download,
  Calendar,
  Printer,
  Copy,
  Tent,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  History,
  Compass,
} from "lucide-react";
import { exportRentalsToExcel } from "@/lib/exportExcel";

function RentalsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    rentals,
    items,
    currentUser,
    setShowNewRentalModal,
    updateRentalStatus,
    settings,
    notify,
    addToCart,
    setIsCartDrawerOpen,
  } = useApp();

  // Tab Utama: "active" (Sewa Saya / Sewa Aktif) vs "history" (Riwayat Transaksi)
  const initialView = searchParams.get("view") === "history" ? "history" : "active";
  const [activeView, setActiveView] = useState<"active" | "history">(initialView);

  // Sub-filter status
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "this_month" | "custom">("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [search, setSearch] = useState("");

  const [selectedRentalForReceipt, setSelectedRentalForReceipt] = useState<RentalTransaction | null>(null);
  const [selectedRentalForHandover, setSelectedRentalForHandover] = useState<RentalTransaction | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Sync if URL query param changes
  useEffect(() => {
    const v = searchParams.get("view");
    if (v === "history" || v === "active") {
      setActiveView(v);
      setStatusFilter("all");
    }
  }, [searchParams]);

  const handleSwitchView = (view: "active" | "history") => {
    setActiveView(view);
    setStatusFilter("all");
    router.replace(`/dashboard/rentals?view=${view}`);
  };

  const handleCopyBookingCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      notify(`Kode booking #${code} disalin ke clipboard!`, "success");
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const isAdminOrStaff = currentUser.role === "admin" || currentUser.role === "staff";
  const todayStr = new Date().toISOString().slice(0, 10);
  const currentMonthStr = new Date().toISOString().slice(0, 7);

  // Filter awal berdasarkan hak akses (Customer hanya melihat miliknya)
  const userRentals = rentals.filter((r) => {
    if (currentUser.role === "customer" && r.customerId !== currentUser.id) return false;
    return true;
  });

  // Pemisahan sejati: Sewa Aktif (pending, confirmed, active) vs Riwayat Transaksi (returned, cancelled)
  const allActiveRentals = userRentals.filter(
    (r) => r.status === "pending_dp" || r.status === "confirmed" || r.status === "active"
  );
  const allHistoryRentals = userRentals.filter(
    (r) => r.status === "returned" || r.status === "cancelled"
  );

  // Terapkan filter view yang sedang dibuka
  const targetRentalsPool = activeView === "active" ? allActiveRentals : allHistoryRentals;

  // Filter waktu (terutama relevan di Riwayat Transaksi)
  const timeFilteredRentals = targetRentalsPool.filter((r) => {
    if (activeView === "active") return true; // Sewa aktif selalu tampil
    const recordDate = r.createdAt ? r.createdAt.slice(0, 10) : r.startDate;

    if (timeFilter === "today" && recordDate !== todayStr) return false;
    if (timeFilter === "this_month" && !recordDate.startsWith(currentMonthStr)) return false;
    if (timeFilter === "custom") {
      if (customStartDate && recordDate < customStartDate) return false;
      if (customEndDate && recordDate > customEndDate) return false;
    }
    return true;
  });

  // Filter sub-status & pencarian
  const displayRentals = timeFilteredRentals.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.bookingCode.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.customerPhone.includes(q)
      );
    }
    return true;
  });

  // Perhitungan Keuangan
  const periodTotalOmset = displayRentals.reduce((sum, r) => sum + r.totalAmount, 0);
  const periodTotalDp = displayRentals.reduce((sum, r) => sum + r.downPayment, 0);
  const periodTotalRemaining = displayRentals.reduce((sum, r) => sum + r.remainingAmount, 0);

  const handleExport = () => {
    let label = activeView === "active" ? "Sewa_Aktif" : "Riwayat_Selesai";
    if (timeFilter === "today") label += `_${todayStr}`;
    else if (timeFilter === "this_month") label += `_${currentMonthStr}`;
    exportRentalsToExcel(displayRentals, label);
  };

  const handleSendWa = (phone: string, code: string, name: string) => {
    const text = encodeURIComponent(
      `Halo Kak *${name}*, konfirmasi dari TRIVA Outdoor terkait sewa Anda (Kode: *${code}*). Kami siap melayani di toko kami.`
    );
    window.open(`https://wa.me/${phone.replace(/^0/, "62")}?text=${text}`, "_blank");
  };

  // Re-order: Sewa lagi alat dari riwayat dengan 1 klik
  const handleReorderRental = (r: RentalTransaction) => {
    let addedCount = 0;
    r.items.forEach((it) => {
      const matchItem = items.find((g) => g.id === it.itemId || g.unitCode === it.unitCode);
      if (matchItem) {
        addToCart(matchItem);
        addedCount++;
      }
    });
    setIsCartDrawerOpen(true);
    notify(
      `Berhasil menambahkan ${addedCount} alat dari riwayat ${r.bookingCode} ke keranjang sewa!`,
      "success"
    );
  };

  // Eksekusi Serah Terima & Pelunasan
  const handleConfirmHandoverSettlement = (rentalId: string, pelunasanMethod: PaymentMethod) => {
    updateRentalStatus(rentalId, "active", 0, "", { method: pelunasanMethod });
  };

  return (
    <div className="space-y-5">
      {/* 1. Page Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-triva-crimson text-[10px] font-black tracking-wider uppercase mb-1">
            <Receipt className="w-3.5 h-3.5" />
            <span>
              {isAdminOrStaff
                ? activeView === "active"
                  ? "Meja Kasir & Sewa Aktif"
                  : "Arsip Transaksi Lampau"
                : activeView === "active"
                ? "Sewa Saya yang Sedang Berjalan"
                : "Riwayat Transaksi Saya"}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            {activeView === "active"
              ? isAdminOrStaff
                ? "Kasir & Sewa Berjalan"
                : "Sewa Saya (Aktif)"
              : "Riwayat Transaksi"}
          </h1>
          <p className="text-xs text-slate-500">
            {activeView === "active"
              ? "Pantau reservasi berjalan, verifikasi pembayaran DP, pelunasan saat serah-terima alat di toko, dan batas waktu kembali."
              : "Arsip lengkap transaksi persewaan yang telah selesai dikembalikan atau dibatalkan, bukti struk, dan rekap sewa."}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {activeView === "history" && isAdminOrStaff && (
            <button
              onClick={handleExport}
              className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-950/20 active:scale-95 transition-all flex items-center gap-1.5"
              title="Unduh Laporan ke Excel (.csv)"
            >
              <Download className="w-4 h-4" />
              <span>Export Excel</span>
            </button>
          )}

          <button
            onClick={() => setShowNewRentalModal(true)}
            className="px-4 py-2.5 bg-triva-crimson text-white rounded-xl text-xs font-bold shadow-md hover:bg-triva-crimson-700 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Buat Sewa Baru</span>
          </button>
        </div>
      </div>

      {/* 2. DUA FITUR TERPISAH: SEGMENTED SWITCH BAR */}
      <div className="bg-slate-200/80 p-1.5 rounded-2xl flex items-center gap-1.5 max-w-xl">
        <button
          type="button"
          onClick={() => handleSwitchView("active")}
          className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 select-none ${
            activeView === "active"
              ? "bg-white text-triva-crimson shadow-md"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>{isAdminOrStaff ? "Sewa Berjalan" : "Sewa Saya"}</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeView === "active"
                ? "bg-rose-100 text-triva-crimson"
                : "bg-slate-300 text-slate-700"
            }`}
          >
            {allActiveRentals.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchView("history")}
          className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 select-none ${
            activeView === "history"
              ? "bg-white text-slate-900 shadow-md"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Riwayat Transaksi</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeView === "history"
                ? "bg-slate-200 text-slate-900"
                : "bg-slate-300 text-slate-700"
            }`}
          >
            {allHistoryRentals.length}
          </span>
        </button>
      </div>

      {/* 3. Sub-Filters & Controls */}
      <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        {/* Periode filter hanya untuk Riwayat */}
        {activeView === "history" && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-triva-crimson" />
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Periode Riwayat:
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap text-xs font-bold">
              <button
                onClick={() => setTimeFilter("all")}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  timeFilter === "all"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                Semua Riwayat
              </button>
              <button
                onClick={() => setTimeFilter("today")}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  timeFilter === "today"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                }`}
              >
                Hari Ini
              </button>
              <button
                onClick={() => setTimeFilter("this_month")}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  timeFilter === "this_month"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-blue-50 text-blue-800 hover:bg-blue-100"
                }`}
              >
                Bulan Ini
              </button>
            </div>
          </div>
        )}

        {/* Status Pills & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar text-xs font-bold">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                statusFilter === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Semua ({timeFilteredRentals.length})
            </button>

            {activeView === "active" ? (
              <>
                <button
                  onClick={() => setStatusFilter("pending_dp")}
                  className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
                    statusFilter === "pending_dp"
                      ? "bg-amber-500 text-white shadow-xs"
                      : "bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>
                    Menunggu DP ({timeFilteredRentals.filter((r) => r.status === "pending_dp").length})
                  </span>
                </button>

                <button
                  onClick={() => setStatusFilter("confirmed")}
                  className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
                    statusFilter === "confirmed"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>
                    Siap Ambil di Toko ({timeFilteredRentals.filter((r) => r.status === "confirmed").length})
                  </span>
                </button>

                <button
                  onClick={() => setStatusFilter("active")}
                  className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
                    statusFilter === "active"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>
                    Sedang Digunakan ({timeFilteredRentals.filter((r) => r.status === "active").length})
                  </span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setStatusFilter("returned")}
                  className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
                    statusFilter === "returned"
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200"
                  }`}
                >
                  <span>✓ Selesai Dikembalikan ({timeFilteredRentals.filter((r) => r.status === "returned").length})</span>
                </button>

                <button
                  onClick={() => setStatusFilter("cancelled")}
                  className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
                    statusFilter === "cancelled"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "bg-rose-50 text-rose-900 hover:bg-rose-100 border border-rose-200"
                  }`}
                >
                  <span>✕ Dibatalkan ({timeFilteredRentals.filter((r) => r.status === "cancelled").length})</span>
                </button>
              </>
            )}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kode booking, nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-triva-crimson"
            />
          </div>
        </div>
      </div>

      {/* 4. Rentals List Container */}
      <div className="space-y-4">
        {displayRentals.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-xs text-slate-400 space-y-3 shadow-xs">
            {activeView === "active" ? (
              <>
                <Compass className="w-10 h-10 text-slate-300 mx-auto" />
                <div className="space-y-1">
                  <p className="font-black text-slate-700 text-sm">Tidak ada persewaan yang sedang berjalan</p>
                  <p className="text-[11px] text-slate-400">
                    Semua pesanan Anda telah selesai atau belum ada pesanan baru.
                  </p>
                </div>
                <Link
                  href="/dashboard/catalog"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-triva-crimson text-white font-bold text-xs shadow-sm hover:bg-triva-crimson-700 transition-colors"
                >
                  <Tent className="w-3.5 h-3.5" />
                  <span>Pilih Alat di Katalog</span>
                </Link>
              </>
            ) : (
              <>
                <History className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-700">Belum ada riwayat transaksi lampau</p>
              </>
            )}
          </div>
        ) : (
          displayRentals.map((r) => {
            const hasRemaining = r.remainingAmount > 0;

            return (
              <div
                key={r.id}
                className={`bg-white rounded-3xl border-2 transition-all duration-300 overflow-hidden shadow-xs hover:shadow-xl ${
                  r.status === "pending_dp"
                    ? "border-amber-400/80 ring-2 ring-amber-400/20"
                    : r.status === "confirmed"
                    ? "border-blue-400/80 ring-2 ring-blue-400/20"
                    : "border-slate-200/90 hover:border-triva-crimson/40"
                }`}
              >
                {/* 1. Header Bar: Boarding Pass Style Header with 3 Financial Metrics */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-3.5 border-b border-slate-800">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Booking Code Pill with Copy */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-xl font-mono text-xs sm:text-sm font-black text-rose-300">
                        <span>🎫</span>
                        <span>{r.bookingCode}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyBookingCode(r.bookingCode)}
                          className="text-slate-300 hover:text-white ml-1 p-0.5 rounded hover:bg-white/10 transition-colors"
                          title="Salin kode booking"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-xl uppercase tracking-wider flex items-center gap-1.5 ${
                          r.status === "pending_dp"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
                            : r.status === "confirmed"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                            : r.status === "active"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : r.status === "returned"
                            ? "bg-slate-800 text-slate-200 border border-slate-700"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        }`}
                      >
                        {r.status === "pending_dp" && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                        {r.status === "active" && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                        <span>
                          {r.status === "pending_dp"
                            ? "⏳ Perlu Persetujuan DP"
                            : r.status === "confirmed"
                            ? "✓ Siap Diambil di Toko"
                            : r.status === "active"
                            ? "⛺ Sedang Digunakan"
                            : r.status === "returned"
                            ? "✓ Selesai & Lunas"
                            : "✕ Dibatalkan"}
                        </span>
                      </span>

                      {/* Staff Approver Pill */}
                      {r.handledByStaffName && (
                        <span className="text-[11px] font-semibold text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl flex items-center gap-1">
                          <span>👨‍💼 Staf:</span>
                          <strong className="text-white font-bold">{r.handledByStaffName}</strong>
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400">
                      Jadwal Pemakaian: <strong>{r.startDate} s/d {r.endDate}</strong> ({r.durationDays} Hari Kalender)
                    </p>
                  </div>

                  {/* 3 Structured Financial Metric Boxes */}
                  <div className="grid grid-cols-3 gap-2 text-right bg-white/5 p-2 sm:p-2.5 rounded-2xl border border-white/10 shrink-0">
                    <div className="px-2">
                      <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Total Sewa
                      </span>
                      <span className="text-xs sm:text-sm font-black text-white block mt-0.5 truncate">
                        Rp {r.totalAmount.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <div className="px-2 border-x border-white/10 text-emerald-400">
                      <span className="text-[9px] sm:text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
                        DP Awal
                      </span>
                      <span className="text-xs sm:text-sm font-black block mt-0.5 truncate">
                        Rp {r.downPayment.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <div className="px-2 text-amber-300">
                      <span className="text-[9px] sm:text-[10px] font-bold text-amber-200 uppercase tracking-wider block">
                        {r.status === "active" || r.status === "returned" ? "Pelunasan" : "Sisa Toko"}
                      </span>
                      <span className="text-xs sm:text-sm font-black block mt-0.5 truncate">
                        {r.remainingAmount === 0 ? "✓ Lunas" : `Rp ${r.remainingAmount.toLocaleString("id-ID")}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Middle Body Content */}
                <div className="p-4 sm:p-5 space-y-4">
                  {/* Callout Pelunasan di Toko untuk status confirmed */}
                  {r.status === "confirmed" && (
                    <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div className="flex-1 text-xs leading-relaxed space-y-1">
                        <span className="font-extrabold block">
                          Pesanan Siap Diambil di Toko TRIVA!
                        </span>
                        <p className="text-[11px] text-blue-900">
                          {hasRemaining ? (
                            <>
                              Pelunasan sisa biaya sewa sebesar{" "}
                              <strong className="text-triva-crimson">
                                Rp {r.remainingAmount.toLocaleString("id-ID")}
                              </strong>{" "}
                              dilakukan langsung di meja kasir saat pengambilan barang (bisa Tunai atau QRIS toko).
                            </>
                          ) : (
                            <>Pembayaran telah lunas 100% di awal. Silakan lakukan serah terima alat di toko.</>
                          )}{" "}
                          Jangan lupa membawa <strong>{r.idCardType} fisik asli</strong> untuk dititipkan di brankas toko.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Callout untuk status active */}
                  {r.status === "active" && (
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-2">
                        <Compass className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          Alat sedang digunakan di lapangan. Batas jam pengembalian adalah pukul <strong>{settings.returnDeadlineHour} WIB</strong> pada {r.endDate}.
                        </span>
                      </div>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-md shrink-0">
                        KTP Aman di Brankas
                      </span>
                    </div>
                  )}

                  {/* Callout untuk status returned (Riwayat) */}
                  {r.status === "returned" && (
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-bold">
                          Sewa telah selesai. Kondisi alat telah diperiksa &amp; {r.idCardType} fisik asli telah diserahkan kembali kepada penyewa.
                        </span>
                      </div>
                      <span className="text-[10px] bg-slate-200 text-slate-700 font-black px-2 py-0.5 rounded-md shrink-0">
                        ✓ CLOSED / SELESAI
                      </span>
                    </div>
                  )}

                  {/* Customer & Gear List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Data Penyewa */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Informasi Penyewa:
                      </span>
                      <div className="font-bold text-slate-900 text-sm">{r.customerName}</div>
                      <div className="text-slate-600 font-medium">WhatsApp: {r.customerPhone}</div>
                      <div className="text-[11px] text-slate-500">
                        Jaminan: <strong>{r.idCardType} Fisik</strong>
                      </div>
                    </div>

                    {/* Rincian Pelunasan saat Ambil */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Status Finansial &amp; Pelunasan:
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Total Biaya Sewa:</span>
                        <strong className="text-slate-900">Rp {r.totalAmount.toLocaleString("id-ID")}</strong>
                      </div>
                      <div className="flex items-center justify-between text-emerald-700">
                        <span>DP Dibayar Online:</span>
                        <strong>Rp {r.downPayment.toLocaleString("id-ID")} ({r.paymentMethod.toUpperCase()})</strong>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                        <span className="font-bold text-slate-800">
                          {r.remainingAmount === 0 ? "Pelunasan:" : "Sisa Dilunasi di Toko:"}
                        </span>
                        <strong
                          className={r.remainingAmount === 0 ? "text-emerald-700" : "text-triva-crimson font-black"}
                        >
                          {r.remainingAmount === 0
                            ? `✓ LUNAS${r.pelunasanMethod ? ` (${r.pelunasanMethod.toUpperCase()})` : ""}`
                            : `Rp ${r.remainingAmount.toLocaleString("id-ID")}`}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Equipment Items */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                      Perlengkapan yang Disewa ({r.items.length} Unit Alat):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {r.items.map((i) => {
                        const gear = items.find((g) => g.id === i.itemId || g.unitCode === i.unitCode);

                        return (
                          <div
                            key={i.itemId}
                            className="p-2 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-2.5"
                          >
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                              {gear?.imageUrl ? (
                                <Image
                                  src={gear.imageUrl}
                                  alt={i.name}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                  <Tent className="w-4 h-4" />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[9px] font-black bg-slate-900 text-white px-1.5 py-0.2 rounded">
                                  {i.unitCode}
                                </span>
                              </div>
                              <h5 className="text-[11px] font-black text-slate-900 truncate mt-0.5">
                                {i.name}
                              </h5>
                              <div className="text-[10px] font-bold text-triva-crimson">
                                Rp {i.pricePerDay.toLocaleString("id-ID")}
                                <span className="text-[9px] text-slate-400 font-normal"> /hr</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. Action Bar */}
                <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleSendWa(r.customerPhone, r.bookingCode, r.customerName)}
                      className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Chat WhatsApp</span>
                    </button>

                    {/* Tombol Cetak Struk Nota Digital */}
                    <button
                      type="button"
                      onClick={() => setSelectedRentalForReceipt(r)}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-triva-crimson text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                    >
                      <Printer className="w-3.5 h-3.5 text-rose-300" />
                      <span>{activeView === "history" ? "Lihat Nota Selesai" : "Cetak Struk Nota"}</span>
                    </button>

                    {/* FITUR KHUSUS RIWAYAT: SEWA LAGI 1-KLIK */}
                    {activeView === "history" && (
                      <button
                        type="button"
                        onClick={() => handleReorderRental(r)}
                        className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-triva-crimson rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                        title="Sewa kembali perlengkapan yang sama dengan satu klik"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Sewa Lagi Alat Ini</span>
                      </button>
                    )}
                  </div>

                  {/* ACTION BUTTONS UNTUK STAF/KASIR PADA SEWA AKTIF */}
                  {isAdminOrStaff && activeView === "active" && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Step 1: Approval for pending_dp */}
                      {r.status === "pending_dp" && (
                        <>
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
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black active:scale-95 shadow-md shadow-emerald-950/20 transition-all flex items-center gap-1.5"
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
                            className="px-3 py-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 rounded-xl text-xs font-bold active:scale-95 transition-all flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Tolak</span>
                          </button>
                        </>
                      )}

                      {/* Step 2: Serah Terima & Pelunasan di Toko (confirmed -> active) */}
                      {r.status === "confirmed" && (
                        <button
                          type="button"
                          onClick={() => setSelectedRentalForHandover(r)}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-black active:scale-95 shadow-md shadow-emerald-950/20 transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>
                            {hasRemaining
                              ? `Pelunasan (Rp ${r.remainingAmount.toLocaleString("id-ID")}) & Serahkan Alat`
                              : "Serahkan Alat & Tahan KTP"}
                          </span>
                        </button>
                      )}

                      {/* Step 3: Pengembalian (active -> returned) */}
                      {r.status === "active" && (
                        <button
                          onClick={() => {
                            const penaltyInput = prompt(
                              `Pengembalian alat untuk ${r.customerName} (${r.bookingCode}):\n\nMasukkan denda keterlambatan / kerusakan jika ada (Isi 0 jika tidak ada):`,
                              "0"
                            );
                            if (penaltyInput === null) return;
                            const penaltyNum = parseInt(penaltyInput) || 0;
                            let penaltyNotes = "";
                            if (penaltyNum > 0) {
                              penaltyNotes =
                                prompt("Catatan denda (misal: Terlambat 1 hari, tenda robek):", "") ||
                                "Denda keterlambatan/kerusakan";
                            }
                            updateRentalStatus(r.id, "returned", penaltyNum, penaltyNotes);
                          }}
                          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black active:scale-95 shadow-md transition-all flex items-center gap-1.5"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Pemeriksaan Kembali &amp; Serahkan KTP</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. Modal Serah Terima Alat & Pelunasan Kasir */}
      {selectedRentalForHandover && (
        <ModalHandoverSettlement
          rental={selectedRentalForHandover}
          onClose={() => setSelectedRentalForHandover(null)}
          onConfirm={handleConfirmHandoverSettlement}
        />
      )}

      {/* 6. Modal Cetak Kwitansi / Struk Nota */}
      {selectedRentalForReceipt && (
        <ModalReceipt
          rental={selectedRentalForReceipt}
          onClose={() => setSelectedRentalForReceipt(null)}
        />
      )}
    </div>
  );
}

export default function RentalsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center p-8 text-stone-500 font-medium">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-triva-crimson border-t-transparent rounded-full animate-spin" />
            <span>Memuat Manajemen Sewa &amp; Riwayat TRIVA...</span>
          </div>
        </div>
      }
    >
      <RentalsContent />
    </Suspense>
  );
}
