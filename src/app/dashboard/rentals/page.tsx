"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import ModalReceipt from "@/components/ModalReceipt";
import { RentalTransaction } from "@/types";
import {
  Receipt,
  Search,
  PlusCircle,
  MessageCircle,
  FileText,
  CheckCircle,
  CheckCheck,
  XCircle,
  AlertCircle,
  Clock,
  Shield,
  Layers,
  Download,
  Calendar,
  Filter,
  DollarSign,
  TrendingUp,
  Printer,
  Copy,
  Tent,
} from "lucide-react";
import { exportRentalsToExcel } from "@/lib/exportExcel";

export default function RentalsPage() {
  const { rentals, items, currentUser, setShowNewRentalModal, updateRentalStatus, settings, notify } = useApp();
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "active" | "returned">("all");
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "this_month" | "custom">("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [selectedRentalForReceipt, setSelectedRentalForReceipt] = useState<RentalTransaction | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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

  // Filter awal berdasarkan periode waktu
  const timeFilteredRentals = rentals.filter((r) => {
    if (currentUser.role === "customer" && r.customerId !== currentUser.id) return false;
    const recordDate = r.createdAt ? r.createdAt.slice(0, 10) : r.startDate;

    if (timeFilter === "today" && recordDate !== todayStr) return false;
    if (timeFilter === "this_month" && !recordDate.startsWith(currentMonthStr)) return false;
    if (timeFilter === "custom") {
      if (customStartDate && recordDate < customStartDate) return false;
      if (customEndDate && recordDate > customEndDate) return false;
    }
    return true;
  });

  const pendingCount = timeFilteredRentals.filter((r) => r.status === "pending_dp").length;
  const confirmedCount = timeFilteredRentals.filter((r) => r.status === "confirmed").length;
  const activeCount = timeFilteredRentals.filter((r) => r.status === "active").length;
  const returnedCount = timeFilteredRentals.filter((r) => r.status === "returned").length;

  const displayRentals = timeFilteredRentals.filter((r) => {
    if (filter === "pending" && r.status !== "pending_dp") return false;
    if (filter === "confirmed" && r.status !== "confirmed") return false;
    if (filter === "active" && r.status !== "active") return false;
    if (filter === "returned" && r.status !== "returned") return false;

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

  const periodTotalOmset = displayRentals.reduce((sum, r) => sum + r.totalAmount, 0);
  const periodTotalDp = displayRentals.reduce((sum, r) => sum + r.downPayment, 0);
  const periodTotalRemaining = displayRentals.reduce((sum, r) => sum + r.remainingAmount, 0);

  const handleExport = () => {
    let label = "Semua_Transaksi";
    if (timeFilter === "today") {
      label = `Harian_${todayStr}`;
    } else if (timeFilter === "this_month") {
      label = `Bulanan_${currentMonthStr}`;
    } else if (timeFilter === "custom") {
      label = `Kustom_${customStartDate || "Awal"}_sd_${customEndDate || "Sekarang"}`;
    }
    exportRentalsToExcel(displayRentals, label);
  };

  const handleSendWa = (phone: string, code: string, name: string) => {
    const text = encodeURIComponent(
      `Halo Kak *${name}*, terima kasih telah memesan alat di TRIVA Outdoor (Kode: *${code}*). Kami siap melayani serah-terima di toko kami.`
    );
    window.open(`https://wa.me/${phone.replace(/^0/, "62")}?text=${text}`, "_blank");
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-triva-crimson text-[10px] font-black tracking-wider uppercase mb-1">
            <Receipt className="w-3.5 h-3.5" />
            <span>{isAdminOrStaff ? "Meja Kasir & Audit Transaksi" : "Pesanan Sewa Saya"}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            {isAdminOrStaff ? "Manajemen Transaksi Sewa" : "Daftar Reservasi & Sewa"}
          </h1>
          <p className="text-xs text-slate-500">
            {isAdminOrStaff
              ? "Persetujuan verifikasi DP, serah-terima alat di toko, jaminan KTP fisik, dan rekapitulasi laporan."
              : "Pantau status persetujuan verifikasi DP alat sewa Anda dan info pengambilan di toko."}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isAdminOrStaff && (
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

      {/* 1. Bar Filter Periode Waktu (Harian, Bulanan, Kustom) */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-triva-crimson" />
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Periode Laporan:
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
              Semua Waktu
            </button>
            <button
              onClick={() => setTimeFilter("today")}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                timeFilter === "today"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              <span>☀️ Hari Ini</span>
            </button>
            <button
              onClick={() => setTimeFilter("this_month")}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                timeFilter === "this_month"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-blue-50 text-blue-800 hover:bg-blue-100"
              }`}
            >
              <span>📆 Bulan Ini</span>
            </button>
            <button
              onClick={() => setTimeFilter("custom")}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                timeFilter === "custom"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-amber-50 text-amber-800 hover:bg-amber-100"
              }`}
            >
              <span>⚙️ Kustom Tanggal</span>
            </button>
          </div>
        </div>

        {/* Panel Input Tanggal Kustom (Jika tombol Kustom dipilih) */}
        {timeFilter === "custom" && (
          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center gap-3 text-xs">
            <span className="font-bold text-amber-950 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-amber-700" />
              Rentang Tanggal:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <label className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                Dari:
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 bg-white font-mono"
                />
              </label>
              <label className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                Sampai:
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 bg-white font-mono"
                />
              </label>
              {(customStartDate || customEndDate) && (
                <button
                  onClick={() => {
                    setCustomStartDate("");
                    setCustomEndDate("");
                  }}
                  className="px-2 py-1 text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100"
                >
                  Reset Tanggal
                </button>
              )}
            </div>
          </div>
        )}

        {/* 2. Ringkasan Keuangan Periode Terpilih (Khusus Staf & Admin) */}
        {isAdminOrStaff && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                Transaksi Periode Ini
              </span>
              <span className="text-sm font-black text-slate-900 mt-0.5 block">
                {displayRentals.length} Order
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100">
              <span className="text-[10px] font-semibold text-rose-700 block uppercase">
                Total Omset
              </span>
              <span className="text-sm font-black text-rose-950 mt-0.5 block">
                Rp {periodTotalOmset.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[10px] font-semibold text-emerald-700 block uppercase">
                Uang Masuk (DP/Kas)
              </span>
              <span className="text-sm font-black text-emerald-900 mt-0.5 block">
                Rp {periodTotalDp.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
              <span className="text-[10px] font-semibold text-amber-800 block uppercase">
                Sisa Tagihan di Toko
              </span>
              <span className="text-sm font-black text-amber-950 mt-0.5 block">
                Rp {periodTotalRemaining.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Filter Status Operasional & Pencarian */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar text-xs font-bold -mx-1 px-1">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              filter === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Semua Status ({timeFilteredRentals.length})
          </button>

          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              filter === "pending"
                ? "bg-amber-500 text-white shadow-xs font-black"
                : "text-amber-800 bg-amber-50 hover:bg-amber-100"
            }`}
          >
            <span>Perlu Verifikasi DP ({pendingCount})</span>
            {pendingCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setFilter("confirmed")}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              filter === "confirmed"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-blue-700 bg-blue-50 hover:bg-blue-100"
            }`}
          >
            Siap Diambil ({confirmedCount})
          </button>

          <button
            onClick={() => setFilter("active")}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              filter === "active"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
            }`}
          >
            Sedang Digunakan ({activeCount})
          </button>

          <button
            onClick={() => setFilter("returned")}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              filter === "returned"
                ? "bg-slate-700 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Selesai ({returnedCount})
          </button>
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

      {/* Rentals List Container with Elevated Modern Cards */}
      <div className="space-y-4">
        {displayRentals.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-xs text-slate-400 space-y-2 shadow-xs">
            <Receipt className="w-8 h-8 text-slate-300 mx-auto" />
            <p>Tidak ada transaksi sewa pada filter ini.</p>
          </div>
        ) : (
          displayRentals.map((r) => {
            const initials = r.customerName
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((w) => w[0])
              .join("")
              .toUpperCase() || "TR";

            return (
              <div
                key={r.id}
                className={`bg-white rounded-3xl border-2 transition-all duration-300 overflow-hidden shadow-xs hover:shadow-xl ${
                  r.status === "pending_dp"
                    ? "border-amber-400/80 ring-2 ring-amber-400/20"
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
                            ? "✓ Selesai"
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
                      Tercatat di Cloud Supabase &bull; Jadwal {r.startDate} s/d {r.endDate} ({r.durationDays} Hari Kalender)
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
                        DP ({r.paymentMethod.toUpperCase()})
                      </span>
                      <span className="text-xs sm:text-sm font-black block mt-0.5 truncate">
                        Rp {r.downPayment.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <div className="px-2 text-amber-300">
                      <span className="text-[9px] sm:text-[10px] font-bold text-amber-200 uppercase tracking-wider block">
                        Sisa Toko
                      </span>
                      <span className="text-xs sm:text-sm font-black block mt-0.5 truncate">
                        Rp {r.remainingAmount.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Middle Body Content */}
                <div className="p-4 sm:p-5 space-y-4">
                  
                  {/* Callout Khusus Pemesanan pending_dp */}
                  {r.status === "pending_dp" && (
                    <div
                      className={`p-3.5 rounded-2xl border flex items-start gap-2.5 ${
                        isAdminOrStaff
                          ? "bg-amber-100/80 border-amber-300 text-amber-950"
                          : "bg-amber-50 border-amber-200 text-amber-950"
                      }`}
                    >
                      {isAdminOrStaff ? (
                        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-spin" />
                      )}
                      <div className="flex-1 text-xs leading-relaxed">
                        <div className="font-extrabold flex items-center gap-1.5 flex-wrap">
                          <span>
                            {isAdminOrStaff
                              ? "Pesanan Masuk dari Aplikasi • Menunggu Verifikasi Staf Kasir"
                              : "⏳ Pembayaran DP Anda Sedang Diverifikasi oleh Staf Toko TRIVA"}
                          </span>
                          <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-black">
                            DP: Rp {r.downPayment.toLocaleString("id-ID")} ({r.paymentMethod.toUpperCase()})
                          </span>
                        </div>
                        <p className="text-amber-800 text-[11px] mt-0.5">
                          {isAdminOrStaff ? (
                            <>
                              Cek mutasi rekening/QRIS toko TRIVA. Jika dana DP sudah masuk, klik tombol{" "}
                              <strong>&quot;Verifikasi DP &amp; Setujui&quot;</strong> di bawah agar pesanan
                              terkonfirmasi dan unit dipacking.
                            </>
                          ) : (
                            <>
                              Mohon menunggu, staf toko sedang mencocokkan konfirmasi DP dengan mutasi kas toko TRIVA.
                              Setelah disetujui, pesanan akan berstatus <strong>&quot;Siap Diambil di Toko&quot;</strong>{" "}
                              dan Anda dapat mengambil alat dengan membawa KTP fisik asli.
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Customer Info & Rental Itinerary (Grid 2 Kolom Cantik) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* Left: Customer Profile & Physical Guarantee Stamp */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-start gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-triva-crimson to-rose-700 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Penyewa Utama:
                        </span>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                          {r.customerName}
                        </h4>
                        <div className="text-[11px] font-mono text-slate-600 mt-0.5 flex items-center gap-1.5">
                          <span>📱 {r.customerPhone}</span>
                        </div>
                        
                        {/* Stempel Jaminan Fisik Wajib */}
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-[11px] font-black">
                          <Shield className="w-3 h-3 text-triva-crimson" />
                          <span>Jaminan Fisik: <strong className="underline">{r.idCardType} Asli di Brankas</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Itinerary Schedule & Return Terms */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-start gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white font-black flex flex-col items-center justify-center shrink-0 shadow-md">
                        <span className="text-[8px] uppercase font-bold text-rose-300">DURASI</span>
                        <span className="text-xs leading-none mt-0.5">{r.durationDays} HARI</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Jadwal Pemakaian Alat:
                        </span>
                        <div className="text-xs font-bold text-slate-900 mt-0.5 flex items-center gap-1.5 flex-wrap">
                          <span className="bg-white px-2 py-0.5 rounded-lg border border-slate-200 font-mono text-[11px]">
                            {r.startDate}
                          </span>
                          <span className="text-slate-400">&rarr;</span>
                          <span className="bg-white px-2 py-0.5 rounded-lg border border-slate-200 font-mono text-[11px]">
                            {r.endDate}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                          ⏰ <em>Batas pengembalian alat: Pukul {settings.returnDeadlineHour || "21:00"} WIB di hari terakhir.</em>
                        </p>
                        {r.notes && (
                          <div className="text-[11px] text-slate-600 italic mt-1 bg-white p-1.5 rounded-lg border border-slate-100">
                            Catatan: &ldquo;{r.notes}&rdquo;
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 3. Visual Equipment Showcase (DENGAN FOTO ASLI ALAT DARI INVENTARIS) */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-triva-crimson" />
                        <span>Perlengkapan yang Disewa ({r.items.length} Unit Alat):</span>
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        Total {r.items.reduce((s, it) => s + (it.qty || 1), 0)} unit fisik
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {r.items.map((i) => {
                        const gear = items.find((g) => g.id === i.itemId || g.unitCode === i.unitCode);

                        return (
                          <div
                            key={i.itemId}
                            className="p-2 bg-slate-50 border border-slate-200 hover:border-triva-crimson rounded-2xl flex items-center gap-2.5 transition-all hover:bg-white shadow-2xs"
                          >
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                              {gear?.imageUrl ? (
                                <Image
                                  src={gear.imageUrl}
                                  alt={i.name}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                  <Tent className="w-5 h-5" />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[9px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded">
                                  {i.unitCode}
                                </span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase truncate">
                                  {gear?.categoryName || "Outdoor"}
                                </span>
                              </div>
                              <h5 className="text-xs font-black text-slate-900 truncate mt-0.5">
                                {i.name}
                              </h5>
                              <div className="text-[11px] font-bold text-triva-crimson">
                                Rp {i.pricePerDay.toLocaleString("id-ID")}
                                <span className="text-[9px] text-slate-400 font-normal"> /hr &bull; {i.qty} unit</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 4. Action Bar: Chat WhatsApp, Cek KTP, Cetak Struk Nota, & Tindakan Kasir */}
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

                    {r.ktpPhotoUrl ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.open(r.ktpPhotoUrl, "_blank");
                        }}
                        className="px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                        title="Buka foto jaminan KTP fisik"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                        <span>Lihat Foto KTP</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium px-2 py-1">
                        Jaminan: KTP Fisik di Brankas
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Tombol Cetak Struk Nota Digital */}
                    <button
                      type="button"
                      onClick={() => setSelectedRentalForReceipt(r)}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-triva-crimson text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
                    >
                      <Printer className="w-3.5 h-3.5 text-rose-300" />
                      <span>Cetak Struk Nota</span>
                    </button>

                    {/* ACTION BUTTONS: HANYA PETUGAS & ADMIN YANG DAPAT MENYETUJUI / MENGUBAH STATUS */}
                    {isAdminOrStaff ? (
                      <div className="flex items-center gap-1.5">
                        {/* Action 1: Approval for pending_dp */}
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

                        {/* Action 2: Serah Terima Alat (confirmed -> active) */}
                        {r.status === "confirmed" && (
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  `Serah terima alat kepada ${r.customerName}?\n\nPastikan KTP fisik asli sudah diterima dan disimpan di brankas.`
                                )
                              ) {
                                updateRentalStatus(r.id, "active");
                              }
                            }}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black active:scale-95 shadow-md transition-all flex items-center gap-1.5"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Serahkan Alat &amp; Tahan KTP</span>
                          </button>
                        )}

                        {/* Action 3: Pengembalian (active -> returned) */}
                        {r.status === "active" && (
                          <button
                            onClick={() => {
                              const isGood = confirm("Apakah alat dikembalikan dalam kondisi lengkap & bersih?");
                              if (isGood) {
                                updateRentalStatus(r.id, "returned");
                              } else {
                                const penalty = prompt("Masukkan nominal denda/ganti rugi (Rp):", "25000");
                                const notes = prompt("Catatan denda (misal: pasak hilang 2 pcs):", "Pasak tenda hilang");
                                if (penalty) {
                                  updateRentalStatus(r.id, "returned", Number(penalty), notes || "");
                                }
                              }
                            }}
                            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black active:scale-95 shadow-md transition-all flex items-center gap-1.5"
                          >
                            <span>Cek Fisik &amp; Selesai</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      /* TAMPILAN READ-ONLY UNTUK KONSUMEN: KONSUMEN TIDAK MEMILIKI HAK AKSES PERSETUJUAN */
                      <div className="flex items-center gap-2">
                        {r.status === "pending_dp" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl font-bold text-xs">
                            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                            <span>Menunggu Verifikasi Toko</span>
                          </span>
                        )}
                        {r.status === "confirmed" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl font-bold text-xs">
                            <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                            <span>Disetujui &bull; Siap Diambil di Toko</span>
                          </span>
                        )}
                        {r.status === "active" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-bold text-xs">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Sedang Anda Sewa (Kembalikan Tepat Waktu)</span>
                          </span>
                        )}
                        {r.status === "returned" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs">
                            ✓ Sewa Selesai &amp; KTP Sudah Dikembalikan
                          </span>
                        )}
                        {r.status === "cancelled" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-xl font-bold text-xs">
                            ✕ Pesanan Dibatalkan
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Cetak Struk Nota Digital */}
      <ModalReceipt
        rental={selectedRentalForReceipt}
        onClose={() => setSelectedRentalForReceipt(null)}
        storeName={settings.storeName}
        storePhone={settings.storePhoneWa}
        storeAddress={settings.storeAddress}
      />
    </div>
  );
}
